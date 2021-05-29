module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 스토어 북마크 수정 API
    app.patch('/stores/:storeIdx/book-mark', jwtMiddleware, store.patchStoreBookmark);

    // API No. ? 스토어 스토리 생성 API
    app.post('/stores/:storeIdx/story', jwtMiddleware, store.postStory);

    // API No. ? 스토어 스토리 첫 번째 조회 API
    app.get('/stores/:storeIdx/first-story', jwtMiddleware, store.getFirstStory);

    // API No. ? 특정 스토리 조회 API
    app.get('/storys/:storyIdx', jwtMiddleware, store.getStory);

    // API No. ? 북마크 스토어 스토리 목록 조회 API
    app.get('/storys/book-mark/store', jwtMiddleware, store.getStoryList);
    
};