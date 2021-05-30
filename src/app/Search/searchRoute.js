module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No. ? 검색 내용 생성 API
    app.post('/search', jwtMiddleware, search.postSearch);

    // API No. ? 검색 내용 삭제 API
    app.patch('/search', jwtMiddleware, search.patchSearch);

    // API No. ? 최근 검색 내용 조회 API
    app.get('/search/recent', jwtMiddleware, search.getRecentSearch);
 
    // API No. ? 지금 가장 인기있는 검색 조회 API
    app.get('/search/now-best', jwtMiddleware, search.getNowBestSearch);
};