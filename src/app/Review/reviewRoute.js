module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 상품별 메인 리뷰 조회 API
    app.get('/reviews/:productIdx/main', jwtMiddleware, review.getMainReview);

    // API No. ? 상품별 토탈 리뷰 타이틀 조회 API
    app.get('/reviews/:productIdx/total-title', jwtMiddleware, review.getTotalReviewTitle);

    // API No. ? 상품별 토탈 리뷰 조회 API
    app.get('/reviews/:productIdx/total', jwtMiddleware, review.getTotalReview);

    // API No. ? 리뷰 좋아요 플래그 수정 API
    app.patch('/reviews/:reviewIdx/like-flag', jwtMiddleware, review.patchLikeFlag);

};