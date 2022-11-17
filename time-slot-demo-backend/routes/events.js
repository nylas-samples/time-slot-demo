require("dotenv").config()
const Nylas = require('nylas')
const {Days} = require('nylas/lib/models/calendar-availability')
const express = require('express')
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { default: EventParticipant } = require("nylas/lib/models/event-participant");
const { default: Event } = require("nylas/lib/models/event");

Nylas.config({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const nylas = req.nylasAPI;

        let {start_time, end_time, participants} = req.body;

        const event = new Event(nylas);

        event.participants = []
        participants.forEach(element => {
            event.participants.push(new EventParticipant({email: element.email, status: 'yes'}))
        });
        event.when.startTime = start_time;
        event.when.endTime = end_time;
        event.calendarId = 'e42boze3hhhf8fbtxtm1sfl65'
        event.title = 'Booking Slot'
        event.busy = true

        const bookedEvent = await event.save({notify_participants: true})

        res.status(200).send(bookedEvent)

    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

module.exports = router
