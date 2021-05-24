const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// Email Check
exports.emailCheck = async function (email) {

  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

// PhoneNum Check
exports.phoneNumCheck = async function (phoneNum) {

  const connection = await pool.getConnection(async (conn) => conn);
  const phoneNumCheckResult = await userDao.selectPhoneNum(connection, phoneNum);
  connection.release();

  return phoneNumCheckResult;
};

// Get Sign-Up Profile 
exports.signUpProfile = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getProfileResult = await userDao.selectSignUpProfile(connection, userIdx);

  connection.release();

  return getProfileResult[0];
};

