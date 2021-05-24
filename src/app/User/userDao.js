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

// Sign-In Check
async function selectLogin(connection, [email, hashedPassword]) {

  const loginCheckQuery = `
    select userEmail, userPassword, userIdx, status
    from User
    where userEmail = ? and userPassword = ?;
   `;

  const [loginCheckRow] = await connection.query(loginCheckQuery, [email, hashedPassword]);
  return loginCheckRow;
}

// Patch All
async function updateAll(connection, [userPhoneNum, userName, userIdx]) {
  const updateAllQuery = `
  update User
  set userName = ?, userPhoneNum = ?
  where userIdx = ?`;
  const updateAllRow = await connection.query(updateAllQuery, [userName, userPhoneNum, userIdx]);
  return updateAllRow[0];
}

// Patch Name
async function updateName(connection, [userIdx, userName]) {
  const updateNameQuery = `
  update User
  set userName = ?
  where userIdx = ?`;
  const updateNameRow = await connection.query(updateNameQuery, [userName, userIdx]);
  return updateNameRow[0];
}

// Patch PhoneNum
async function updatePhoneNum(connection, [userIdx, userPhoneNum]) {
  const updatePhoneNumQuery = `
  update User
  set userPhoneNum = ?
  where userIdx = ?`;
  const updatePhoneNumRow = await connection.query(updatePhoneNumQuery, [userPhoneNum, userIdx]);
  return updatePhoneNumRow[0];
}


module.exports = {
  selectEmail,
  selectPhoneNum,
  selectLogin,
  insertUser,
  selectSignUpProfile,
  updateAll,
  updateName,
  updatePhoneNum
};
