module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // API No ?. 로그인 API
    app.post('/users/sign-in', user.login);

    // API No ?. 회원정보 수정 API
    app.patch('/users/:userId', jwtMiddleware, user.patchUsers)

    // API No ?. 앱 푸시 변경 API
    app.patch('/users/:userId/FlagSetting', jwtMiddleware, user.settingApp)

    // API No ?. 환불 계좌 변경 API
    app.patch('/users/:userId/rePayAccount', jwtMiddleware, user.setrePayAccount);

};

