module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 홈 상품 조회 API
    app.get('/products/home', jwtMiddleware, product.getHome);

    // API No. ? 브랜드 상품 조회 API
    app.get('/products/brand', jwtMiddleware, product.getBrand);
   
    // API No. ? 랭킹별 브랜드 상품 조회 API
    app.get('/products/brand/rank', jwtMiddleware, product.getBrandRank);

    // API No. ? 베스트 상품 조회 API
    app.get('/products/best', jwtMiddleware, product.getBest);

    // API No. ? 타임특가 상품 조회 API
    app.get('/products/time-sale', jwtMiddleware, product.getTimeSale);

    // API No. ? 세일 상품 조회 API
    app.get('/products/sale', jwtMiddleware, product.getSale);

    // API No. ? 신상/세일 상품 조회 API
    app.get('/products/new-sale', jwtMiddleware, product.getNewSale);

    // API No. ? 신상품 조회 API
    app.get('/products/new', jwtMiddleware, product.getNew);
    
};