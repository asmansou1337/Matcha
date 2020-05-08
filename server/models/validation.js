const chalk = require('chalk');
const util = require('./functions');

const errorTab = {
  "first Name" : "Your first name should contain caracters only!",
  "last Name": "Your last name should contain caracters only!",
  "username": "Your username should contain alphanumerique caracters only!",
  "email": "Your email is not valid!",
  "password": "Password should be at least 8 characters in length and should include at least one uppercase letter,one lowercase letter, one number, and one special character.!",
  "password confirmation": "Both password should be the same!",
  "birthday": "Your BirthDay is Invalid (Format: YYYY-MM-DD) / You Should be at least 18 & less than 120",
  "gender": "Your Gender is Invalid",
  "orientation": "Your Orientation is Invalid",
  "bio": "Your biography should be less than 200 caracters",
  "tags": "Your tags should be alphanumerique caracteres only!",
  "chat message": "Your message should be less than 200 caracters"
}

const Valid = {
      validate: (data, field, func) => {
        if (util.isEmpty(data))
            return `Your ${field} should not be empty!`
        if (!func(data.trim()))
            return errorTab[field]
        return "success"
      },
      isConfirmPassword: (password, cpassword) => {
        if (util.isEmpty(cpassword))
            return `Your password confirmation should not be empty!`
        if ((cpassword !== password))
            return "Both password should be the same!"
        return "success"
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
      },
      isGender: (gender) => {
        if(gender !== 'male' && gender !== 'female')
            return false
        return true
      },
      isOrientation: (orientation) => {
        if(orientation !== 'heterosexual' && orientation !== 'homosexual' && orientation !== 'bisexual')
            return false
        return true
      },
      isBirthDate: (date) => {
        if(date.length !== 'YYYY-MM-DD'.length || date.split('-').length !== 3 ||
         /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date) === false)
          return false
        let today = new Date();
        let birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        let mon = today.getMonth() - birthDate.getMonth();
        if (mon < 0 || (mon === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        if(age < 18 || age > 120)
            return false
        return true
      },
      isBio: (bio) => {
        if((bio.length > 200) || bio.length < 2)
            return false
        return true
      },
      isTags: (tags) => {
        const values = Object.values(tags)
        if (values.length === 0)
          return `Your tags should not be empty!`
        for (const tag of values) {
            if((tag.length < 1) || (tag.length > 20) || !util.isAlphaNum(tag))
              return errorTab['tags']
        }
        return "success"
      },
      isFilterTags: (tags) => {
        if(Array.isArray(tags) && tags.length > 0) {
          const values = Object.values(tags)
          for (const tag of values) {
            if((tag.length < 1) || (tag.length > 20) || !util.isAlphaNum(tag))
              return false
          }
        }
        return true
      },
      isKeywordFilterValid: (filter) => {
        console.log(chalk.yellow(typeof filter['keyword']))
        if (!util.isEmpty(filter['keyword'])) {
          if(!util.isAlphaNum(filter['keyword']))
            return false
        }
        return true
      },
      isAgeFilterValid: (filter) => {
        if (!util.isEmpty(filter['age-min']) &&  !util.isEmpty(filter['age-max'])) {
          if (!util.isDigit(filter['age-min']) || !util.isDigit(filter['age-max']) || (Number(filter['age-max']) < Number(filter['age-min']))) 
            return false
        }
        return true
      },
      isRatingFilterValid: (filter) => {
        if (!util.isEmpty(filter['rating-min']) &&  !util.isEmpty(filter['rating-max'])) {
          if (!util.isDigit(filter['rating-min']) || !util.isDigit(filter['rating-max']) || (Number(filter['rating-max']) < Number(filter['rating-min']))) 
            return false
        }
        return true
      },
      isLocationFilterValid: (filter) => {
        if (!util.isEmpty(filter['location-min']) &&  !util.isEmpty(filter['location-max'])) {
          // console.log('location')
          if (!util.isDigit(filter['location-min']) || !util.isDigit(filter['location-max']) || (Number(filter['location-max']) < Number(filter['location-min']))) 
            return false
        }
        return true
      },
      isFilterValid: (filter, tags) => {
        if (!Valid.isAgeFilterValid(filter) || !Valid.isRatingFilterValid(filter) || 
        !Valid.isLocationFilterValid(filter) || !Valid.isKeywordFilterValid(filter))
          return 'Error Filtering Results!!'
        if (!Valid.isFilterTags(tags))
          return errorTab['tags']
        return 'success'
      },
      isLatitude: (latitude) => {
        if(latitude >= -90 && latitude <= 90 && (util.isNumeric(latitude) || util.isFloat(latitude)))
            return true
        return false
      },
      isLongitude: (longitude) => {
        if(longitude >= -180 && longitude <= 180 && (util.isNumeric(longitude) || util.isFloat(longitude)))
            return true
        return false
      },
      isPictureName: (name) => {
        let ext = name.split('.')[1];
        if (/jpeg|jpg|png|gif/.test(ext.toLowerCase()))
          return true
        return false
      },
      isProfileCompleted: (user) => {
        return !util.isEmpty(user.username) &&
          !util.isEmpty(user.firstName) &&
          !util.isEmpty(user.lastName) &&
          !util.isEmpty(user.email) &&
          !util.isEmpty(user.gender) &&
          !util.isEmpty(user.preference) &&
          !util.isEmpty(user.biography) &&
          !util.isEmpty(user.latitude) &&
          !util.isEmpty(user.longitude) &&
          !util.isEmpty(user.profilePic) &&
          !util.isEmpty(user.born_date) &&
          !util.isEmpty(user.tags)
      },
      isMsg: (msg) => {
        if((msg.length > 200) || msg.length < 2)
            return false
        return true
      },
}

module.exports = Valid;