const axios = require('axios');

//https://developer.nylas.com/docs/v3-beta/?_gl=1*13aoe32*_ga*MTU1ODg1MjUwNi4xNjgyMTEwNjU3*_ga_5LVXVXFW0C*MTY4NTczODkwMy4xNy4xLjE2ODU3Mzg5MDMuNjAuMC4w

module.exports = class NylasV3{
    constructor(apiKey){
        this.baseUrl = "https://api.us.nylas.com/v3";
        axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    }

    async getCalendars(grantId){
        const data = await axios.get(`${this.baseUrl}/grants/${grantId}/calendars`);
        return data;
    }

    async getCalendarById(grantId, calendarId){
        const data = await axios.get(`${this.baseUrl}/grants/${grantId}/calendars/${calendarId}`);
        return data;
    }

    async getEvents(grantId, calendarId){
        const data = await axios.get(`${this.baseUrl}/grants/${grantId}/events?calendar_id=${calendarId}`);
        return data;
    }

    async getEventById(grantId, calendarId, eventID){
        const data = await axios.get(`${this.baseUrl}/grants/${grantId}/events/${eventID}?calendar_id=${calendarId}`);
        return data;
    }

    async createEvent(grantId, event){
        const data = await axios.post(`${this.baseUrl}/grants/${grantId}/events?calendar_id=${calendarId}`, event);
        return data;
    }

    async getAvailability(grantId, start_time, end_time, duration_minutes, participants){
        console.log(this.baseUrl)

        const availability = {
            "start_time": start_time,
            "end_time": end_time,
            "interval_minutes": 30,
            "duration_minutes": duration_minutes,
            "participants": [
                {
                    "email": "chase.w@nylas.com",
                    "calendar_ids": ["chase.w@nylas.com"]
                }
            ],
        }

        console.log("Availability: ", availability)
        const data = await axios.post(`${this.baseUrl}/calendars/availability`, availability,
        {
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json",
                'Accept': 'applicatoin/json'
            }
        })
        return data;
    }

}