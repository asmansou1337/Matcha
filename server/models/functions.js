// const bcrypt = require('bcrypt');

// let hashPassword = await bcrypt.hash(password, 10);

const util = {
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
      escapeHtml: (str) => {
        str  = str.replace(/[&<>'"]/g, 
          tag => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&#39;',
              '"': '&quot;'
            }[tag] || tag))
        return str
      }
}

module.exports = util;
