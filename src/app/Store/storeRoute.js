module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. 41 스토어 북마크 수정 API
    app.patch('/stores/:storeIdx/book-mark', jwtMiddleware, store.patchStoreBookmark);

    // API No. 42 스토어 스토리 생성 API
    app.post('/stores/:storeIdx/story', jwtMiddleware, store.postStory);

    // API No. 43 스토어 스토리 첫 번째 조회 API
    app.get('/stores/:storeIdx/first-story', jwtMiddleware, store.getFirstStory);

    // API No. 44 특정 스토리 조회 API
    app.get('/storys/:storyIdx', jwtMiddleware, store.getStory);

    // API No. 45 북마크 스토어 스토리 목록 조회 API
    app.get('/storys/book-mark/store', jwtMiddleware, store.getStoryList);

    // API No. 46 스토어 전체 랭킹 조회 API
    app.get('/stores/total-rank', jwtMiddleware, store.getTotalRank);

    // API No. 47 북마크 스토어 조회 API
    app.get('/stores/book-mark', jwtMiddleware, store.getBookmarkStore);

    // API No.? 검색 스토어 조회 API
    // app.get('/stores/search', jwtMiddleware, store.getSearchStore);
    
};