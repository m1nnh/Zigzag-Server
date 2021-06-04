const nodemailer = require('nodemailer'); 
const secret_config = require('../config/secret');

const smtpTransport = nodemailer.createTransport(

    { service: "Gmail", auth: { user: "alsgur961010@gmail.com", pass: "wlsgkrp351@" }, 
    tls: { rejectUnauthorized: false } });


module.exports = smtpTransport;
