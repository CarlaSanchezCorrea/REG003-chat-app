const { createUser } = require('../controller/user');
const { middlewareCreateUser } = require('../middlewares/middleUser')
const { body } = require('express-validator');
//const { getConnectedUsers } = require('../controller/user')

/** @module User **/
const nameValidate = body('name').isLength({ min: 2 });    
const emailValidate = body('email').isEmail();
const passwordValidate = body('password').isLength({ min: 8 });

module.exports = (app, nextMain) => {

  app.post('/users', 
    nameValidate, 
    emailValidate, 
    passwordValidate, 
    middlewareCreateUser, 
    createUser 
  );

  // app.get('/users', getConnectedUsers);

  return nextMain();
};
