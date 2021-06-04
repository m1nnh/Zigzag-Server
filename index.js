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

schedule.scheduleJob('0 0 18 * * *', async function() {
    console.log('현재 ' + new Date());
   

});

schedule.scheduleJob('0 0 0 * * *', async function() {
    let now = new Date();
    let today = now.getFullYear()+ '-' + (now.getMonth()+1).toString().padStart(2,'0') + '-' + now.getDate().toString().padStart(2,'0');
    let yesterday = new Date(now.setDate(now.getDate() - 1));
    yesterday = yesterday.getFullYear()+ '-' + (yesterday.getMonth()+1).toString().padStart(2,'0') + '-' + yesterday.getDate().toString().padStart(2,'0');

    }
);

