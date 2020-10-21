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
        // get user notifications list
        res.render('notifications', {notifications: respo.data.notification,isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          let error = {error: e.response.data.errorMessage.error}
          res.render('notifications', {error,isAdmin: req.isAdmin, token: req.cookies.jwt});
        }
      }    
    })
  });

module.exports = router;