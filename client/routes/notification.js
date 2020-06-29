var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')

/* GET notifications page. */
router.get('/notification',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.get(`${process.env.HostApi}/notifications`)
    .then((respo) => {
        // get user infos
        console.log(chalk.red(JSON.stringify(respo.data)))
        // console.log(chalk.blue(JSON.stringify(respo.data.browseList)))
        res.render('notifications', {notifications: respo.data.notification, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('browse', {error: {error: e.response.data.errorMessage.error, token: req.cookies.jwt}});
        }
      }    
    })
  });

module.exports = router;