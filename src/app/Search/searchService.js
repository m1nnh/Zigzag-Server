const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productDao = require("../../app/Product/productDao");
const searchDao = require("../../app/Search/searchDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Create Search
exports.postSearch = async function (userIdx, contents) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postSearchResult = await searchDao.insertSearch(connection, [userIdx, contents]);
  
    connection.release();
  
    return postSearchResult;
};

// Update Search Status
exports.updateSearchStatus = async function (userIdx, contents) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateStatusResult = await searchDao.updateSearchStatus(connection, [userIdx, contents]);
  
    connection.release();
  
    return updateStatusResult;
};

// Delete Search
exports.deleteContents = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteResult = await searchDao.deleteContents(connection, userIdx);
  
    connection.release();
  
    return deleteResult;
};
