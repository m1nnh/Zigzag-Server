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

 // userIdx 받아와야함!!
 exports.getHome = async function (req, res) {

    // Request Query String
    let {page, size} = req.query;

    // Validation Check (Request Error)
    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) // 2013 : page 번호를 확인해주세요.
        return res.send(response(baseResponse.PAGE_ERROR_TYPE));

    if (!size) // 2014 : size를 입력해주세요.
        return res.send(response(baseResponse.SIZE_EMPTY));

    if (!regSize.test(size)) // 2015 : size 번호를 확인해주세요.
        return res.send(response(baseResponse.SIZE_ERROR_TYPE));
   
    // Result
    const homeResult = await productProvider.homeProduct(page, size);

    return res.send(response(baseResponse.SUCCESS, homeResult));

 }