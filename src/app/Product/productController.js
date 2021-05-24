const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regCategory = /^[0-9]/g;


exports.a = async function(req, res) {
    let {categoryRef, categoryIdx} = req.query;

    // 모아보기 전체 카테고리 view
    if(!categoryRef && !categoryIdx){
        const moabokiResult = await productProvider.parentCategory();
        return res.send(response(baseResponse.SUCCESS, moabokiResult));
    }

    // Validation Check (Request Error)
    if(!categoryRef)
         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // categoryRef를 입력해 주세요.

    if (regCategory.test(categoryRef))
         return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // categoryRef를 숫자로 입력해 주세요.

    if (!categoryIdx)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // categoryIdx를 입력해 주세요.

    if (regCategory.test(categoryIdx))
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // categoryIdx를 숫자로 입력해 주세요.

    //   if : 상위 카테고리 전체
    //   else : 하위 카테고리 
    if(categoryRef === categoryIdx){

    } else{

    } 
}