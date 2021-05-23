const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


const {emit} = require("nodemon");

// regex 

const regEmail = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
const regPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
const regPhoneNum = /^\d{3}\d{3,4}\d{4}$/;

/**
 * API No. 
 * API Name : 회원가입 API
 * [POST] /app/users/sign-up
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


// /**
//  * API No. 2
//  * API Name : 유저 조회 API (+ 이메일로 검색 조회)
//  * [GET] /app/users
//  */
// exports.getUsers = async function (req, res) {

//     /**
//      * Query String: email
//      */
//     const email = req.query.email;

//     if (!email) {
//         // 유저 전체 조회
//         const userListResult = await userProvider.retrieveUserList();
//         return res.send(response(baseResponse.SUCCESS, userListResult));
//     } else {
//         // 유저 검색 조회
//         const userListByEmail = await userProvider.retrieveUserList(email);
//         return res.send(response(baseResponse.SUCCESS, userListByEmail));
//     }
// };

// /**
//  * API No. 3
//  * API Name : 특정 유저 조회 API
//  * [GET] /app/users/{userId}
//  */
// exports.getUserById = async function (req, res) {

//     /**
//      * Path Variable: userId
//      */
//     const userId = req.params.userId;

//     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

//     const userByUserId = await userProvider.retrieveUser(userId);
//     return res.send(response(baseResponse.SUCCESS, userByUserId));
// };


// // TODO: After 로그인 인증 방법 (JWT)
// /**
//  * API No. 4
//  * API Name : 로그인 API
//  * [POST] /app/login
//  * body : email, passsword
//  */
// exports.login = async function (req, res) {

//     const {email, password} = req.body;

//     // TODO: email, password 형식적 Validation

//     const signInResponse = await userService.postSignIn(email, password);

//     return res.send(signInResponse);
// };


// /**
//  * API No. 5
//  * API Name : 회원 정보 수정 API + JWT + Validation
//  * [PATCH] /app/users/:userId
//  * path variable : userId
//  * body : nickname
//  */
// exports.patchUsers = async function (req, res) {

//     // jwt - userId, path variable :userId

//     const userIdFromJWT = req.verifiedToken.userId

//     const userId = req.params.userId;
//     const nickname = req.body.nickname;

//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//         const editUserInfo = await userService.editUser(userId, nickname)
//         return res.send(editUserInfo);
//     }
// };











// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
