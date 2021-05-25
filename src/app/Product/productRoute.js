module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No ?. 홈 상품 조회 API
    app.get('/products/home', jwtMiddleware, product.getHome);

    // API No ?. 브랜드 상품 조회 API
    app.get('/products/brand', jwtMiddleware, product.getBrand);
   
    // API No ?. 랭킹별 브랜드 상품 조회 API
    app.get('/products/brand/rank', jwtMiddleware, product.getBrandRank);

    // API No ?. 베스트 상품 조회 API
    app.get('/products/best', jwtMiddleware, product.getBest);
};