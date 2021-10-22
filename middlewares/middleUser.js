// const { isValidEmail } = require('../utils/utils');
const { validationResult } = require('express-validator');

const middlewareCreateUser = async (req, resp, next) => {

  try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    const errorsArray = errors.array() //errors.array()
    
    for(i=0 ; i<errorsArray.length; i++){
      if(errorsArray[i].value === '' || errorsArray[i].value === null || errorsArray[i].value === undefined ){
        errorsArray[i].msg = "Please, complete this input : " + errorsArray[i].param
      }
      if(errorsArray[i].param === "email" && errorsArray[i].msg === "Invalid value" || errorsArray[i].param === "password" && errorsArray[i].msg === "Invalid value" || errorsArray[i].param === "name" && errorsArray[i].msg === "Invalid value"){
        errorsArray[i].msg = "Please, check your " + errorsArray[i].param + " and change for valid "+ errorsArray[i].param
      }
    }  
    
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errorsArray });
    }
    return next()

  } catch (error) {
      return next(error)
  }
};
  
module.exports = {
  middlewareCreateUser
}