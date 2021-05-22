const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'minhyeok.cedbpncgweti.ap-northeast-2.rds.amazonaws.com',
    user: 'minh',
    port: '3306',
    password: 'wlsgkrp3512',
    database: 'zigzag'
});

module.exports = {
    pool: pool
};