
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    

    // API No 1. 회원가입 API
    app.post('/users/sign-up', user.postUsers);

    // API No 2. 로그인 API
    app.post('/users/sign-in', user.loginUser);

    // API No 3. 회원정보 수정 API
    app.patch('/users/profile', jwtMiddleware, user.patchUsers);

    // API No 4. 로그아웃 API
    app.post('/users/logout', jwtMiddleware, user.logout);

    // API No 5. 자동 로그인 API
    app.post('/users/auto-login', jwtMiddleware, user.check);

    // API No 6. 카카오 로그인 API
    app.post('/users/kakao-login', user.kakaoLogin);
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect : '/',
    }), (req, res) => {res.redirect('/');});
    
    // API No 7. 비밀번호 찾기 API (이메일 임시 비밀번호 발급)
    app.post('/users/find-password', user.findPassword);

};
