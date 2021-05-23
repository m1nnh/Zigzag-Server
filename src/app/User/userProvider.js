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


// exports.retrieveUserList = async function (email) {
//   if (!email) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListResult = await userDao.selectUser(connection);
//     connection.release();

//     return userListResult;

//   } else {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListResult = await userDao.selectUserEmail(connection, email);
//     connection.release();

//     return userListResult;
//   }
// };

// exports.retrieveUser = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userResult = await userDao.selectUserId(connection, userId);

//   connection.release();

//   return userResult[0];
// };


// exports.passwordCheck = async function (selectUserPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const passwordCheckResult = await userDao.selectUserPassword(
//       connection,
//       selectUserPasswordParams
//   );
//   connection.release();
//   return passwordCheckResult[0];
// };

// exports.accountCheck = async function (email) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userAccountResult = await userDao.selectUserAccount(connection, email);
//   connection.release();

//   return userAccountResult;
// };