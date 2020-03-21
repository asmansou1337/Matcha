var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');

/* GET Welcome Page */
router.get('/welcome', function(req, res) {
  //axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.headers.cookie;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
  console.log(chalk.yellow(JSON.stringify(axios.defaults.headers)));
  axios.get(`${process.env.HostApi}/welcome`)
    .then((response) => {
      console.log(chalk.greenBright(JSON.stringify(response)));
        return res.send(response);   
    }
    ).catch((e) => {
      //console.log(chalk.redBright('error1 ' + JSON.stringify(e.response.data)));
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            console.log(error.response.data);
            return;
        }
      }      
    });
});

router.post('/editBasic', (req, res) => {
  console.log(chalk.blue(JSON.stringify(req.body)))
  let userInfos = req.body
  axios.post(`${process.env.HostApi}/profile/editBasic`, userInfos)
    .then((response) => {
        return res.render('editProfile', {success: response.data});     
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            const error = e.response.data.errorMessage;
            return res.render('editProfile', {error});
        }
      }      
    });
  //return res.redirect('/editProfile');   
})

/* GET edit profile page. */
router.get('/editProfile', (req, res) => {
  res.render('editProfile');
});

module.exports = router;
