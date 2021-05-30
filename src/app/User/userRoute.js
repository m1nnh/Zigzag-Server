module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No ?. 회원가입 API
    app.post('/users/sign-up', user.postUsers);

    // API No ?. 로그인 API
    app.post('/users/sign-in', user.loginUser);

    // API No ?. 회원정보 수정 API
    app.patch('/users/profile', jwtMiddleware, user.patchUsers);

    // API No ?. 로그아웃 API
    app.post('/users/logout', jwtMiddleware, user.logout);

    // API No ?. 비밀번호 찾기 (이메일 임시 비밀번호 발급)
    app.post('/users/password', user.findPassword)

};
