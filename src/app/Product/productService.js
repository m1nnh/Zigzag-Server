const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productProvider = require("./productProvider");
const productDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// Insert Like
exports.insertLike = async function (productIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertResult = await productDao.insertLike(connection, [productIdx, userIdx]);
    connection.release();

    return insertResult;
}

// update Like
exports.updateLike = async function (productIdx, userIdx, status) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateResult = await productDao.updateLike(connection, [productIdx, userIdx, status]);

    connection.release();

    return updateResult;
}

// Insert Store Bookemark
exports.insertStore = async function (storeIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertResult = await productDao.insertStore(connection, [storeIdx, userIdx]);
    connection.release();

    return insertResult;
}

// update Store Bookmark
exports.updateStore = async function (storeIdx, userIdx, status) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateResult = await productDao.updateStore(connection, [storeIdx, userIdx, status]);

    connection.release();

    return updateResult;
}

// Insert Brand Bookemark
exports.insertBrand = async function (brandIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertResult = await productDao.insertBrand(connection, [brandIdx, userIdx]);
    connection.release();

    return insertResult;
}

// update Brand Bookmark
exports.updateBrand = async function (brandIdx, userIdx, status) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateResult = await productDao.updateBrand(connection, [brandIdx, userIdx, status]);

    connection.release();

    return updateResult;
}

// Insert Brand Coupon
exports.brandCoupon= async function (couponIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertResult = await productDao.insertBrandCoupon(connection, [couponIdx, userIdx]);
    connection.release();

    return insertResult;
}

// Insert Product Coupon
exports.productCoupon= async function (couponIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertResult = await productDao.insertProductCoupon(connection, [couponIdx, userIdx]);
    connection.release();

    return insertResult;
}