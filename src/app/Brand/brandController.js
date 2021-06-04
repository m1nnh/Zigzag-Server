const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const brandProvider = require("../../app/Brand/brandProvider");
const brandService = require("../../app/Brand/brandService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const { SUCCESS } = require("../../../config/baseResponseStatus");

// regex 
const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regNum = /^[0-9]/g;


/**
 * API No. 33
 * API Name : 브랜드별 인트로 조회 API
 * [GET] /brands/:brandIdx/intro
 */

exports.getBrandIntro = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {brandIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(brandIdx) && brandIdx < 1)
        return res.send(response(baseResponse.BRANDIDX_ERROR_TYPE)); // 2034 : brandIdx는 숫자만 입력이 가능합니다.
    
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.

    // Brand Intro Result
    const brandIntroResult = await productProvider.brandIntro(brandIdx, userIdx)
    
    return res.send(response(baseResponse.SUCCESS, brandIntroResult));

 }

 /**
 * API No. 34
 * API Name : 브랜드별 쿠폰 리스트 조회 API
 * [GET] /brands/:brandIdx/coupon-list
 */
exports.getBrandCoupon = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {brandIdx} = req.params;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(brandIdx) && brandIdx < 1)
        return res.send(response(baseResponse.BRANDIDX_ERROR_TYPE)); // 2034 : brandIdx는 숫자만 입력이 가능합니다.
    
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.

    // Brand Name
    const brandName = await productProvider.brandName(brandIdx);

    // Coupon Result
    const brandCouponResult = await productProvider.brandCoupon(brandIdx, userIdx);
    
    // 
    if (brandCouponResult.length === 0)
        return res.send(response(baseResponse.COUPON_NOT_EXIST)) // 2047 : 존재하는 쿠폰이 없습니다.
    var result = []
    result[0] = brandName[0];
    result[1] = brandCouponResult;

    result[1][0]["status"] = 'N'

    for (var i = 0; i < result[1].length; i++) {
        var couponIdx = result[1][i].couponIdx;
        var have = await productProvider.haveFlag(couponIdx, userIdx);

        if (have[0].exist === 0)
            result[1][i]["status"] = 'N'
        else 
            result[1][i]["status"] = 'Y'
    }

    return res.send(response(baseResponse.SUCCESS, result));
 }
 
/**
 * API No. 35
 * API Name : 브랜드별 쿠폰 등록 API
 * [POST] /brands/:brandIdx/coupon
 */
exports.postBrandCoupon = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {brandIdx} = req.params;

    // Request Query Stirng
    const {number} = req.query;

    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(brandIdx) && brandIdx < 1)
        return res.send(response(baseResponse.BRANDIDX_ERROR_TYPE)); // 2034 : brandIdx는 숫자만 입력이 가능합니다.
    
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.

    // Coupon Result
    const brandCouponResult = await productProvider.brandCoupon(brandIdx, userIdx);

    if (number == 0) {
        for (var i = 0; i < brandCouponResult.length; i++) {
            var couponIdx = brandCouponResult[i].couponIdx;
            var have = await productProvider.haveFlag(couponIdx, userIdx);

            if (have[0].exist === 0)
                await productService.brandCoupon(couponIdx, userIdx);
            else 
                continue;
        }
    }
    else if (number <= brandCouponResult.length) {
        var couponIdx = brandCouponResult[number - 1].couponIdx;
        var have = await productProvider.haveFlag(couponIdx, userIdx);
        if (have[0].exist === 0)
            await productService.brandCoupon(couponIdx, userIdx);

        else 
            return res.send(errResponse(baseResponse.COUPONIDX_EXIST)) // 2036 : 해당 쿠폰이 이미 존재합니다.
    }
    else
        return res.send(errResponse(baseResponse.NUMBER_ERROR_TYPE)) // 2037 : number 번호를 확인해주세요.

    return res.send(response(baseResponse.SUCCESS));
 }

 /**
 * API No. 36
 * API Name : 브랜드 북마크 수정 API
 * [PATCH] /brands/:brandIdx/book-mark
 */
exports.patchBrandBookmark = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    let {brandIdx} = req.params;
    
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

    if (!regNum.test(brandIdx) && brandIdx < 1)
        return res.send(response(baseResponse.BRANDIDX_ERROR_TYPE)); // 2034 : brandIdx는 숫자만 입력이 가능합니다.
  
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.

    if (!status)
        return res.send(errResponse(baseResponse.STATUS_EMPTY)); // 2032 : status 값을 입력해주세요.
    
    if (status !== 'N' && status != 'Y')
        return res.send(errResponse(baseResponse.STATUS_ERROR_TYPE)); // 2033 : status Y또는 N을 입력해주세요.
    
    const checkBookmarkStatus = await productProvider.brandBookmarkCheck(brandIdx, userIdx);

    // Not Exist -> Insert
    if (checkBookmarkStatus[0].exist === 0)
        await productService.insertBrand(brandIdx, userIdx);

    // Exist -> up
    else
        await productService.updateBrand(brandIdx, userIdx, status);
    
    return res.send(response(baseResponse.SUCCESS));

 }

 /**
 * API No. 37
 * API Name : 브랜드 전체 랭킹 조회 API
 * [GET] /brands/total-rank
 */

exports.getTotalRank = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;

    // Request Body
    const bodyIdx = req.body;

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
    
    page = size * (page-1);

    // rank Result
    let rankBrand = await brandProvider.getRankBrand(userIdx, page, size);

    return res.send(response(baseResponse.SUCCESS, rankBrand));

 }


 /**
 * API No. 38
 * API Name : 신규 입점 브랜드 조회 API
 * [GET] /brands/new
 */

exports.getBrandNew = async function(req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;


    // Request Body
    const bodyIdx = req.body;

    // Validation Check (Request Error)
    if (!userIdx || !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    // rank Result
    let newBrand = await brandProvider.getNewBrand(userIdx);

    return res.send(response(baseResponse.SUCCESS, newBrand));

 }