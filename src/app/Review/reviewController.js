const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("./reviewService.js");
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
 * API Name : 상품별 메인 리뷰 조회 API
 * [PATCH] /reviews/:productIdx/main
 */
exports.getMainReview = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params
    
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

    if (!regNum.test(productIdx) & productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.

    const checkProductIdx = await productProvider.productIdxCheck(productIdx);
    
    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    const reviewTitle = await productProvider.reviewTitle(productIdx);

    let reviewContents = await productProvider.reviewContents(productIdx);
    
    for (var i = 0; i< reviewContents.length; i++) {
        image = await productProvider.reviewImage(reviewContents[i].reviewIdx);
        if (image[0].reviewImage === null)
            reviewContents[i]["reviewImage"] = '';
        else 
            reviewContents[i]["reviewImage"] = image;
    }
    return res.send(response(baseResponse.SUCCESS, {reviewTitle, reviewContents}));

 }

 /**
 * API No. 
 * API Name : 상품별 토탈 리뷰 타이틀 조회 API
 * [PATCH] /reviews/:products/total-title
 */
exports.getTotalReviewTitle = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params
    
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

    if (!regNum.test(productIdx) & productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.

    const checkProductIdx = await productProvider.productIdxCheck(productIdx);
    
    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    let reviewTitle = await productProvider.reviewTotalTitle(productIdx);

    return res.send(response(baseResponse.SUCCESS, reviewTitle));
}

/**
 * API No. 
 * API Name : 상품별 토탈 리뷰 조회 API
 * [PATCH] /reviews/:productIdx/total
 */
exports.getTotalReview = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {productIdx} = req.params
    
    // Request Body
    const bodyIdx = req.body;

    // Request Query String
    let {page, size, photoFilter, sortFilter} = req.query;

    var condition = 'order by '
    var pcondition = 'and r.imageFlag = "Y"'
    
    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);
    
    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(productIdx) & productIdx < 1)
        return res.send(response(baseResponse.PRODUCTIDX_ONLY_NUMBER)); // 2031 : productIdx는 숫자만 입력이 가능합니다.

    const checkProductIdx = await productProvider.productIdxCheck(productIdx);
    
    if (checkProductIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.PRODUCTIDX_NOT_EXIST)) // 2026 : 존재하지 않는 상품입니다.

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    switch (sortFilter) {
        case '1' : condition += 'r.createdAt'; break;
        case '2' : condition += 'r.score DESC'; break;
        case '3' : condition += 'r.score'; break;
        default : condition += 'likeCount DESC'; break;
    }

    if (photoFilter != 'Y') {
        pcondition = '';
    }

    let reviewContents = await productProvider.totalReviewContents(productIdx, page, size, condition, pcondition);

    // Result <- Status
    for (var i = 0; i < reviewContents.length; i++) {
        var flag = await productProvider.likeFlagReview(userIdx, reviewContents[i].reviewIdx);
        if (flag.length === 0 )
            reviewContents[i]["likeFlag"] = 'null';
        else {
            reviewContents[i]["likeFlag"] = flag[0].likeFlag;
        }
       image = await productProvider.reviewImage(reviewContents[i].reviewIdx);
        if (image[0].reviewImage === null)
            reviewContents[i]["reviewImage"] = '';
        else 
            reviewContents[i]["reviewImage"] = image;
    }
    return res.send(response(baseResponse.SUCCESS, reviewContents));
}

/**
 * API No. 
 * API Name : 리뷰 좋아요 플래그 수정 API
 * [PATCH] /reviews/like-flag
 */
exports.patchLikeFlag = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Path Variable
    const {reviewIdx} = req.params
    
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

    if (!regNum.test(reviewIdx) & reviewIdx < 1)
        return res.send(response(baseResponse.REVIEWIDX_ERROR_TYPE)); // 2039 : reviewIdx는 숫자만 입력이 가능합니다.

    const checkReviewIdx = await productProvider.reviewIdxCheck(reviewIdx);
    
    if (checkReviewIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.REVIEWIDX_NOT_EXIST)) // 2038 : 존재하지 않는 리뷰입니다.

    if (!status)
        return res.send(errResponse(baseResponse.STATUS_EMPTY)); // 2032 : status 값을 입력해주세요.
    
    if (status !== 'N' & status != 'Y')
        return res.send(errResponse(baseResponse.STATUS_ERROR_TYPE)); // 2033 : status Y또는 N을 입력해주세요.
    
    const checkLikeStatus = await productProvider.likeReviewCheck(reviewIdx, userIdx);

    // 없으면 생성
    if (checkLikeStatus[0].exist === 0)
        await productService.insertLikeFlag(reviewIdx, userIdx, status);

    // 있으면 상태만 업데이트
    else {

        const likeStatus = await productProvider.likeFlagStatusCheck(reviewIdx, userIdx);

        if (likeStatus[0].status === 'Y')
            await productService.updateLikeFlagStatus(reviewIdx, userIdx);
        
        await productService.updateLikeFlag(reviewIdx, userIdx, status);
    }
    return res.send(response(baseResponse.SUCCESS));

 }