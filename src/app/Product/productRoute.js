module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // API No ?. 로그인 API
    app.get('/product/category')


};
