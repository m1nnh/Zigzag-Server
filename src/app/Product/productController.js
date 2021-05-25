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

    page = size * (page-1);

    // Home Product Result
    let homeResult = await productProvider.homeProduct(page, size);
    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Home Product Result <- Status
    for (var i = 0; i < homeResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (homeResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                homeResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
            homeResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, homeResult));

 }

 /**
 * API No. 
 * API Name : 브랜드 상품 조회 API
 * [GET] /products/brand
 */
exports.getBrand = async function (req, res) {

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
    
    page = size * (page-1);

    // Brand Product Result
    let brandResult = await productProvider.brandProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Brand Product Result <- Status
    for (var i = 0; i < brandResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (brandResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                brandResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Brand Product Result 'N' Insert
        if (flag === 0)
            brandResult[i]["likeProductStatus"] = 'N';
    }

    return res.send(response(baseResponse.SUCCESS, brandResult));

}

 /**
 * API No. 
 * API Name : 브랜드 상품 랭킹 조회 API
 * [GET] /products/brand/rank
 */
exports.getBrandRank = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let filter = req.query;

    // Request Body
    const bodyIdx = req.body;

    let condition = ''

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    // Category Filtering
    switch (filter) {
        case '1' : condition += 'where c.categoryRef between 1 and 5'; break;
        case '2' : condition += 'where c.categoryRef = 7'; break;
        case '3' : condition += 'where c.categoryRef = 6'; break;
        case '4' : condition += 'where c.categoryRef = 11'; break;
        case '5' : condition += 'where c.categoryRef = 8'; break;
        case '6' : condition += 'where c.categoryRef = 9'; break;
        default : break;
    }

    // Rank Result
    var rankResult = await productProvider.brandRank(condition);

    // Bookmark Status
    var bookMarkStatus = await productProvider.bookMarkStatus(userIdx);

    // Rank Result <- Status
    for (var i = 0; i < rankResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < bookMarkStatus.length; j++) {
            
            if (rankResult[i].brandIdx === bookMarkStatus[j].brandIdx) {
                rankResult[i]["bookMarkStatus"] = bookMarkStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Rank Result 'N' Insert
        if (flag === 0)
            rankResult[i]["bookMarkStatus"] = 'N';
    }

    // Rank Result <- Product
    for (var i = 0; i < 3; i++) {
        
        if (i >= rankResult.length )
            break;

        var brandProductResult = await productProvider.brandRankProduct(rankResult[i].brandIdx);
        rankResult[i]["product"] = brandProductResult;
    }

    return res.send(response(baseResponse.SUCCESS,rankResult));

}

 /**
 * API No. 
 * API Name : 베스트 상품 조회 API
 * [GET] /products/best
 */
exports.getBest = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, filter, agefilter} = req.query;
    
    // Request Body
    const bodyIdx = req.body;

    let condition = ''
    var agecondition = ' and u.birth between '

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
    
    // Category Filtering
    switch (filter) {
        case '1' : condition += 'where c.categoryRef = 1'; break;
        case '2' : condition += 'where c.categoryRef = 2'; break;
        case '3' : condition += 'where c.categoryRef = 3'; break;
        case '4' : condition += 'where c.categoryRef = 4'; break;
        case '5' : condition += 'where c.categoryRef = 5'; break;
        case '6' : condition += 'where c.categoryRef = 6'; break;
        case '7' : condition += 'where c.categoryRef = 7'; break;
        case '8' : condition += 'where c.categoryRef = 8'; break;
        case '9' : condition += 'where c.categoryRef = 9'; break;
        case '10' : condition += 'where c.categoryRef = 10'; break;
        case '11' : condition += 'where c.categoryRef = 11'; break;
        case '12' : condition += 'where c.categoryRef = 12'; break;
        case '13' : condition += 'where c.categoryRef = 13'; break;
        default : break;
    }

    // Not Category Filtering
    if (!condition) 
        agecondition = 'where u.birth between '

    // Age Filtering
    switch (agefilter) {
        case '1' : agecondition += '2003 and 2012'; break;
        case '2' : agecondition += '1993 and 2002'; break;
        case '3' : agecondition += '1983 and 1992'; break;
        default : agecondition = ''; break;
    }

    page = size * (page-1);

    // Best Product Result
    const bestResult = await productProvider.bestProduct(page, size, condition, agecondition);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Best Product Result <- Status
    for (var i = 0; i < bestResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (bestResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                bestResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Best Product 'N' Insert
        if (flag === 0)
            bestResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, bestResult));

}
