module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 리뷰 좋아요 플래그 수정 API
    app.patch('/reviews/:reviewIdx/like-flag', jwtMiddleware, review.patchLikeFlag);

};