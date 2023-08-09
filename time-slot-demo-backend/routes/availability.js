require("dotenv").config()
const Nylas = require('nylas')
const {Days} = require('nylas/lib/models/calendar-availability')
const express = require('express')
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const NylasV3 = require('../nylas_wrapper/nylas')

Nylas.config({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

router.post('/', async (req, res) => {


    try {
        const nylas = new NylasV3(process.env.API_KEY);

        let { start_time, end_time, duration_minutes } = req.body

        const availability = await nylas.getAvailability(process.env.GRANT_ID, start_time, end_time, duration_minutes)

        res.status(200).send(availability.data);
    } catch(err) {
        console.log(err)
        res.status(400).send(err)
    }

})

module.exports = router