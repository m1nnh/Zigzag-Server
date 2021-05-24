const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// Sign-Up
exports.createUser = async function (email, password, phoneNum, smsFlag, emailFlag) {
    try {
        // Password Hash
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const connection = await pool.getConnection(async (conn) => conn);
        const signUpResult = await userDao.insertUser(connection, [email, hashedPassword, phoneNum, smsFlag, emailFlag]);

        console.log(`추가된 회원 : ${signUpResult[0].insertId}`)
        connection.release();

        return signUpResult[0].insertId;

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

