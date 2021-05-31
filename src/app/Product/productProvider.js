const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");

// User Check
exports.userCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await productDao.selectUserIdx(connection, userIdx);
  connection.release();

  return userCheckResult;
};

// ProductIdx Check
exports.productIdxCheck = async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productIdxCheckResult = await productDao.selectProductIdx(connection, productIdx);
  connection.release();

  return productIdxCheckResult;
};

// StoreIdx Check
exports.storeCheck = async function (storeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeCheckResult = await productDao.selectStoreIdx(connection, storeIdx);
  connection.release();

  return storeCheckResult;
};

// BrandIdx Check
exports.brandIdxCheck = async function (brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandCheckResult = await productDao.selectBrandIdx(connection, brandIdx);
  connection.release();

  return brandCheckResult;
};

// ReviewIdx Check
exports.reviewIdxCheck = async function (reviewIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewCheckResult = await productDao.selectReviewIdx(connection, reviewIdx);
  connection.release();

  return reviewCheckResult;
};

// Like Reivew Check
exports.likeReviewCheck = async function (reviewIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeStatusResult = await productDao.selectLikeReviewStatus(connection, [reviewIdx, userIdx]);
  connection.release();

  return likeStatusResult;
};

// LikeFlag Status Check
exports.likeFlagStatusCheck = async function (reviewIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeStatusResult = await productDao.selectLikeFlagStatus(connection, [reviewIdx, userIdx]);
  connection.release();

  return likeStatusResult;
};

// Like Check
exports.likeCheck = async function (productIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeStatusResult = await productDao.selectLikeStatus(connection, [productIdx, userIdx]);
  connection.release();

  return likeStatusResult;
};

// Store Check
exports.storeBookmarkCheck = async function (storeIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookmarkStatusResult = await productDao.selectStoreBookmarkStatus(connection, [storeIdx, userIdx]);
  connection.release();

  return bookmarkStatusResult;
};

// Brand Check
exports.brandBookmarkCheck = async function (brandIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookmarkStatusResult = await productDao.selectBrandBookmarkStatus(connection, [brandIdx, userIdx]);
  connection.release();

  return bookmarkStatusResult;
};


// Get Home Product
exports.homeProduct = async function (page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    const homeProductResult = await productDao.selectHomeProduct(connection, [page, size]);
  
    connection.release();
  
    return homeProductResult;
};

// Get Home Slide Product
exports.homeSlideProduct = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const homeSlideProductResult = await productDao.selectHomeSlideProduct(connection);

  connection.release();

  return homeSlideProductResult;
};

// Get Like Product Status
exports.likeProductStatus = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeProductStatusResult = await productDao.selectLikeProductStatus(connection, userIdx);

  connection.release();

  return likeProductStatusResult;
};

// Get Brand Product
exports.brandProduct = async function (page, size, brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandProductResult = await productDao.selectBrandProduct(connection, [page, size, brandIdx]);

  connection.release();

  return brandProductResult;
};

// Get CategoryIdx
exports.categoryIdx = async function (num) {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryIdxResult = await productDao.selectCategoryIdx(connection, num);

  connection.release();

  return categoryIdxResult;
};

// Get Brand Rank
exports.brandRank = async function (condition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandRankResult = await productDao.selectBrandRank(connection, condition);

  connection.release();

  return brandRankResult;
};


// Get Total Rank
exports.brandTotalRank = async function (page, size, condition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandRankResult = await productDao.selectBrandTotalRank(connection, [page, size, condition]);

  connection.release();

  return brandRankResult;
};


// Get Brand Intro
exports.brandIntro = async function (brandIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandIntroResult = await productDao.selectBrandIntro(connection, [brandIdx, userIdx]);

  connection.release();

  return brandIntroResult;
};

// Get Week Best Product
exports.weekBestProduct = async function (brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const weekBestProductResult = await productDao.selectWeekBestProduct(connection, brandIdx);

  connection.release();

  return weekBestProductResult;
};

// Get Brand Category
exports.categoryList = async function (brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryListResult = await productDao.selectCategoryList(connection, brandIdx);

  connection.release();

  return categoryListResult;
};

// Get Brand Category Product
exports.brandCategoryProduct = async function (page, size, category, condition, brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandCategoryProductResult = await productDao.selectBrandCategoryProduct(connection, [page, size, category, condition, brandIdx]);

  connection.release();

  return brandCategoryProductResult;
};

// Get Brand Name
exports.brandName = async function (brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandName = await productDao.selectBrandName(connection,brandIdx);

  connection.release();

  return brandName;
};

// Get Brand Coupon
exports.brandCoupon = async function (brandIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandCouponResult = await productDao.selectBrandCoupon(connection, [brandIdx, userIdx]);

  connection.release();

  return brandCouponResult;
};

// Get Haveflag 
exports.haveFlag = async function (couponIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const flag = await productDao.haveFlag(connection, [couponIdx, userIdx]);

  connection.release();

  return flag;
};

// Get Bookmark Brand Status
exports.bookMarkStatus = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookMarkStatusResult = await productDao.selectBookMarkStatus(connection, userIdx);

  connection.release();

  return bookMarkStatusResult;
};

// Get Brand Rank Product
exports.brandRankProduct = async function (brandIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandProductResult = await productDao.selectRankBrandProduct(connection, brandIdx);

  connection.release();

  return brandProductResult;
};

// Get Best Product
exports.bestProduct = async function (page, size, condition, agecondition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bestProductResult = await productDao.selectBestProduct(connection, [page, size, condition, agecondition]);

  connection.release();

  return bestProductResult;
};

// Get Time Sale Product
exports.timeSaleProduct = async function (page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const timeSaleProductResult = await productDao.selectTimeSaleProduct(connection, [page, size]);

  connection.release();

  return timeSaleProductResult;
};

// Get Benefit Product
exports.benefitProduct = async function (categoryRef) {
  const connection = await pool.getConnection(async (conn) => conn);
  const saleProductResult = await productDao.selectBenefitProduct(connection, categoryRef);

  connection.release();

  return saleProductResult;
};


// Get Sale Product
exports.saleProduct = async function (condition, page, size, categoryRef) {
  const connection = await pool.getConnection(async (conn) => conn);
  const saleProductResult = await productDao.selectSaleProduct(connection, [condition, page, size, categoryRef]);

  connection.release();

  return saleProductResult;
};


// Get New Sale Product
exports.newSaleProduct = async function (page, size, condition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const newSaleProductResult = await productDao.selectSaleNewProduct(connection, [page, size, condition]);

  connection.release();

  return newSaleProductResult;
};

// Get New Product
exports.newProduct = async function (page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const newProductResult = await productDao.selectNewProduct(connection, [page, size]);

  connection.release();

  return newProductResult;
};

// Get Product Intro
exports.productIntro = async function (productIdx, userIdx) {
  
  var productIntro;
  var ca = [];
  var cl = [];


  // Transaction
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      
      // Get Image
      var productImage = await productDao.selectProductImage(connection, productIdx);
      
      // Get Product Intro
      productIntro = await productDao.selectProductIntro(connection, productIdx);
      
      // Get Bookmark Status
      const bookmarkStatus = await productDao.selectStoreStatus(connection, userIdx);
      const storeIdx = productIntro[0].storeIdx;

      // Get StoreInfo
      storeInfo = await productDao.selectStoreInfo(connection, storeIdx);

      // Get First Category Reference List
      const firstCategoryRefList = await productDao.selectFirstCategoryList(connection, storeIdx);

      // productIntro <- Image Insert
      productIntro[0]["productImage"] = productImage;

      // productIntro <- storeInfo Insert
      productIntro[1] = storeInfo[0]

      // productIntro <- bookmarkStatus Insert
      if (bookmarkStatus.length === 0)
        productIntro[1]["bookmarkStatus"] = 'N';
      else
        productIntro[1]["bookmarkStatus"] = bookmarkStatus[0].status;

      // Get Second CategoryIdx 
      for (var i = 0; i < firstCategoryRefList.length; i++) {
        result = await productDao.selectSecondCategoryList(connection, firstCategoryRefList[i].categoryRef);
        ca.push(result);
      }
      
      // Get Last CategoryIdx, CategoryName
      for (var i = 0; i < ca.length; i++) {
        const result = await productDao.selectLastCategoryList(connection, ca[i][0].categoryRef);
        var flag = 0
        if (cl.length !== 0)  {

          for (var j = 0; j < cl.length; j++) {
              if (result[0].categoryIdx === cl[j][0].categoryIdx)
                {
                  flag = 1;
                  break;
                }
            }  
          }

        if (flag === 1)
            continue;
        else
          cl.push(result);

      }

      // Array
      productIntro[1]["categoryList"] = cl[0];

      // productIntro <- CategoryIdx, CategoryName Insert
      for (var i = 1; i < cl.length; i++)
        productIntro[1]["categoryList"].push(cl[i][0]);

      // Insert Readcount
      await productDao.insertReadCount(connection, [productIdx, userIdx]);

      connection.commit();
      connection.release();
    }
    catch (err) {

      connection.rollback();
      connection.release();
      logger.error(`App - getProductIntro Transaction error\n: ${err.message}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  } catch (err) {

    logger.error(`App - getProductIntro Transaction error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
  

  return productIntro;
}

// Get Store Name
exports.storeName = async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeName = await productDao.selectStoreName(connection, productIdx);

  connection.release();

  return storeName;
};

// Get Product Coupon
exports.productCoupon = async function (productIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productCouponResult = await productDao.selectProductCoupon(connection, [productIdx, userIdx]);

  connection.release();

  return productCouponResult;
};


// Get Category Product
exports.categoryProduct = async function (condition, storeIdx, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryProductResult = await productDao.selectCategoryProduct(connection, [condition, storeIdx, page, size]);
  connection.release();

  return categoryProductResult;
};

// Get categoryName
exports.categoryName = async function (categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryNameResult = await productDao.selectLastCategoryList(connection, categoryIdx);
  connection.release();

  return categoryNameResult;
};

// Get Product Info
exports.productInfo = async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productInfoResult = await productDao.selectProductInfo(connection, productIdx);
  connection.release();

  return productInfoResult;
};

// Get Recommendation Product
exports.recommendationProduct= async function (storeIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const recommendationProductResult = await productDao.selectRecommendationProduct(connection, storeIdx);
  connection.release();

  return recommendationProductResult;
};

// Get reviewTitle
exports.reviewTitle= async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewTitleResult = await productDao.selectReviewTitle(connection, productIdx);
  connection.release();

  return reviewTitleResult;
};

// Get reviewContents
exports.reviewContents= async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewContentsResult = await productDao.selectReviewContents(connection, productIdx);
  connection.release();

  return reviewContentsResult;
};

// Get reviewImage
exports.reviewImage= async function (reviewIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewImageResult = await productDao.selectReviewImage(connection, reviewIdx);
  connection.release();

  return reviewImageResult;
};

// Get reviewTotalTitle
exports.reviewTotalTitle= async function (productIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewTitleResult = await productDao.selectReviewTotalTitle(connection, productIdx);
  connection.release();

  return reviewTitleResult;
};

// Get reviewTotalContents
exports.totalReviewContents= async function (productIdx, page, size, condition, pcondition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewContentsResult = await productDao.selectReviewTotalContents(connection, [productIdx, page, size, condition, pcondition]);
  connection.release();

  return reviewContentsResult;
};

// Get Like Flag Review
exports.likeFlagReview= async function (userIdx, reviewIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeFlagResult = await productDao.selectLikeFlag(connection, [userIdx, reviewIdx]);
  connection.release();

  return likeFlagResult;
};

// Get Bookmark Store Product
exports.bookmarkNewProduct= async function (userIdx, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productListResult = await productDao.selectProductList(connection, [userIdx, page, size]);
  connection.release();

  return productListResult;
};

// Get Search Product
exports.searchProduct= async function (userIdx, contents, categoryCondition, deliveryCondition, originalCondition, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productListResult = await productDao.selectSearchProductList(connection, [userIdx, contents, categoryCondition, deliveryCondition, originalCondition, page, size]);
  connection.release();

  return productListResult;
};


// Check CategoryIdx
exports.categoryCheck= async function (brandIdx, categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await productDao.selectCheckCategoryIdx(connection, [brandIdx, categoryIdx]);
  connection.release();

  return checkResult;
};

