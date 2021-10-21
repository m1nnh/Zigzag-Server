const nodemailer = require('nodemailer');
const secret_config = require('../config/secret');

const smtpTransport = nodemailer.createTransport(

    {
        service: "Gmail", auth: { user: "[email]", pass: "[password]" },
        tls: { rejectUnauthorized: false }
    });


module.exports = smtpTransport;
