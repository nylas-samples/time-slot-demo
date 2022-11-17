require("dotenv").config()
const Nylas = require("nylas");

Nylas.config({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

module.exports = (req, res, next) => {
  try {
    const nylas = Nylas.with(process.env.ACCESS_TOKEN);
    req.nylasAPI = nylas;
    next();
  } catch (error) {
    res.status(401).send("Not a valid token!");
  }
};
