const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const searchDao = require("../../app/Search/searchDao");
const baseResponse = require("../../../config/baseResponseStatus");

// Get Contents Check
exports.contentsCheck= async function (userIdx, contents) {
    const connection = await pool.getConnection(async (conn) => conn);
    const contentsCheckResult = await searchDao.selectContentsCheck(connection, [userIdx, contents]);
  
    connection.release();
  
    return contentsCheckResult;
};

// Get Search Status Check
exports.searchStatusCheck= async function (userIdx, contents) {
    const connection = await pool.getConnection(async (conn) => conn);
    const statusCheckResult = await searchDao.selectSearchStatusCheck(connection, [userIdx, contents]);
  
    connection.release();
  
    return statusCheckResult;
};


// Get Recent Search
exports.getRecentSearch = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const recentSearchResult = await searchDao.selectRecentSearch(connection, userIdx);
  
    connection.release();
  
    return recentSearchResult;
};

// Get User Contents Check
exports.userContentsCheck= async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const contentsCheckResult = await searchDao.selectUserContentsCheck(connection, userIdx);
  
    connection.release();
  
    return contentsCheckResult;
};

// Get Now Best Search
exports.getNowBestSearch = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const nowBestSearchResult = await searchDao.selectNowBestSearch(connection);
  
    connection.release();
  
    return nowBestSearchResult;
};
