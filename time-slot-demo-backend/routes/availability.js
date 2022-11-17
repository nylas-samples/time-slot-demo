require("dotenv").config()
const Nylas = require('nylas')
const {Days} = require('nylas/lib/models/calendar-availability')
const express = require('express')
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

Nylas.config({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

router.post('/', authMiddleware, async (req, res) => {


    try {
        const nylas = req.nylasAPI;

        let { start_time, end_time, duration_minutes } = req.body

        const availability = await nylas.calendars.availability({
            startTime: start_time,
            endTime: end_time,
            interval: parseInt(process.env.INTERVAL_MINUTES),
            duration: duration_minutes,
            emails: [process.env.EMAIL],
            openHours: [
                {
                emails: [process.env.EMAIL],
                days: [Days.Monday, Days.Tuesday, Days.Wednesday, Days.Thursday, Days.Friday],
                timezone: 'America/Chicago',
                start: '8:00',
                end: '18:00',
                },
            ],
        })

        res.status(200).send(availability);
    } catch(err) {
        console.log(err)
        res.status(400).send(err)
    }

})

module.exports = router