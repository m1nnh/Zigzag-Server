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