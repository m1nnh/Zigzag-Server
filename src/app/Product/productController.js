const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

// regex 

const regPage = /^[0-9]/g;
const regSize = /^[0-9]/g;
const regCategory = /^[0-9]/g;

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
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

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
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
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
 * API Name : 랭킹별 브랜드 상품 조회 API
 * [GET] /products/brand/rank
 */
exports.getBrandRank = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    var {large} = req.query;

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
    if (large) {
        if (large == 1) {
            large = parseInt(large) + 1
            var firstCategoryIdxRow = await productProvider.categoryIdx(large);
            large = parseInt(large) + 5
            let first = firstCategoryIdxRow[1].categoryIdx;

            var secondCategoryIdxRow = await productProvider.categoryIdx(large);
            let last = secondCategoryIdxRow[secondCategoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 2) {
            large = parseInt(large) + 6
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 3) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 4) {
            large = parseInt(large) + 8
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 5) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else if (large == 6) {
            large = parseInt(large) + 4
            var categoryIdxRow = await productProvider.categoryIdx(large);
            let first = categoryIdxRow[1].categoryIdx;
            let last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }

        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요.
    }
    else
        condition = ''

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
    let {page, size, large, agefilter} = req.query;
    
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
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    // Category Filtering
    if (large) {
        if (large > 0 & large < 15)
        {
            large = parseInt(large) + 1
            const categoryIdxRow = await productProvider.categoryIdx(large);
            const first = categoryIdxRow[1].categoryIdx;
            const last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'where categoryRef between ' + first + ' and ' + last;
        }
        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요. 
    }
    else
        condition = ''

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

/**
 * API No. 
 * API Name : 타임 특가 상품 조회 API
 * [GET] /products/time-sale
 */
exports.getTimeSale = async function (req, res) {

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
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Time Sale Product Result
    let timeSaleProductResult = await productProvider.timeSaleProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Time Sale Product Result <- Status
    for (var i = 0; i < timeSaleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (timeSaleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                timeSaleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Home Product Result 'N' Insert
        if (flag === 0)
        timeSaleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, timeSaleProductResult));
}


/**
 * API No. 
 * API Name : 세일 상품 조회 API
 * [GET] /products/sale
 */
exports.getSale = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {categoryRef} = req.query;

    // Request Body
    const bodyIdx = req.body;

    let condition = '';
    let saleProductResult;

    // Validation Check (Request Error)
    if (!userIdx | !bodyIdx) 
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2016 : userId를 입력해주세요.

    if (userIdx !== parseInt(bodyIdx.bodyIdx))
        return res.send(errResponse(baseResponse.ID_NOT_MATCHING)); // 2020 : userId가 다릅니다.

    const checkUserIdx = await productProvider.userCheck(userIdx);

    if (checkUserIdx[0].exist === 0)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)) // 2017 : 해당 회원이 존재하지 않습니다.

    if (categoryRef != 1 & (categoryRef < 15 | categoryRef > 104))
        return res.send(errResponse(baseResponse.CATEGORYREF_ERROR_TYPE)); // 2025 : categoryRef 번호를 확인해주세요.
    
    // sale Product Result
    if (categoryRef == 1) {
        condition += ' and s.deliveryPrice = 0'
        saleProductResult = await productProvider.saleProduct(condition);
    }
    else {
        condition += ' and c.categoryRef = ' + categoryRef;
        saleProductResult = await productProvider.saleProduct(condition);
        
    }
    
    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // sale Product Result <- Status
    for (var i = 0; i < saleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (saleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                saleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // sale Product Result 'N' Insert
        if (flag === 0)
        saleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, saleProductResult));

 }

 /**
 * API No. 
 * API Name : 신상/세일 상품 조회 API
 * [GET] /products/new-sale
 */
exports.getNewSale = async function (req, res) {

    // Request Token
    const userIdx = req.verifiedToken.userIdx;

    // Request Query String
    let {page, size, large} = req.query;
    
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

    if (!page)
        return res.send(response(baseResponse.PAGE_EMPTY)); // 2012 : page를 입력해주세요.
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.
    
    // Category Filtering
    if (large) {
        if (large > 0 & large < 15)
        {
            large = parseInt(large) + 1
            const categoryIdxRow = await productProvider.categoryIdx(large);
            const first = categoryIdxRow[1].categoryIdx;
            const last = categoryIdxRow[categoryIdxRow.length - 1].categoryIdx;

            condition = 'and c.categoryRef between ' + first + ' and ' + last;
        }
        else 
            return res.send(errResponse(baseResponse.LARGE_ERROR_TYPE)); // 2024 : large 번호를 확인해주세요. 
    }
    else
        condition = ''

    page = size * (page-1);

    // New Sale Product Result
    const newSaleProductResult = await productProvider.newSaleProduct(page, size, condition);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // Best Product Result <- Status
    for (var i = 0; i < newSaleProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (newSaleProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                newSaleProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // Best Product 'N' Insert
        if (flag === 0)
            newSaleProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, newSaleProductResult));
}

/**
 * API No. 
 * API Name : 신상품 조회 API
 * [GET] /products/new
 */
exports.getNew = async function (req, res) {

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
    
    if (!regPage.test(page) & page < 1) 
        return res.send(response(baseResponse.PAGE_ERROR_TYPE)); // 2013 : page 번호를 확인해주세요.

    if (!size) 
        return res.send(response(baseResponse.SIZE_EMPTY)); // 2014 : size를 입력해주세요.

    if (!regSize.test(size) & size < 1) 
        return res.send(response(baseResponse.SIZE_ERROR_TYPE)); // 2015 : size 번호를 확인해주세요.

    page = size * (page-1);

    // Home Product Result
    let newProductResult = await productProvider.newProduct(page, size);

    // Status Result
    let getLikeProductStatus = await productProvider.likeProductStatus(userIdx);

    // New Product Result <- Status
    for (var i = 0; i < newProductResult.length; i++) {
        
        var flag = 0;
        
        for (var j = 0; j < getLikeProductStatus.length; j++) {
            
            if (newProductResult[i].productIdx === getLikeProductStatus[j].productIdx) {
                newProductResult[i]["likeProductStatus"] = getLikeProductStatus[j].status;
                flag = 1;
                break;
            }
        }

        // New Product Result 'N' Insert
        if (flag === 0)
            newProductResult[i]["likeProductStatus"] = 'N';
    }
    
    return res.send(response(baseResponse.SUCCESS, newProductResult));

 }









////////////////// 여기서부터 토미
 /**
 * API No. 
 * API Name : 모아보기 카테고리 조회 API
 * [GET] /products/category
 */
exports.category = async function(req, res) {
    
    // Request Query String
    let {categoryIdx, page, size, orderfilter, delivary} = req.query;

    // Request Body
    const userIdx = req.body;

    var where = ' AND ';
    let order = ' ORDER BY ';
    let categoryResult


    // 모아보기 전체 카테고리 view
    if(!categoryIdx){

        const moabokiResult = await productProvider.getParentCategory();
        return res.send(response(baseResponse.SUCCESS, moabokiResult));

    }

    // Validation Check (Request Error)
    if(!categoryIdx)
         return res.send(errResponse(baseResponse.PRODUCT_CATEGORYIDX_EMPTY)); // categoryRef를 입력해 주세요.

    if (!regCategory.test(categoryIdx) & categoryIdx < 1)
         return res.send(errResponse(baseResponse.PRODUCT_CATEGORYIDX_STYLE)); // categoryRef를 숫자로 입력해 주세요.
    
    if (!page)
        return res.send(errResponse(baseResponse.PRODUCT_PAGE_EMPTY)); // page를 입력해 주세요.
    
    if (!regCategory.test(page) & page < 1)
        return res.send(errResponse(baseResponse.PRODUCT_PAGE_STYLE)); // page를 숫자로 입력해 주세요.
    
    if (!size)
        return res.send(errResponse(baseResponse.PRODUCT_SIZE_EMPTY)); // size를 입력해 주세요.
    
    if (!regCategory.test(size) & size < 1)
        return res.send(errResponse(baseResponse.PRODUCT_SIZE_STYLE)); // size를 숫자로 입력해 주세요.
    
    page = size*(page-1);
    
     //   if : 상위 카테고리 전체
     //   else : 하위 카테고리 
     //  1~14번 104번 인덱스는 상위 카테고리 상품(c.categoryRef = ?) 으로 조회
     // 나머지 인덱스는 c.categoryIdx = ? 로 조회

     switch(orderfilter){
        case "1" : order += 'count(r.reviewIdx) DESC'; break; // 리뷰 많은 순
        case "2" : order += 'p.createdAt DESC'; break; // 신상품 순
        case "3" : order += 'resultPrice'; break; // 가격 오름순
        case "4" : order += 'resultPrice DESC'; break; // 가격 내림순
        default : order += 'count(rc.readIdx) DESC'; break; // 인기순
    }

    if(delivary == 0)
        where += 's.deliveryPrice = 0'
    else
        where = ''

     // Result 
     let likeProductStatusResult = await productProvider.getLikeProductStatus(userIdx);
     const childCategoryResult = await productProvider.getChildCategory(categoryIdx);


     if(0<categoryIdx<14 || categoryIdx == 104){
        categoryResult = await productProvider.getDetailCategoryRef(categoryIdx, where, order, page, size);
     } else{
        categoryResult = await productProvider.getDetailCategoryIdx(categoryIdx, where, order, page, size);
     }

     categoryResult = await this.isLikeProduct(categoryResult, likeProductStatusResult);

     return res.send(response(baseResponse.SUCCESS, {childCategoryResult, categoryResult}));
}


// Like Status 
isLikeProduct = async function(productResult, likeStatusResult) {
    for (var i = 0; i < productResult.length; i++) {
        var flag = 0;
        for (var j = 0; j < likeStatusResult.length; j++) {
            if (productResult[i].productIdx === likeStatusResult[j].productIdx) {
                productResult[i]["likeProductStatus"] = likeStatusResult[j].status;
            }
        }
        if (flag === 0)
            productResult[i]["likeProductStatus"] = 'N';

    }
}
