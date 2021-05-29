const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productDao = require("../../app/Product/productDao");
const storeDao = require("../../app/Store/storeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Post Store Story
exports.postStoreStory = async function (storeIdx, storyUrl) {
    let getStoreStory;
    // Transaction
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        
        const storeStoryResult = await storeDao.insertStoreStory(connection, [storeIdx, storyUrl]);
        getStoreStory = await storeDao.selectStoreStory(connection, storeIdx);

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
    
  
    return getStoreStory;
  }