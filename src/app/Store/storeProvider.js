const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const storeDao = require("../../app/Store/storeDao");
const baseResponse = require("../../../config/baseResponseStatus");

// storyIdx Check
exports.storyIdxCheck = async function (storyIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storyCheckResult = await storeDao.selectStoryIdx(connection, storyIdx);
    connection.release();
  
    return storyCheckResult;
};

// Store storyIdx Check
exports.storeStoryIdxCheck = async function (storeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storyCheckResult = await storeDao.selectStoreStoryIdx(connection, storeIdx);
    connection.release();
  
    return storyCheckResult;
};

// Story List
exports.getStoryList = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    let storyList = await storeDao.selectBookMarkStoreStory(connection, userIdx);

    if (storyList.length > 0 ) {
        for (var i = 0; i < storyList.length; i++) {
            var notReadCheck = await storeDao.selectNotReadStory(connection, [storyList[i].storeIdx, userIdx]);
            var getStoreStoryIdx = await storeDao.selectStoreStoryIdxList(connection, storyList[i].storeIdx);

            if (notReadCheck.length === getStoreStoryIdx.length) 
                storyList[i]["allReadStoryStatus"] = 'Y'
            else
                storyList[i]["allReadStoryStatus"] = 'N'
        
        }
    }
    
    connection.release();
  
    return storyList;
};

// Get Story
exports.getStory = async function (storyIdx, userIdx) {
    let getStoreStory;
    // Transaction
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        
            getStoreStory = await storeDao.selectStory(connection, [storyIdx, userIdx]);
            checkUserRead = await storeDao.selectStoryReadCheck(connection, [storyIdx, userIdx]);
            
            if (checkUserRead[0].exist === 0)
                insertReadCount = await storeDao.insertReadCount(connection, [storyIdx, userIdx]);

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


// Get Store Story
exports.getStoreStory = async function (storeIdx, userIdx) {
    let getStoreStory;
    var result = [];
    var readIdx= [];
    var res = []
    // Transaction
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        
        notReadCheck = await storeDao.selectNotReadStory(connection, [storeIdx, userIdx]);
        getStoreStoryIdx = await storeDao.selectStoreStoryIdxList(connection, storeIdx);

        if (getStoreStoryIdx.length === 0)
            return res.send(errResponse(baseResponse.STORYIDX_NOT_EXIST)) // 2042 : 존재하지 않는 스토리입니다.
        
        if (notReadCheck.length > 0)
        {
            for (var i = 0; i < getStoreStoryIdx.length; i++) {
                var flag = 0;
                for (var j = 0; j < notReadCheck.length; j++) {
                    if (getStoreStoryIdx[i].storyIdx === notReadCheck[j].storyIdx)
                        { 
                            flag = 1;
                            break 
                        }
            }
            if (flag === 0)
                result.push(getStoreStoryIdx[i].storyIdx);
            else
                readIdx.push(getStoreStoryIdx[i].storyIdx); 
        }

            for (var i = 0; i < readIdx.length; i++)
                result.push(readIdx[i]);
        
            getStoreStory = await storeDao.selectStory(connection, [result[0], userIdx]);
            checkUserRead = await storeDao.selectStoryReadCheck(connection, [result[0], userIdx]);
            
            if (checkUserRead[0].exist === 0)
                insertReadCount = await storeDao.insertReadCount(connection, [result[0], userIdx]);
        }
        else {
            result = getStoreStoryIdx
            getStoreStory = await storeDao.selectStory(connection, [result[0], userIdx]);
            insertReadCount = await storeDao.insertReadCount(connection, [result[0], userIdx]);
        }
        storyIdxList = result;
        let storyInfo = getStoreStory;
        res = {storyIdxList, storyInfo};
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
    
  
    return res;
}