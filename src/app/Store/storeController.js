const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const { SUCCESS } = require("../../../config/baseResponseStatus");

// regex 
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;
const regUrl = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;

/**
 * API No. 
 * API Name : 쇼핑몰 북마크 수정 API
 * [PATCH] /stores/:storeIdx/book-mark
 */
exports.patchStoreBookmark = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {storeIdx} = req.params;
    
    // Request Body
    const bodyIdx = req.body;

    // Request Query String
    const {status} = req.query;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) & storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.
  
    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.

    if (!status)
        return res.send(errResponse(baseResponse.STATUS_EMPTY)); // 2032 : status 값을 입력해주세요.
    
    if (status !== 'N' & status != 'Y')
        return res.send(errResponse(baseResponse.STATUS_ERROR_TYPE)); // 2033 : status Y또는 N을 입력해주세요.
    
    const checkBookmarkStatus = await productProvider.storeBookmarkCheck(storeIdx, userIdx);

    // 없으면 생성
    if (checkBookmarkStatus[0].exist === 0)
        await productService.insertStore(storeIdx, userIdx);

    // 있으면 상태만 업데이트
    else
        await productService.updateStore(storeIdx, userIdx, status);
    
    return res.send(response(baseResponse.SUCCESS));

 }

 /**
 * API No. 
 * API Name : 스토어 스토리 생성 API
 * [POST] /stores/:storeIdx/story
 */
exports.postStory = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {storeIdx} = req.params;
    
    // Request Body
    const {bodyIdx, storyUrl} = req.body;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) & storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.
  
    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.

    if (!storyUrl)
        return res.send(errResponse(baseResponse.STORYURL_EMPTY)); // 2040 : storyUrl을 입력해주세요.


    if (regUrl.test(storyUrl) == false)
        return res.send(errResponse(baseResponse.STORYURL_ERROR_TYPE)); // 2041 : 잘못된 형식의 url입니다.
    

    
    const storeStory = await storeService.postStoreStory(storeIdx, storyUrl);
    
    return res.send(response(baseResponse.SUCCESS, storeStory));

 }

 /**
 * API No. 
 * API Name : 스토어 스토리 생성 API
 * [GET] /stores/:storyIdx/first-story
 */
exports.getFirstStory = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {storeIdx} = req.params;
    
    // Request Body
    const {bodyIdx} = req.body;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) & storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.

    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.
    
    const checkStoryIdx = await storeProvider.storeStoryIdxCheck(storeIdx);

    if (checkStoryIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STORYIDX_NOT_EXIST)) // 2042 : 존재하지 않는 스토리입니다.

    const storeStory = await storeProvider.getStoreStory(storeIdx, userIdx);

    return res.send(response(baseResponse.SUCCESS, storeStory));

 }

 /**
 * API No. 
 * API Name : 특정 스토리 조회 API
 * [GET] /storys/:storyIdx
 */
exports.getStory = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {storyIdx} = req.params;
    
    // Request Body
    const {bodyIdx} = req.body;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storyIdx) & storyIdx < 1)
        return res.send(response(baseResponse.STORYIDX_ONLY_NUMBER)); // 2043 : storyIdx는 숫자만 입력이 가능합니다.

    const checkStoryIdx = await storeProvider.storyIdxCheck(storyIdx);

    if (checkStoryIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STORYIDX_NOT_EXIST)) // 2042 : 존재하지 않는 스토리입니다.

    const storeStory = await storeProvider.getStory(storyIdx, userIdx);

    return res.send(response(baseResponse.SUCCESS, storeStory));
}

/**
 * API No. 
 * API Name : 북마크 스토어 스토리 목록 조회 API
 * [GET] /storys/book-mark-store
 */
exports.getStoryList = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;
  
    // Request Body
    const {bodyIdx} = req.body;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    const storyList = await storeProvider.getStoryList(userIdx);

    return res.send(response(baseResponse.SUCCESS, storyList));

}