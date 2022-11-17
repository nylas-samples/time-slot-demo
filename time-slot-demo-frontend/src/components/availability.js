import { addDays } from 'date-fns';
import { useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import BookingList from './availabilityHelpers/bookingItem';

const Availability = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState()
    const [booking, setBooking] = useState()
    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
    ]);

    const handleClick = async () => {

        try {
            setIsLoading(true);
            setData({});
            setError();
            axios
            .post("http://localhost:3001/availability", {
                start_time: state[0].startDate.getTime() / 1000,
                end_time: state[0].endDate.getTime() / 1000,
                duration_minutes: 180
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'applicatoin/json',
                    'Authorization': `Basic ${process.env.REACT_APP_NYLAS_ACCESS_TOKEN}`
                }
            })
            .then(response => {
                setIsLoading(false);
                let sorted = {}
                response.data.time_slots.forEach(item => {
                    const key = (new Date(item.start_time * 1000)).getDate()
                    if(`${key}` in sorted){
                        sorted[`${key}`].push(item)
                    } else {
                        sorted[`${key}`] = [item]
                    }
                })
                setData(sorted)
                // setData(response.data.time_slots);
            })
            .catch(error => {
                setIsLoading(false);
                setError(error);
                console.log(error);
            })
        } catch (err) {
            console.log(err)
            setError(err)
        }
    }

    const handleBooking = async (eventStart, eventEnd, participants) => {

        try{
            setIsLoading(true);
            setError();
            axios
                .post("http://localhost:3001/events", {
                    start_time: eventStart,
                    end_time: eventEnd,
                    participants: participants
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'applicatoin/json',
                        'Authorization': `Basic ${process.env.REACT_APP_NYLAS_ACCESS_TOKEN}`
                    }
                })
                .then(response => {
                    setIsLoading(false);
                    setBooking(response);
                    console.log(booking);
                    setData({});
                })
                .catch(error => {
                    setIsLoading(false);
                    setError(error);
                    console.log(error);
                })
        } catch (err) {

        }
    }

    const getDate = (timestampStart, timestampEnd) => {
        const dateStart = new Date(timestampStart * 1000)
        const dateEnd = new Date(timestampEnd * 1000)

        const timeFormat = {
            date: `${dateStart.getMonth() + 1}/${dateStart.getDate()}/${dateStart.getFullYear()}`,
            start_time: `${dateStart.getHours()}:${dateStart.getMinutes() === 0 ? '00' : dateStart.getMinutes()}`,
            end_time: `${dateEnd.getHours()}:${dateEnd.getMinutes() === 0 ? '00' : dateEnd.getMinutes()}`
        }

        return timeFormat
    }

    return(
        <div className='availability-component-wrapper'>

            <div className='availability-config'>

                <DateRangePicker
                    onChange={item => setState([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 30)}
                    ranges={state}
                    direction="vertical"
                />

                <button className='availability-button' onClick={handleClick}>Get Availability</button>

            </div>

            <div className='availibility-display'>
                {error && <h2>{error.message}</h2>}

                {isLoading && <h2>Loading...</h2>}

                {(!data && !isLoading) && <h2>Select Dates to Find Availability</h2>}

                {data && <div className='list-wrapper'>
                    {Object.keys(data).map(function(item){

                    return <BookingList className='booking-list' key={item} data={data} item={item} setIsLoading={setIsLoading} setError={setError} setBooking={setBooking} setData={setData} booking={booking} />

                    })}
                </div>
                }

                {booking &&
                <div>
                    <p>Booking confirmed!</p>
                </div>
                }
            </div>
        </div>
    )
}

export default Availability;