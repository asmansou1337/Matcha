// const bcrypt = require('bcrypt');

// let hashPassword = await bcrypt.hash(password, 10);
let userManager = require('../models/userModel');
const chalk = require('chalk')

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
        if (birth !== null) {
          let today = new Date();
          let birthDate = new Date(birth);
          let age = today.getFullYear() - birthDate.getFullYear();
          let mon = today.getMonth() - birthDate.getMonth();
          if (mon < 0 || (mon === 0 && today.getDate() < birthDate.getDate())) {
              age--
          }
          return age;
        }
        return null;
      },
      calculateFameRating: async (id) => {
        let calculate = await userManager.calculateFame(id)
        let result;
        if (calculate) {
          // console.log(chalk.green(Number(calculate[0].sum)))
          result = (Number(calculate[0].sum) / Number(calculate[0].totalUsers)) * 5
            if (result > 5) 
                result = 5;
            else if (result < 0)
                result = 0;
        }
        return result.toFixed(2);
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
      },
      calculateDistance: (user1, user2) => {
        const earthRadius = 6371
        let lat1 = user1.latitude
        let lat2 = user2.latitude
        const lon1 = user1.longitude
        const lon2 = user2.longitude
        if(util.isEmpty(lat1) || util.isEmpty(lat2) || util.isEmpty(lon1) || util.isEmpty(lon2)) return null
        const dlat = (lat2 - lat1) * Math.PI / 180;
        const dlon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dlat / 2) * Math.sin(dlat / 2)
              + Math.cos((lat1) * Math.PI / 180) * Math.cos((lat2)* Math.PI / 180)
              * Math.sin(dlon / 2) * Math.sin(dlon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return parseInt(Math.round(earthRadius * c))
    },
    filterByTags: (tags1, tags2) => {
      let commonTags = 0
      tags1.forEach(tag1 => {
          tags2.forEach(tag2 => {
              if (tag2 === tag1) {
                  commonTags++
              }
          });
      });
      return commonTags
    },
    compareValues: (key, order = 'asc') => {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    }
}

module.exports = util;
