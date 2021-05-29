module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 스토어 북마크 수정 API
    app.patch('/stores/:storeIdx/book-mark', jwtMiddleware, store.patchStoreBookmark);
};