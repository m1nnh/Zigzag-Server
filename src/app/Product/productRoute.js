module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. 9 홈 상품 조회 API
    app.get('/products/home', jwtMiddleware, product.getHome);

    // API No. 10 홈 슬라이드 상품 조회 API
    app.get('/products/home-slide', jwtMiddleware, product.getHomeSlide);

    // API No. 11 브랜드 상품 조회 API
    app.get('/products/brand', jwtMiddleware, product.getBrand);
   
    // API No. 12 Top3 브랜드 상품 조회 API
    app.get('/products/top3-brand', jwtMiddleware, product.getBrandRank);

    // API No. 13 전체 브랜드 랭킹별 상품 조회 API
    app.get('/products/rank-brand', jwtMiddleware, product.getTotalRank)

    // API No. 14 브랜드별 이번 주 베스트 상품 조회 API
    app.get('/products/:brandIdx/week-best', jwtMiddleware, product.getWeekBest);

    // API No. 15 브랜드별 카테고리 상품 조회 API
    app.get('/products/:brandIdx/category', jwtMiddleware, product.getBrandCategory);

    // API No. 16 베스트 상품 조회 API
    app.get('/products/best', jwtMiddleware, product.getBest);

    // API No. 17 타임특가 상품 조회 API
    app.get('/products/time-sale', jwtMiddleware, product.getTimeSale);

    // API No. 18 혜택 상품 조회 API (슬라이드)
    app.get('/products/benefit', jwtMiddleware, product.benefit);

    // API No. 19 혜택 상품 카테고리별 전체 조회 API
    app.get('/products/:categoryRef/benefit/', jwtMiddleware, product.getSale);

    // API No. 20 신상/세일 상품 조회 API
    app.get('/products/new-sale', jwtMiddleware, product.getNewSale);

    // API No. 21 신상품 조회 API
    app.get('/products/new', jwtMiddleware, product.getNew);
    
    // API No. 22 상품 인트로 조회 API
    app.get('/products/:productIdx/intro', jwtMiddleware, product.getProductIntro);
    
    // API No. 23 상품별 쿠폰 리스트 조회 API
    app.get('/products/:productIdx/coupon-list', jwtMiddleware, product.getProductCoupon);

    // API No. 24 상품별 쿠폰 등록 API
    app.post('/products/:productIdx/coupon', jwtMiddleware, product.postProductCoupon);

    // API No. 25 카테고리별 스토어 상품 조회 API
    app.get('/products/:categoryIdx/store', jwtMiddleware, product.getProductCategoryStore);
    
    // API No. 26 상품 정보 조회 API 
    app.get('/products/:productIdx/info', jwtMiddleware, product.getProductInfo);

    // API No. 27 스토어별 추천 상품 조회 API
    app.get('/products/:storeIdx/recommendation', jwtMiddleware, product.getProductRecommendation);

    // API No. 29 찜 상품 수정 API
    app.patch('/products/:productIdx/like', jwtMiddleware, product.patchLike);

    // API No. ? 북마크 스토어 신상품 조회 API
    app.get('/products/new/book-mark-store', jwtMiddleware, product.getBookmarkProduct);

};