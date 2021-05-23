// Email Check
async function selectEmail(connection, email) {

  const selectEmailQuery = `
    select exists(select userEmail from User where userEmail = ?) as exist;
    `;

  const [emailRow] = await connection.query(selectEmailQuery, email);
  return emailRow;
}

// PhoneNum Check
async function selectPhoneNum(connection, phoneNum) {

  const selectPhoneNumQuery = `
    select exists(select userEmail from User where userPhoneNum = ?) as exist;
   `;

  const [phoneNumRow] = await connection.query(selectPhoneNumQuery, phoneNum);
  return phoneNumRow;
}

// Sign-Up
async function insertUser(connection, [email, hashedPassword, phoneNum, smsFlag, emailFlag]) {
  
  const insertUserQuery = `
    INSERT INTO User(userEmail, userPassword, userPhoneNum, smsFlag, emailFlag)
    VALUES (?, ?, ?, ?, ?);
    `;

  const insertUserRow = await connection.query(insertUserQuery, [email, hashedPassword, phoneNum, smsFlag, emailFlag]);
  return insertUserRow;
}

// Get Sign-Up Profile
async function selectSignUpProfile(connection, userIdx) {

  const selectUserIdQuery = `
    select userEmail, userPhoneNum, smsFlag, emailFlag
    from User
    where userIdx = ?;
    `;

  const [userRow] = await connection.query(selectUserIdQuery, userIdx);
  return userRow;
}

// // 모든 유저 조회
// async function selectUser(connection) {
//   const selectUserListQuery = `
//                 SELECT email, nickname 
//                 FROM UserInfo;
//                 `;
//   const [userRows] = await connection.query(selectUserListQuery);
//   return userRows;
// }

// // 이메일로 회원 조회
// async function selectUserEmail(connection, email) {
//   const selectUserEmailQuery = `
//                 SELECT email, nickname 
//                 FROM UserInfo 
//                 WHERE email = ?;
//                 `;
//   const [emailRows] = await connection.query(selectUserEmailQuery, email);
//   return emailRows;
// }

// // userId 회원 조회
// async function selectUserId(connection, userId) {
//   const selectUserIdQuery = `
//                  SELECT id, email, nickname 
//                  FROM UserInfo 
//                  WHERE id = ?;
//                  `;
//   const [userRow] = await connection.query(selectUserIdQuery, userId);
//   return userRow;
// }

// // 유저 생성
// async function insertUserInfo(connection, insertUserInfoParams) {
//   const insertUserInfoQuery = `
//         INSERT INTO UserInfo(email, password, nickname)
//         VALUES (?, ?, ?);
//     `;
//   const insertUserInfoRow = await connection.query(
//     insertUserInfoQuery,
//     insertUserInfoParams
//   );

//   return insertUserInfoRow;
// }

// // 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT email, nickname, password
//         FROM UserInfo 
//         WHERE email = ? AND password = ?;`;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );

//   return selectUserPasswordRow;
// }

// // 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
// async function selectUserAccount(connection, email) {
//   const selectUserAccountQuery = `
//         SELECT status, id
//         FROM UserInfo 
//         WHERE email = ?;`;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       email
//   );
//   return selectUserAccountRow[0];
// }

// async function updateUserInfo(connection, id, nickname) {
//   const updateUserQuery = `
//   UPDATE UserInfo 
//   SET nickname = ?
//   WHERE id = ?;`;
//   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
//   return updateUserRow[0];
// }


module.exports = {
  selectEmail,
  selectPhoneNum,
  insertUser,
  selectSignUpProfile
};
