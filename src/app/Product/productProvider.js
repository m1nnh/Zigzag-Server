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

// Get Home Product
exports.homeProduct = async function (page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    const homeProductResult = await productDao.selectHomeProduct(connection, [page, size]);
  
    connection.release();
  
    return homeProductResult;
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

// Get Sale Product
exports.saleProduct = async function (condition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const saleProductResult = await productDao.selectSaleProduct(connection, condition);

  connection.release();

  return saleProductResult;
};

// Get New Sale Product
exports.newSaleProduct = async function (page, size, condition) {
  const connection = await pool.getConnection(async (conn) => conn);
  const newSaleProductResult = await productDao.selectNewSaleProduct(connection, [page, size, condition]);

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

      // productIntor <- bookmarkStatus Insert
      if (!bookmarkStatus)
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