module.exports = function(app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 홈 상품 조회 API
    app.get('/products/home', jwtMiddleware, product.getHome);

    // API No. ? 홈 상품 슬라이드 상품 조회 API
    app.get('/products/home-slide', jwtMiddleware, product.getHomeSlide);

    // API No. ? 브랜드 상품 조회 API
    app.get('/products/brand', jwtMiddleware, product.getBrand);
   
    // API No. ? 랭킹별 브랜드 상품 조회 API
    app.get('/products/brand-rank', jwtMiddleware, product.getBrandRank);

    // API No. ? 브랜드별 인트로 조회 API
    app.get('/brands/:brandIdx/intro', jwtMiddleware, product.getBrandIntro);

    // API No. ? 브랜드별 이번 주 베스트 상품 조회 API
    app.get('/products/:brandIdx/week-best', jwtMiddleware, product.getWeekBest);

    // API No. ? 브랜드별 카테고리 상품 조회 API
    app.get('/products/:brandIdx/category', jwtMiddleware, product.getBrandCategory);

    // API No. ? 브랜드별 쿠폰 리스트 조회 API 
    app.get('/brands/:brandIdx/coupon-list', jwtMiddleware, product.getBrandCoupon);

    // API No. ? 브랜드별 쿠폰 등록 API
    app.post('/brands/:brandIdx/coupon', jwtMiddleware, product.postBrandCoupon);

    // API No. ? 베스트 상품 조회 API
    app.get('/products/best', jwtMiddleware, product.getBest);

    // API No. ? 타임특가 상품 조회 API
    app.get('/products/time-sale', jwtMiddleware, product.getTimeSale);

    // API No. ? 세일 상품 조회 API (슬라이드)
    app.get('/products/sale', jwtMiddleware, product.getSale);

    // API No. ? 신상/세일 상품 조회 API
    app.get('/products/new-sale', jwtMiddleware, product.getNewSale);

    // API No. ? 신상품 조회 API
    app.get('/products/new', jwtMiddleware, product.getNew);
    
    // API No. ? 카테고리별 상품 전체 조회 API
    app.get('/products/:categoryRef', jwtMiddleware, product.getCategorySale);

    // API No. ? 상품 인트로 조회 API
    app.get('/products/:productIdx/intro', jwtMiddleware, product.getProductIntro);
    
    // API No. ? 상품별 쿠폰 리스트 조회 API
    app.get('/products/:productIdx/coupon-list', jwtMiddleware, product.getProductCoupon);

    // API No. ? 상품별 쿠폰 등록 API
    app.post('/products/:productIdx/coupon', jwtMiddleware, product.postProductCoupon);

    // API No. ? 카테고리별 스토어 상품 조회 API
    app.get('/products/:categoryIdx/store', jwtMiddleware, product.getProductCategoryStore);
    
    // API No. ? 상품 정보 조회 API 
    app.get('/products/:productIdx/info', jwtMiddleware, product.getProductInfo);

    // API No. ? 스토어별 추천 상품 조회 API
    app.get('/products/:storeIdx/recommendation', jwtMiddleware, product.getProductRecommendation);

    // API No. ? 상품 찜 수정 API
    app.patch('/products/:productIdx/like', jwtMiddleware, product.patchLike);

    // API No. ? 스토어 북마크 수정 API
    app.patch('/stores/:storeIdx/book-mark', jwtMiddleware, product.patchStoreBookmark);

    // API No. ? 브랜드 북마크 수정 API
    app.patch('/brands/:brandIdx/book-mark', jwtMiddleware, product.patchBrandBookmark);


};