var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


/* GET home page. */
router.get('/search',  headerAuth.connectedHeader, isComplete, (req, res) => {
    axios.get(`${process.env.HostApi}/search`)
    .then((respo) => {
        // get user infos
        res.render('search', {users: respo.data.searchList});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('search', {error: {error: e.response.data.errorMessage.error}});
        }
      }    
    })
  });

/* GET home page. */
router.post('/search',  headerAuth.connectedHeader, isComplete, (req, res) => {
    // console.log(chalk.yellow(JSON.stringify(req.body)))
    axios.post(`${process.env.HostApi}/search`, req.body)
    .then((respo) => {
        // console.log(chalk.green(JSON.stringify(respo.data)));
        // console.log(chalk.blue(JSON.stringify(error)));
        // get user infos
        res.render('search', {users: respo.data.searchList, filter: respo.data.filter ,error: respo.data.errorMessage});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          res.render('search', {error: {error: e.response.data.errorMessage.error}});
        }
      }    
    })
  });

module.exports = router;