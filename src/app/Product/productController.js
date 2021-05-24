const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

// regex 

const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;


/**
 * API No. 
 * API Name : 홈 상품 조회 API
 * [GET] /products/home
 */
 exports.getHome = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size} = req.query;
    
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

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) // 2013 : page 번호를 확인해주세요.
        return res.send(response(baseResponse.PAGE_ERROR_TYPE));

    if (!size) // 2014 : size를 입력해주세요.
        return res.send(response(baseResponse.SIZE_EMPTY));

    if (!regSize.test(size) & size < 1) // 2015 : size 번호를 확인해주세요.
        return res.send(response(baseResponse.SIZE_ERROR_TYPE));

    // Result
    const homeResult = await productProvider.homeProduct(userIdx, page, size);

    return res.send(response(baseResponse.SUCCESS, homeResult));
 }