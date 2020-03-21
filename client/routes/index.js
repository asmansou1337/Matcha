var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('test');
  //res.render('index', { title: 'Express' });
});

/* GET SignUp page. */
router.get('/signup', (req, res) => {
  res.render('signup', {error: undefined, success: undefined});
});

/* POST SignUp page. */
router.post('/signup', async (req, res) => {
  let signupform = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
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
      } else if (e.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(e.request);
      } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', e.message);
      }       
    });
});

/* GET Activation page. */
router.get('/activateAccount', async (req, res) => {
  const token = req.query.token;
  if(typeof token !== 'undefined' && token.match(/^[0-9a-zA-Z]+$/)){ 
    axios.get(`${process.env.HostApi}/activateAccount?token=${token}`)
      .then((response) => {
        //console.log(chalk.yellow(JSON.stringify(response.data)));
        //return;
        return res.render('signup', {success: response.data});     
      })
      .catch((e) => {
        if(typeof e.response !== 'undefined') {
          //console.log(chalk.yellow(JSON.stringify(e.response.data)));
          //console.log(chalk.yellow(JSON.stringify(e.response.headers)));
          if(e.response.status === 400) {
              const error = e.response.data.errorMessage;
              //console.log(chalk.green(JSON.stringify(error)));
              //   //console.log(chalk.blue(error));
              return res.render('signup', {error});
          }
        } 
      });
  } else {
    const error = {error: "Unvalid link, Please Try Again!"};
    return res.render('signup', {error});
  }
  //token.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  //res.render('signup', {error: undefined, success: undefined});
});

/* GET Login page. */
router.get('/login', (req, res) => {
  res.render('login');
});

/* POST Login page. */
router.post('/login', async (req, res) => {
  let loginform = {
    username: req.body.username,
    password: req.body.password,
  }
  axios.post(`${process.env.HostApi}/login`, loginform)
    .then((response) => {
        // Add JWT token in a cookie
        console.log(chalk.grey(JSON.stringify(response.data)))
        console.log(chalk.green(JSON.stringify(response.headers)))
        const cookieOptions = {
          //expires: new Date(Date.now() + '15m'),
          secure: false, // set to true if your using https
          httpOnly: true,
          //expires: 0 
         }
        res.cookie('jwt', response.data.authToken, cookieOptions)
        // res.cookie('user', JSON.stringify(response.data.user), cookieOptions)
        // res.cookie('currentUser', response.data.user.username) //// added march 12
        return res.render('login', {success: response.data});     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('login', {error});
        }
      } else if (e.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(e.request);
      } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', e.message);
      }       
    });
});

/* GET Reset Email page. */
router.get('/resetEmail', (req, res) => {
  res.render('resetEmail');
});

/* POST Reset Email page. */
router.post('/resetEmail', (req, res) => {
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
router.get('/reinitializePassword', (req, res) => {
  res.render('resetPassword', {token: req.query.token});
});

/* POST Reset Password page. */
router.post('/reinitializePassword', (req, res) => {
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

module.exports = router;
