const chalk = require('chalk');

const Valid = {
      isEmpty: (value) => {
        if(!value || (typeof value === 'undefined') || (value.length === 0) || JSON.stringify(value) === '{}') 
            return true
        return false
      },
      isAlpha: (value) => {
        return /^[a-zA-Z]+$/.test(value) 
      },
      isAlphaNum: (value) => {
        return /^[a-zA-Z0-9]+$/.test(value)
      },
      isDigit: (value) => {
        return /[0-9]/.test(value)
      },
      isSpecial: (value) => {
        return /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
      },
      isLowercase: (value) => {
        return /[a-z]/.test(value)
      },
      isUppercase: (value) => {
        return /[A-Z]/.test(value)
      },
      isName: (name) => {
        if((name.length > 30) || !Valid.isAlpha(name)) 
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
            if((username.length < 2) || (username.length > 20) || !Valid.isAlphaNum(username))
                return false
            return true
      },
      isPassword : (password) => {
        if((password.length < 8) || (password.length > 30) ||
        !(Valid.isDigit(password) && Valid.isSpecial(password) && Valid.isLowercase(password) && Valid.isUppercase(password)))
            return false
        return true
      },
      isConfirmPassword: (password, cpassword) => {
        if(cpassword === password)
            return true
        return false
      },
      isToken: (token) => {
        if(Valid.isEmpty(token) || !Valid.isAlphaNum(token))
            return false
        return true
      }
}

module.exports = Valid;