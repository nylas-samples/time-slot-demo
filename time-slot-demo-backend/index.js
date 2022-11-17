const express = require('express');

const app = express();
  
  
/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require('cors')
app.use(cors())

const availability = require('./routes/availability')
const events = require('./routes/events')
  
app.get('/', (req, res, next) => {
    res.send({"Status": 200});
})

app.use('/availability', availability);
app.use('/events', events)

const server = app.listen(3001, function () {
    console.log("Server Running on port 3001")
})