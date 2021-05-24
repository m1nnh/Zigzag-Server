const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const regEmail = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
const regPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
const regPhoneNum = /^\d{3}\d{3,4}\d{4}$/;
const regUserName = /^[가-힣]{2,4}$/;


exports.login = async function (req, res) {

    const {email, password} = req.body;

    // Validation Check (Request Error)
    if(!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    if (!regEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    if (password.length<6)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    if (!regPassword.test(password))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));


    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


exports.patchUsers = async function (req, res) {

    const userPhoneNum = req.body.userPhoneNum;
    const userName = req.body.userName;

    const userIdFromJWT = req.verifiedToken.userIdx
    const userId = req.params.userId;


    // Validation Check (Request Error)
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
     
    if (!userPhoneNum)
        return res.send(errResponse(baseResponse.SIGNUP_PHONE_EMPTY)) 

    if (!regPhoneNum.test(userPhoneNum))
        return res.send(errResponse(baseResponse.SIGNUP_PHONE_ERROR_TYPE)) 

    if (!userName)
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY)) 

    if (!regUserName.test(userName))
        return res.send(errResponse(baseResponse.USER_NAME_ERROR_TYPE));

    const editUserInfo = await userService.editUser(userPhoneNum, userName, userId)
    return res.send(editUserInfo);
    
};

exports.settingApp = async function (req, res) {
    const {smsFlag ,emailFlag ,notiFlag} = req.body;
    const userIdFromJWT = req.verifiedToken.userIdx;
    const userId = req.params.userId;


    // Validation Check (Request Error)
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    if (!smsFlag)
        return res.send(response(baseResponse.USER_ID_NOT_MATCH)); // 에러 메시지 추가
    
    if ((smsFlag !== 'Y') & (smsFlag !== 'N'))
        return res.send(response(baseResponse.USER_ID_NOT_MATCH)); // 에러 메시지 추가

    if (!emailFlag)
        return res.send(response(baseResponse.USER_ID_NOT_MATCH)); // 에러 메시지 추가

    if (emailFlag !== 'Y' & smsFlag !== 'N')
        return res.send(response(baseResponse.USER_ID_NOT_MATCH)); // 에러 메시지 추가

    if (!notiFlag)
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));// 에러 메시지 추가
    
    if (notiFlag !== 'Y' & smsFlag !== 'N')
        return res.send(response(baseResponse.USER_ID_NOT_MATCH)); // 에러 메시지 추가

    const settingResult = await userService.editSetting(smsFlag ,emailFlag ,notiFlag, userId)
    return res.send(settingResult);
}

exports.setrePayAccount = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userIdx
    
        const userId = req.params.userId;
        const {rePayBank, rePayAccount} = req.body;
        const isAccountResult = await isAccount(rePayBank, rePayAccount);

        // Validation Check (Request Error)
        if (userIdFromJWT != userId) 
           return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
        
        if(!rePayBank)
           return res.send(errResponse(baseResponse.USER_BANK_EMPTY)); // 문구 수정
         
        if(!rePayAccount)
           return res.send(errResponse(baseResponse.USER_ACCOUNT_EMPTY)); // 문구 수정
           
        if(!isAccountResult)
           return res.send(errResponse(baseResponse.USER_ACCOUNT_NOT_MATCH)); // 문구 수정
        

        const editrePayResult = await userService.editrePayAccount(rePayAccount, rePayBank, userId)
        return res.send(editrePayResult);
    } // 환불계좌 등록

// exports.setPayAccount = async function (req, res) {
//     const userIdFromJWT = req.verifiedToken.userIdx

//     const userId = req.params.userId;
//     const {payBank, payAccount} = req.body;

//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     }

//     if(this.isAccount(payBank, payAccount) === false){
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 문구 수정
//     }
//     const editpayResult = await userService.editrePay(rePayBank, rePayAccount, userId)
//     return res.send(editpayResult);
// }


// exports.deletePayAccount = async function (req, res) {
//     const userIdFromJWT = req.verifiedToken.userIdx

//     const userId = req.params.userId;
//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     }
//     const deletePayResult = await userService.deletePayAccount(userId)
//     return res.send(deletePayResult);
// } // 등록계좌 지우기








/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };



const isAccount = async function (name, value) {
    var chk = /^[0-9]{11,14}$/g;

    if(!chk.test(value)){
        return false;
    }

    if(name === '신한은행' || name === 'sc제일은행'){
        if(value.length!=11){
            return false;
        }
    }
    else if (name === "국민은행" ||name === "기업은행"||name === "하나은행" || name === "우체국"){
        if(value.length!=14){
            return false;
        }
    }
    else if (name === "농협" || name === "우리은행" || name === "부산은행" || name === "카카오뱅크" || name === "경남은행"){
        if(value.length!=13){
            return false;
        }
    }
    return true;
}
