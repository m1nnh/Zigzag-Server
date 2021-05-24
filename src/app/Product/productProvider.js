const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

// Get homeProduct
exports.parentCategory = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const parentCategoryResult = await productDao.parentCategory(connection);
  
    connection.release();
  
    return parentCategoryResult[0];
  };