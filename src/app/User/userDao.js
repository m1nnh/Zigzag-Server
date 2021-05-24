// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT userEmail
                FROM User
                WHERE userEmail = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}



// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userEmail, userPassword
        FROM User
        WHERE userEmail = ? AND userPassword = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userIdx
        FROM User
        WHERE userEmail = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, updateUserParams) {
  const updateUserQuery = `
  UPDATE User
  SET userPhoneNum = ?, userName = ?
  WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, updateUserParams);
  return updateUserRow[0];
}

async function updateSetting(connection, updateSettingParams) {
  const updateSettingQuery = `
  UPDATE User
  SET smsFlag = ?, emailFlag = ?,notiFlag = ?
  WHERE userIdx = ?;
  `
  const updateSettingRow = await connection.query(updateSettingQuery, updateSettingParams);
  return updateSettingRow[0];
}

async function updaterePayBank(connection, updaterePayBankParams) {
  const updaterePayBankQuery = `
  UPDATE User
  SET rePayAccount = ?, reBank = ?
  WHERE userIdx = ?
  `
  const updaterePayRow = await connection.query(updaterePayBankQuery, updaterePayBankParams);
  return updaterePayRow[0];
}

// async function updatePayBank(connection, updatePayBankParams) {
//   const updatePayBankQuery = `
//   UPDATE User
//   SET PayAccount = ?, PayBank = ?
//   WHERE userIdx = ?
//   `
//   const updaterePayRow = await connection.query(updatePayBankQuery, updatePayBankParams);
//   return updaterePayRow[0];
// }

// async function deletePayBank(connection, userId) {
//   const deletePayBankQuery = `
//   UPDATE User
//   SET PayAccount = 0, PayBank = 0
//   WEHRE userIdx = ?
//   `
//   const updaterePayRow = await connection.query(deletePayBankQuery, userId);
//   return updaterePayRow[0];
// }

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updaterePayBank,
  updateSetting
};
