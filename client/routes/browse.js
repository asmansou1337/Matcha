var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


/* GET browsing page. */
router.get('/browse',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.get(`${process.env.HostApi}/browse`)
    .then((respo) => {
        res.render('browse', {users: respo.data.browseList, tags: respo.data.userTags, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('browse', {error: {error: e.response.data.errorMessage.error, isAdmin: req.isAdmin, token: req.cookies.jwt}});
        }
      }    
    })
  });

/* Filter browsing page. */
router.post('/browse',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.post(`${process.env.HostApi}/browse`, req.body)
    .then((respo) => {
        res.render('browse', {users: respo.data.browseList, filter: respo.data.filter ,error: respo.data.errorMessage, tags: respo.data.userTags, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('browse', {error: {error: e.response.data.errorMessage.error, isAdmin: req.isAdmin, token: req.cookies.jwt}});
        }
      }    
    })
  });

module.exports = router;