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
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) && storeIdx < 1)
        return res.send(response(baseResponse.STOREIDX_ONLY_NUMBER)); // 2030 : storeIdx는 숫자만 입력이 가능합니다.
  
    const checkStoreIdx = await productProvider.storeCheck(storeIdx);

    if (checkStoreIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.STOREIDX_NOT_EXIST)) // 2029 : 존재하지 않는 쇼핑몰입니다.

    if (!status)
        return res.send(errResponse(baseResponse.STATUS_EMPTY)); // 2032 : status 값을 입력해주세요.
    
    if (status !== 'N' && status != 'Y')
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
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) && storeIdx < 1)
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
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storeIdx) && storeIdx < 1)
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
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(storyIdx) && storyIdx < 1)
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
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    const storyList = await storeProvider.getStoryList(userIdx);

    return res.send(response(baseResponse.SUCCESS, storyList));

}

/**
 * API No. 
 * API Name : 스토어 전체 랭킹 조회 API
 * [GET] /stores/total-rank
 */

exports.getTotalRank = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large} = req.query;

    // Request Body
    const bodyIdx = req.body;

    condition = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    // Category Filtering
    if (large) {
        if (large == 1) {
            large = parseInt(large) + 1
            var firstCategoryIdxRow = await productProvider.categoryIdx(large);
            large = parseInt(large) + 5
            let first = firstCategoryIdxRow[1].categoryIdx;

            var secondCategoryIdxRow = await productProvider.categoryIdx(large);
            let last = secondCategoryIdxRow[secondCategoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last
        }

        else if (large == 2) {
            large = parseInt(large) + 6
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition += 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 3) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 4) {
            large = parseInt(large) + 8
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 5) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 6) {
            large = parseInt(large) + 5
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 7) {
            large = parseInt(large) + 3
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and categoryRef between ' + first + ' and ' + last;
        }

        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요.
    }
    else
        condition = ''

    page = size * (page-1);

    // rank Result
    let rankStore = await storeProvider.getRankStore(userIdx, condition, page, size);

    return res.send(response(baseResponse.SUCCESS, rankStore));

 }


/**
 * API No. 
 * API Name : 북마크 스토어 조회 API
 * [GET] /stores/book-mark
 */
exports.getBookmarkStore = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;
  
    // Request Body
    const {bodyIdx} = req.body;

    // Request Query String
    let {page, size, filter} = req.query 

    var condition = ''

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    page = size * (page-1);

    if (filter == 1)
        condition = 'and maxCouponPrice != 0'
    else
        condition = ''
        
    
    const storeList = await storeProvider.getBookmarkStore(userIdx, condition, page, size);

    return res.send(response(baseResponse.SUCCESS, storeList));

}

/**
 * API No. 
 * API Name : 검색 상품 조회 API
 * [GET] /search/product-list
 */
exports.getSearchProduct = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large, medium, small, deliveryFilter, originalFilter} = req.query;
    
    let categoryCondition = ''
    let deliveryCondition = ''
    let originalCondition = 'order by '

    // Request Body
    const {bodyIdx, contents} = req.body;
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) && page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) && size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.


    if (!contents)
        return res.send(response(baseResponse.CONTENTS_EMPTY)); // 2044 : 검색 내용을 입력해주세요.

    page = size * (page-1);

    
    // Search Product Result
    const searchProductResult = await productProvider.searchProduct(userIdx, contents, categoryCondition, deliveryCondition, originalCondition, page, size);

    
    return res.send(response(baseResponse.SUCCESS, searchProductResult));

}