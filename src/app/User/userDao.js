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



module.exports = {
  selectEmail,
  selectPhoneNum,
  insertUser,
  selectSignUpProfile
};
