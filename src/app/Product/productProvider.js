const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

// Get homeProduct
exports.homeProduct = async function (page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    const homeProductResult = await productDao.selectHomeProduct(connection, [page, size]);
  
    connection.release();
  
    return homeProductResult;
  };