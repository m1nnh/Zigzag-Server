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

// Get homeProduct
exports.homeProduct = async function (userIdx, page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    const homeProductResult = await productDao.selectHomeProduct(connection, [userIdx, page, size]);
  
    connection.release();
  
    return homeProductResult;
  };