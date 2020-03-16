const chalk = require('chalk');
const util = require('./functions');

const errorTab = {
  "first Name" : "Your first name should contain caracteres only!",
  "last Name": "Your last name should contain caracteres only!",
  "username": "Your username should contain alphanumerique caracteres only!",
  "email": "Your email is not valid!",
  "password": "Password should be at least 8 characters in length and should include at least one uppercase letter,one lowercase letter, one number, and one special character.!",
  "password confirmation": "Both password should be the same!"
}

const Valid = {
      validate: (data, field, func) => {
        if (util.isEmpty(data))
            return `Your ${field} should not be empty!`;
        if (!func(data.trim()))
            return errorTab[field];
        return "success";
      },
      isConfirmPassword: (password, cpassword) => {
        if (util.isEmpty(cpassword))
            return `Your password confirmation should not be empty!`;
        if ((cpassword !== password))
            return "Both password should be the same!";
        return "success";
      },
      isName: (name) => {
        if((name.length > 30) || !util.isAlpha(name)) 
            return false
        return true
      },
      isEmail: (email) => {
        if((email.length > 60) ||
        (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false))
            return false
        return true
      },
      isUsername: (username) => {
            if((username.length < 2) || (username.length > 20) || !util.isAlphaNum(username))
                return false
            return true
      },
      isPassword : (password) => {
        if((password.length < 8) || (password.length > 30) ||
        !(util.isDigit(password) && util.isSpecial(password) && util.isLowercase(password) && util.isUppercase(password)))
            return false
        return true
      },
      isToken: (token) => {
        if(util.isEmpty(token) || !util.isAlphaNum(token))
            return false
        return true
      }
}

module.exports = Valid;