const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const productProvider = require("../../app/Product/productProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const smtpTransport = require('../../../config/email'); 

const {emit} = require("nodemon");
const crypto = require("crypto");
// regex 

const regEmail = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
const regPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
const regPhoneNum = /^\d{3}\d{3,4}\d{4}$/;
const regUserName = /^[가-힣]{2,4}$/;


exports.findPassword = async function (req, res) { 

    const {email} = req.body;

    const emailOptions = { from: "alsgur961010@gmai.com", to: email, 
    
    subject: "임시비밀번호 발급입니다.", text: "임시비밀번호 : wwqedfasvccvxz" }; 

    await smtpTransport.sendMail(emailOptions, (err, response) => 
    { if (err) { 
        smtpTransport.close();
        return errResponse(baseResponse.DB_ERROR) 
    } else { 
        console.log(123243);
        smtpTransport.close();
        console.log(123243);
        return res.send(response(baseResponse.SUCCESS));
    } }) 
};

/**
 * API No. 
 * API Name : 회원가입 API
 * [POST] /users/sign-up
 */
exports.postUsers = async function (req, res) {

    // Request Body
    const {email, password, phoneNum, smsFlag, emailFlag} = req.body;


    // Validation Check (Request Error)
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001 : 이메일을 입력해주세요.

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002 : 이메일은 30자리 미만으로 입력해주세요.
    
    if (!regEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE)); // 2003 : 이메일을 형식을 정확하게 입력해주세요.

    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004 : 비밀번호를 입력해주세요.

    if (!regPassword.test(password) | password.length < 8 | password.length > 16)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE)); // 2005 : 비밀번호는 영문, 숫자, 특수문자 포함 8~16 자리를 입력해주세요.
    
    if (!phoneNum)
        return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY)); // 2006 : 휴대폰 번호를 입력해주세요.

    if (!regPhoneNum.test(phoneNum))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE)); // 2007 : 휴대폰 번호 형식에 맞춰 입력해주세요. ex) 01012341234

    if (!smsFlag)
        return res.send(response(baseResponse.SIGNUP_SMSFLAG_EMPTY)); // 2008 : SMS FLAG를 입력해주세요.
    
    if (smsFlag !== 'Y' & smsFlag !== 'N')
        return res.send(response(baseResponse.SIGNUP_SMSFLAG_ERROR_TYPE)); // 2009 : SMS FLAG는 Y 또는 N을 입력해주세요.

    if (!emailFlag)
        return res.send(response(baseResponse.SIGNUP_EMAILFLAG_EMPTY)); // 2010 : EMAIL FLAG를 입력해주세요.

    if (emailFlag !== 'Y' & smsFlag !== 'N')
        return res.send(response(baseResponse.SIGNUP_EMAILFLAG_ERROR_TYPE)); // 2011 : EMAIL FLAG는 Y 또는 N을 입력해주세요.

    // Validation Check (Response Error)
    const emailCheckResult = await userProvider.emailCheck(email);

    if (emailCheckResult[0].exist === 1)
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_EMAIL)); // 3001 : 중복된 이메일입니다.
    
    const phoneCheckResult = await userProvider.phoneNumCheck(phoneNum);

    if (phoneCheckResult[0].exist === 1)
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUM)); // 3002 : 중복된 휴대폰 번호입니다.


    // Sign-Up 
    const signUpResponse = await userService.createUser(email, password, phoneNum, smsFlag, emailFlag);

    // GET Sign-up
    const signUpResult = await userProvider.signUpProfile(signUpResponse);

    return res.send(response(baseResponse.SUCCESS, signUpResult));
};

/**
 * API No. 
 * API Name : 로그인 API
 * [GET] /users/sign-in
 */
exports.loginUser = async function (req, res) {

    // Request Body
    const {email, password} = req.body;

    // Validation Check (Request Error)
    if(!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001 : 이메일을 입력해주세요.

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002 : 이메일은 30자리 미만으로 입력해주세요.

    if (!regEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE)); // 2003 : 이메일 형식을 정확하게 입력해주세요.

    if (!password)
        return res.send(response(baseResponse.PASSWORD_EMPTY)); // 2018 : 비밀번호를 입력해주세요.

    if (password.length < 6)
        return res.send(response(baseResponse.PASSWORD_LENGTH)); // 2019 : 6자리 이상의 비밀번호를 입력해주세요.

    const emailCheckResult = await userProvider.emailCheck(email);

    if (emailCheckResult[0].exist === 0)
        return res.send(response(baseResponse.EMAIL_NOT_EMPTY)); // 2023 : 해당 이메일이 존재하지 않습니다.
    
    // Result
    const loginResult = await userService.postSignIn(email, password);

    return res.send(loginResult);

};

/**
 * API No. 
 * API Name : 로그아웃 API
 * [GET] /users/logout
 */
exports.logout = async function (req, res) {

    // Request JWT Token
    const userIdx = req.verifiedToken.userIdx;

    // Request body
    const {bodyIdx} = req.body;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.
    
    if (userIdx !== bodyIdx)
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); // 2017 : 해당 회원이 존재하지 않습니다.
    // Result
    await userService.logout(userIdx);

    return res.send(response(baseResponse.SUCCESS));

};


/**
 * API No. 
 * API Name : 회원정보 수정 API
 * [PATCH] /users
 */
exports.patchUsers = async function (req, res) {

    // Request Body
    const userPhoneNum = req.body.userPhoneNum;
    const userName = req.body.userName;
    const bodyIdx = req.body;

    // Request JWT Token
    const userIdx = req.verifiedToken.userIdx

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.
    
    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); // 2017 : 해당 회원이 존재하지 않습니다.
    
    if (!userName & !userPhoneNum) 
        return res.send(errResponse(baseResponse.NAME_EMPTY)); // 2021 : 이름을 입력해주세요.
                                              
    if (userName.length > 0 & userPhoneNum.length > 0) {
        if (!regUserName.test(userName))
            return res.send(errResponse(baseResponse.NAME_ERROR_TYPE)); // 2022 : 이름을 형식에 맞게 입력해주세요
        
        else if (!regPhoneNum.test(userPhoneNum))   
            return res.send(errResponse(baseResponse.SIGNUP_PHONE_ERROR_TYPE)); // 2007 : 휴대폰 번호 형식에 맞춰 입력해주세요. ex) 01012341234
                                                                               
        else {
            const editUserInfo = await userService.editUser(userPhoneNum, userName, userIdx); // Patch All
            return res.send(response(baseResponse.SUCCESS, editUserInfo.info));
        }
    }

    if (userName.length > 0) {
        if (!regUserName.test(userName))
            return res.send(errResponse(baseResponse.NAME_ERROR_TYPE)); // 2022 : 이름을 형식에 맞게 입력해주세요
        
        else {
            const editName = await userService.editName(userIdx, userName); // Patch Name
            return res.send(response(baseResponse.SUCCESS, editName.info)); 
        }
    }
    
    if (userPhoneNum.length > 0) {
        if (!regPhoneNum.test(userPhoneNum))
            return res.send(errResponse(baseResponse.SIGNUP_PHONE_ERROR_TYPE)) // 2007 : 휴대폰 번호 형식에 맞춰 입력해주세요. ex) 01012341234
        
        else {
            const editPhoneNum = await userService.editPhoneNum(userIdx, userPhoneNum); // Patch PhoneNum
            return res.send(response(baseResponse.SUCCESS, editPhoneNum.info));
        }
    }
    
}

