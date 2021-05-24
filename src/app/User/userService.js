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

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].userEmail

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        console.log(passwordRows);
        if (passwordRows[0].userPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "Y") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].userIdx) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userIdx: userInfoRows[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "User",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userPhoneNum, userName, userIdx) {
    try {
        const updateUserParams = [userPhoneNum, userName, userIdx]
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, updateUserParams)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editrePayAccount = async function (rePayAccount, rePayBank, userIdx){
    try {
        const updaterePayBankParams = [rePayAccount, rePayBank, userIdx]
        const connection = await pool.getConnection(async (conn) => conn);
        const editrePayResult = await userDao.updaterePayBank(connection, updaterePayBankParams)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editrePayAccount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editSetting = async function (smsFlag ,emailFlag ,notiFlag ,userIdx) {
    try {
        const updateSettingParams = [smsFlag ,emailFlag ,notiFlag ,userIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const updateSettingResult = await userDao.updateSetting(connection, updateSettingParams)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editSetting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
// exports.editPayAccount = async function (payAccount, payBank, userIdx){
//     try {
//         const updatePayBankParams = [payAccount, payBank, userIdx]
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editPayResult = await userDao.updatePayBank(connection, updatePayBankParams)
//         connection.release();

//         return response(baseResponse.SUCCESS);
//     } catch (err) {
//         logger.error(`App - editPayAccount Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }
// exports.deletePayAccount = async function (userIdx) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         const deletePayResult = await userDao.deletePayBank(connection, userIdx)
//         connection.release();

//         return response(baseResponse.SUCCESS);
//     } catch (err) {
//         logger.error(`App - deletePayAccount Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }

