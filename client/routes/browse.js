var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')

/* GET home page. */
router.get('/browse', (req, res) => {
    let err = req.flash('error');
    let error = {};
    if (JSON.stringify(err) === '[]') 
      error = undefined;
    else
      error.error = err;
    //res.render('test');
    res.render('browse', {error});
  });

module.exports = router;