const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const searchProvider = require("../../app/Search/searchProvider");
const searchService = require("./searchService.js");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const { SUCCESS } = require("../../../config/baseResponseStatus");

// regex 
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;

/**
 * API No. 
 * API Name : 검색 내용 생성 API
 * [POST] /search
 */
exports.postSearch = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;
    
    // Request Query String
    const {contents} = req.query;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); // 2017 : 해당 회원이 존재하지 않습니다.

    if (!contents)
        return res.send(errResponse(baseResponse.CONTENTS_EMPTY)); // 2044 : 검색 내용을 입력해주세요.
    
    const checkContents = await searchProvider.contentsCheck(userIdx, contents);

     // Create Search Result
    if (checkContents[0].exist === 0) {
        const createSearch = await searchService.postSearch(userIdx, contents);
    }
    else {
        const checkStatus = await searchProvider.searchStatusCheck(userIdx, contents);
        
        if (checkStatus[0].status === 'Y')
            await searchService.updateSearchStatus(userIdx, contents);
    }

    return res.send(response(baseResponse.SUCCESS));

}

/**
 * API No. 
 * API Name : 검색 내용 삭제 API
 * [PATCH] /search
 */
exports.patchSearch = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); // 2017 : 해당 회원이 존재하지 않습니다.


    const userContentsCheck = await searchProvider.userContentsCheck(userIdx);

    if (userContentsCheck[0].exist === 0)
        return res.send(errResponse(baseResponse.DELETE_CONTENTS_NOT_EXIST)); // 2045 : 삭제할 검색 내용이 없습니다.

    await searchService.deleteContents(userIdx);



    return res.send(response(baseResponse.SUCCESS));

}

/**
 * API No. 
 * API Name : 최근 검색 내용 조회 API
 * [GET] /search/recent
 */
exports.getRecentSearch = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.


    // Recent Search Result
    const recentSearch = await searchProvider.getRecentSearch(userIdx);

    return res.send(response(baseResponse.SUCCESS, recentSearch));

}

/**
 * API No. 
 * API Name : 지금 가장 인기있는 검색 조회 API
 * [GET] /search/now-best
 */
exports.getNowBestSearch = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Body
    const bodyIdx = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.


    // Now Best Search Result
    const nowBestSearch = await searchProvider.getNowBestSearch();

    return res.send(response(baseResponse.SUCCESS, nowBestSearch));

}