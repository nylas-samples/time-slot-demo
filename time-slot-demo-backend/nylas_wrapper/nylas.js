const axios = require('axios');

//https://developer.nylas.com/docs/v3-beta/?_gl=1*13aoe32*_ga*MTU1ODg1MjUwNi4xNjgyMTEwNjU3*_ga_5LVXVXFW0C*MTY4NTczODkwMy4xNy4xLjE2ODU3Mzg5MDMuNjAuMC4w

module.exports = class NylasV3{
    constructor(apiKey){
        this.baseUrl = "https://api.nylas.com/v3";
        axios.defaults.headers.common['Authorization'] = `Basic ${apiKey}`;
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
        const availability = {
            start_time: start_time,
            end_time: end_time,
            interval_minutes: parseInt(process.env.INTERVAL_MINUTES),
            duration_minutes: duration_minutes,
            participants: participants
        }
        const data = await axios.post(`${this.baseUrl}/calendars/availability`, availability)
        return data;
    }

}