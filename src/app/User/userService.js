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

// Sign-In
exports.postSignIn = async function (email, password) {
    try {
        // Hashed Password
        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

        const signInResponse = await userProvider.loginCheck(email, hashedPassword);

        // Validation Check (Response Error)
        if (signInResponse[0].userPassword !== hashedPassword)
            return res.send(response(baseResponse.SIGNIN_PASSWORD_WRONG)); // 3004 : 비밀번호가 잘못 되었습니다.

        if (signInResponse[0].status == 'Y')
            return res.send(response(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT)); // 3006 : 탈퇴 된 계정입니다. 고객센터에 문의해주세요.

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userIdx: signInResponse[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userIdx': signInResponse[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// Logout
exports.logout = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const logoutResult = await userDao.userLogout(connection, userIdx);

    connection.release();

    return logoutResult;
}

// Patch All
exports.editUser = async function (userPhoneNum, userName, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateAllResult = await userDao.updateAll(connection, [userPhoneNum, userName, userIdx]);

    connection.release();

    return updateAllResult;
}

// Patch Name
exports.editName = async function (userIdx, userName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateNameResult = await userDao.updateName(connection, [userIdx, userName]);

    connection.release();

    return updateNameResult;
}

// Patch PhoneNum
exports.editPhoneNum = async function (userIdx, userPhoneNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updatePhoneNumResult = await userDao.updateAll(connection, [userIdx, userPhoneNum]);

    connection.release();

    return updatePhoneNumResult;
}

// Patch Password
exports.patchPassword = async function (email, hashedPassword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updatePasswordResult = await userDao.updatePassword(connection, [email, hashedPassword]);

    connection.release();

    return updatePasswordResult;
}