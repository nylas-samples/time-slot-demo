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
                duration_minutes: 30
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
                        
                    return <BookingList className='booking-list' key={data[item]} data={data} item={item} setIsLoading={setIsLoading} setError={setError} setBooking={setBooking} setData={setData} booking={booking} />

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