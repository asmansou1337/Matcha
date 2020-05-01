var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader');
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions');
const users = [];

// Join user to chat
function userJoin(id, to, from, matchedUsername, username, convId) {
  const user = { id, to, from, matchedUsername, username, convId };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function formatMessage(username, msg) {
  return {
    username,
    msg,
    //time: moment().format('h:mm a')
  };
}

/* GET chat page. */
router.get('/chat', headerAuth.connectedHeader, isComplete, (req, res) => {
  let messages, error;
  // console.log(chalk.yellow(JSON.stringify(req.query)))
  axios.get(`${process.env.HostApi}/chat`)
  .then((respo) => {
     if (typeof req.query.to !== 'undefined' && typeof req.query.from !== 'undefined' && typeof req.query.convId !== 'undefined') {
      axios.get(`${process.env.HostApi}/getMessages?to=${req.query.to}&from=${req.query.from}&convId=${req.query.convId}`)
      .then((response) => {
        messages = response.data.messages;
        res.render('chat', {mutualUsers: respo.data.mutualUsers, messages, error});
      }).catch((e) => {
        handle.authError(e, req, res);
        if(typeof e.response !== 'undefined') {
          if(e.response.status === 400) {
            console.log(chalk.red(e.response.data.errorMessage.error))
            let error = {error: e.response.data.errorMessage.error};
            res.render('chat', {mutualUsers: respo.data.mutualUsers, error});
          }
        }    
      })
     } else {
        res.render('chat', {mutualUsers: respo.data.mutualUsers});
     }
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        console.log(chalk.red(e.response.data.errorMessage.error))
        let error = {error: e.response.data.errorMessage.error};
        res.render('chat', {error});
      }
    }    
  })
  });


  module.exports = router;