const nodemailer = require('nodemailer');

const config = require('.');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: process.env.NODE_ENV === 'production',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

module.exports = transporter;
