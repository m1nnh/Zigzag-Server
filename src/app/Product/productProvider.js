const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

// User Check
exports.userCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await productDao.selectUserIdx(connection, userIdx);
  connection.release();

  return userCheckResult;
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
exports.brandProduct = async function (page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const brandProductResult = await productDao.selectBrandProduct(connection, [page, size]);

  connection.release();

  return brandProductResult;
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













// 여기서부터 토미

//
exports.getParentCategory = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const parentCategoryResult = await productDao.parentCategory(connection);
  connection.release();
  return parentCategoryResult;
};

//
exports.getChildCategory = async function (categoryIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const parentCategoryResult = await productDao.childCategory(connection, categoryIdx);
  connection.release();
  return parentCategoryResult;
};

//
exports.getDetailCategoryIdx = async function (categoryIdx, where, order, page, size) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const parentCategoryResult = await productDao.detailCategoryIdx(connection, categoryIdx, where, order, page, size);
      connection.release();
      return parentCategoryResult;
    } catch (error) {
        console.log(error);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//
exports.getDetailCategoryRef = async function (categoryIdx, where, order, page, size) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const parentCategoryResult = await productDao.detailCategoryRef(connection, categoryIdx, where, order, page, size);
      connection.release();
      return parentCategoryResult;
    } catch (error) {
      console.log(error);
      return errResponse(baseResponse.DB_ERROR);
    }
};

// 
exports.getLikeProductStatus = async function (userIdx) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const LikeProductStatusResult = await productDao.likeProductStatus(connection, userIdx);
      connection.release();
      return LikeProductStatusResult;
    } catch (error) {
      console.log(error);
      return errResponse(baseResponse.DB_ERROR);
    }
}