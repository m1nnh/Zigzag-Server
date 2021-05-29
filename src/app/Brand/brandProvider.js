const { response } = require("express");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const productDao = require("../../app/Product/productDao");
const brandDao = require("../../app/Brand/brandDao");
const baseResponse = require("../../../config/baseResponseStatus");

