const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const brandDao = require("../../app/Brand/brandDao");
const baseResponse = require("../../../config/baseResponseStatus");

/**
 * API No. 
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
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (!regNum.test(brandIdx) & brandIdx < 1)
        return res.send(response(baseResponse.BRANDIDX_ERROR_TYPE)); // 2034 : brandIdx는 숫자만 입력이 가능합니다.
    
    const checkBrandIdx = await productProvider.brandIdxCheck(brandIdx);

    if (checkBrandIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.BRANDIDX_NOT_EXIST)) // 2035 : 해당 브랜드가 존재하지 않습니다.

    // Brand Intro Result
    const brandIntroResult = await productProvider.brandIntro(brandIdx, userIdx)
    
    return res.send(response(baseResponse.SUCCESS, brandIntroResult));

 }