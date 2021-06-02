const express = require('./config/express');
const {logger} = require('./config/winston');

let port;

if (process.env.NODE_ENV === 'development') {
    port = 9000;
} else {
    port = 3000;
}


express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);