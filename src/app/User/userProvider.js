const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { login } = require("./userController");

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

// Sign-In Check
exports.loginCheck = async function (email, hashedPassword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginCheckResult = await userDao.selectLogin(connection, [email, hashedPassword]);
  connection.release();
  return loginCheckResult;
};

// Get Sign-Up Profile 
exports.signUpProfile = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getProfileResult = await userDao.selectSignUpProfile(connection, userIdx);

  connection.release();

  return getProfileResult[0];
};
