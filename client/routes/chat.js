var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader');
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions');

/* GET chat page. */
router.get('/chat', headerAuth.connectedHeader, isComplete, (req, res) => {
  let messages, error;
  // console.log(chalk.yellow(JSON.stringify(req.query)))
  axios.get(`${process.env.HostApi}/chat`)
  .then((respo) => {
     if (typeof req.query.to !== 'undefined' && typeof req.query.convId !== 'undefined') {
      axios.get(`${process.env.HostApi}/getMessages?to=${req.query.to}&convId=${req.query.convId}`)
      .then((response) => {
        messages = response.data.messages;
        res.render('chat', {mutualUsers: respo.data.mutualUsers, messages, error, activeConv: {active: req.query.convId}, token: req.cookies.jwt});
      }).catch((e) => {
        handle.authError(e, req, res);
        if(typeof e.response !== 'undefined') {
          if(e.response.status === 400) {
            // console.log(chalk.red(e.response.data.errorMessage.error))
            let error = {error: e.response.data.errorMessage.error};
            res.render('chat', {mutualUsers: respo.data.mutualUsers, error, token: req.cookies.jwt});
          }
        }    
      })
     } else {
        res.render('chat', {mutualUsers: respo.data.mutualUsers, token: req.cookies.jwt});
     }
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        // console.log(chalk.red(e.response.data.errorMessage.error))
        let error = {error: e.response.data.errorMessage.error};
        res.render('chat', {error, token: req.cookies.jwt});
      }
    }    
  })
  });


  module.exports = router;