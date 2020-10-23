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
          let error = e.response.data.errorMessage
          res.render('search', {error, isAdmin: req.isAdmin, token: req.cookies.jwt});
        }
      }    
    })
  });

/* Filter Search page. */
router.post('/search',  headerAuth.connectedHeader, isComplete, (req, res) => {
  try {
    if (Array.isArray(JSON.parse(req.body.TagsTab))) {
      axios.post(`${process.env.HostApi}/search`, req.body)
      .then((respo) => {
          res.render('search', {users: respo.data.searchList, filter: respo.data.filter ,error: respo.data.errorMessage, isAdmin: req.isAdmin, token: req.cookies.jwt});
      })
      .catch((e) => {
        handle.authError(e, req, res);
        if(typeof e.response !== 'undefined') {
          if(e.response.status === 400) {
            // console.log(chalk.red(JSON.stringify(e.response.data)))
            let error = e.response.data.errorMessage
            res.render('search', {error, filter: e.response.data.filter, isAdmin: req.isAdmin, token: req.cookies.jwt});
          }
        }    
      })
    } else {
      let error = {error: 'Invalid Tags'}
      res.render('search', {error, isAdmin: req.isAdmin, token: req.cookies.jwt});
    }
  } catch(e) {
    let error = {error: 'Invalid Tags'}
    res.render('search', {error, isAdmin: req.isAdmin, token: req.cookies.jwt});
  }
  });

module.exports = router;