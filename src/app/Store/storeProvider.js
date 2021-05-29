const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const storeDao = require("../../app/Store/storeDao");
const baseResponse = require("../../../config/baseResponseStatus");