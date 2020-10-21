var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


/* GET reported users page. */
router.get('/reported',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.get(`${process.env.HostApi}/reportedUsers`)
    .then((respo) => {
      console.log(chalk.green(JSON.stringify(respo.data)))
        res.render('report', {users: respo.data.reportedUsers, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          let error = {error: e.response.data.errorMessage.error}
          res.render('report', {error , isAdmin: req.isAdmin, token: req.cookies.jwt});
        }
      }    
    })
  });

/* Filter browsing page. */
router.post('/deleteProfile',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.post(`${process.env.HostApi}/deleteProfile`, req.body)
    .then((respo) => {
        res.redirect("/reported");
        // res.render('report', {users: respo.data.browseList, filter: respo.data.filter ,error: respo.data.errorMessage, tags: respo.data.userTags, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.redirect("/reported");
          // res.render('report', {error: {error: e.response.data.errorMessage.error, isAdmin: req.isAdmin, token: req.cookies.jwt}});
        }
      }    
    })
  });

module.exports = router;