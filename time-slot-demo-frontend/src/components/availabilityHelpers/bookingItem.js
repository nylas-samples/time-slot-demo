import axios from 'axios';

const BookingList = ({data, item, setIsLoading, setError, setBooking, setData, booking}) => {

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

    const handleBooking = async (eventStart, eventEnd, participants, setIsLoading, setError, setBooking, setData, booking) => {

        try{
            setIsLoading(true);
            setError();
            axios
                .post("http://localhost:3001/events", {
                    start_time: eventStart / 1000,
                    end_time: eventEnd / 1000,
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

    return (
        <div>
            <h2>{item}</h2>
            {data[item].map(function(value){
                const dateRange = getDate(value.start_time, value.end_time)
                return (
                    <div className="booking-time" key={value.end_time}>
                        <div className='time-wrapper'>
                            <h3 className='time'>{dateRange["date"]}</h3>
                            <p className='time'>{`${dateRange.start_time} - ${dateRange.end_time}`}</p>
                        </div>
                        <button className='book-button' onClick={() => handleBooking(item.start_time, item.end_time, [{email: 'chase.w@nylas.com'}], setIsLoading, setError, setBooking, setData, booking)}>Book</button>
                    </div>
                )
            })}
        </div>
    )
}

export default BookingList