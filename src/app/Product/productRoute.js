module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No ?. 홈 상품 조회 API
    app.get('/products/home', jwtMiddleware, product.getHome)
   

};