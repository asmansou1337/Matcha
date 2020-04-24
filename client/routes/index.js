var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader');
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions');

/* GET home page. */
router.get('/', headerAuth.connectedHeader, isComplete, (req, res) => {
  let err = req.flash('error');
  let error = {};
  if (JSON.stringify(err) === '[]') 
    error = undefined;
  else
    error.error = err;
  // get history of likes and visits
  axios.get(`${process.env.HostApi}/history`)
    .then((response) => {
      // console.log(chalk.green(JSON.stringify(response.data)))
      return res.render('index', {likersUsers: response.data.likersUsers,likedUsers: response.data.likedUsers, 
        visitorsUsers: response.data.visitorsUsers});     
    })
    .catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('index', {error});
        }
      } 
    });
});

/* GET SignUp page. */
router.get('/signup', headerAuth.nonConnected, (req, res) => {
  res.render('signup');
});

/* POST SignUp page. */
router.post('/signup', headerAuth.nonConnected, async (req, res) => {
  let signupform = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
   // locate the user automatically
   await axios.get(`http://ip-api.com/json`)
   .then((response) => {
     signupform.longitude = response.data.lon;
     signupform.latitude = response.data.lat;  
   })
  axios.post(`${process.env.HostApi}/signup`, signupform)
    .then((response) => {
        return res.render('signup', {success: response.data});     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('signup', {error});
        }
      }      
    });
});

/* GET Activation page. */
router.get('/activateAccount', headerAuth.nonConnected, async (req, res) => {
  const token = req.query.token;
  if(typeof token !== 'undefined' && token.match(/^[0-9a-zA-Z]+$/)){ 
    axios.get(`${process.env.HostApi}/activateAccount?token=${token}`)
      .then((response) => {
        return res.render('signup', {success: response.data});     
      })
      .catch((e) => {
        if(typeof e.response !== 'undefined') {
          if(e.response.status === 400) {
              const error = e.response.data.errorMessage;
              return res.render('signup', {error});
          }
        } 
      });
  } else {
    const error = {error: "Unvalid link, Please Try Again!"};
    return res.render('signup', {error});
  }
});

/* GET Login page. */
router.get('/login', headerAuth.nonConnected, (req, res) => {
  let err = req.flash('error');
  let error = {}
  if (JSON.stringify(err) === '[]') 
    error = undefined;
  else
    error.error = err;
  res.render('login', {error});
});

/* POST Login page. */
router.post('/login', headerAuth.nonConnected, async (req, res) => {
  let loginform = {
    username: req.body.username,
    password: req.body.password,
  }
  axios.post(`${process.env.HostApi}/login`, loginform)
    .then((response) => {
        // Add JWT token in a cookie
        // expires in 4 hours
        const cookieOptions = {
          secure: false, // set to true if your using https
          httpOnly: true,
          maxAge: 14400
         }
        res.cookie('jwt', response.data.authToken, cookieOptions)
        return res.redirect('/');     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('login', {error});
        }
      }    
    });
});

/* GET Reset Email page. */
router.get('/resetEmail', headerAuth.nonConnected, (req, res) => {
  res.render('resetEmail');
});

/* POST Reset Email page. */
router.post('/resetEmail', headerAuth.nonConnected, (req, res) => {
  let resetEmail = {
    email: req.body.email,
  }
  axios.post(`${process.env.HostApi}/sendResetEmail`, resetEmail)
    .then((response) => {
        return res.render('resetEmail', {success: response.data});     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('resetEmail', {error});
        }
      }      
    });
});

/* GET Reset Password page. */
router.get('/reinitializePassword', headerAuth.nonConnected, (req, res) => {
  res.render('resetPassword', {token: req.query.token});
});

/* POST Reset Password page. */
router.post('/reinitializePassword', headerAuth.nonConnected, (req, res) => {
  let resetPass = {
    token: req.body.token,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
 // console.log(chalk.yellow(token));
  if(typeof resetPass.token !== 'undefined' && resetPass.token.match(/^[0-9a-zA-Z]+$/)){ 
     console.log(chalk.yellow(resetPass.token));
    axios.post(`${process.env.HostApi}/reinitializePassword?token=${resetPass.token}`, resetPass)
    .then((response) => {
        return res.render('resetPassword', {success: response.data, token: resetPass.token});     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('resetPassword', {error, token: resetPass.token});
        }
      }      
    });
  } else {
    const error = {error: "Unvalid link, Please Try Again!"};
    return res.render('resetPassword', {error, token: ''});
  }
});

/* GET Logout page. */
router.get('/logout', headerAuth.connectedHeader, (req, res) => {
  axios.get(`${process.env.HostApi}/logout`)
  .then((response) => {
    console.log(chalk.green(response.data.successMessage))
    res.clearCookie("jwt");
    res.redirect("/login")
  }
  ).catch((e) => {
    handle.errorHandle(e, req, res) 
  }
  );
});

module.exports = router;
