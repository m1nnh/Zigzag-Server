module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // API No ?. 회원가입 API
    app.post('/users/sign-up', user.postUsers);

   

};
