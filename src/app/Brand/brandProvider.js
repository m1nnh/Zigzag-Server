const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const brandDao = require("../../app/Brand/brandDao");
const baseResponse = require("../../../config/baseResponseStatus");

// Get Rank Brand
exports.getRankBrand = async function (userIdx, page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    const rankBrandResult = await brandDao.selectRankBrand(connection, [userIdx, page, size]);
  
    connection.release();
  
    return rankBrandResult;
};

// Get New Brand
exports.getNewBrand = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const newBrandResult = await brandDao.selectNewBrand(connection, userIdx);
  
    connection.release();
  
    return newBrandResult;
};
  