const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  // port: 587,
  // secure: false,
  // requireTLS: true,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});

module.exports = transporter;