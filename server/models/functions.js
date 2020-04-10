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
      isNumeric: (value) => {
        return /^-{0,1}\d+$/.test(value)
      },
      isFloat: (value) => {
        return Number(value) === value && value % 1 !== 0
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
      },
      calculateAge: (birth) => {
        let today = new Date();
        let birthDate = new Date(birth);
        let age = today.getFullYear() - birthDate.getFullYear();
        let mon = today.getMonth() - birthDate.getMonth();
        if (mon < 0 || (mon === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age;
      },
      calculateLastLogin: (lastConnection) => {
        let connDate = new Date(lastConnection);
        let dayOfMonth = connDate.getDate();
        let month = connDate.getMonth() + 1;
        let year = connDate.getFullYear();
        let hour = connDate.getHours();
        let minutes = connDate.getMinutes();
        month = month < 10 ? '0' + month : month;
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
        hour = hour < 10 ? '0' + hour : hour;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        lastLogin = dayOfMonth+'/'+ month+'/'+year +' at '+ hour+':'+ minutes
        return lastLogin;
      }
}

module.exports = util;
