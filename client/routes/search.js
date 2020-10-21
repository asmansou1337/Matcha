var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


/* GET Search page. */
router.get('/search',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.get(`${process.env.HostApi}/search`)
    .then((respo) => {
        res.render('search', {users: respo.data.searchList, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('search', {error: {error: e.response.data.errorMessage.error, isAdmin: req.isAdmin, token: req.cookies.jwt}});
        }
      }    
    })
  });

/* Filter Search page. */
router.post('/search',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.post(`${process.env.HostApi}/search`, req.body)
    .then((respo) => {
        res.render('search', {users: respo.data.searchList, filter: respo.data.filter ,error: respo.data.errorMessage, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('search', {error: {error: e.response.data.errorMessage.error, isAdmin: req.isAdmin, token: req.cookies.jwt}});
        }
      }    
    })
  });

module.exports = router;