var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader');
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions');

/* GET home page. */
router.get('/chat', headerAuth.connectedHeader, isComplete, (req, res) => {
    // let err = req.flash('error');
    // let error = {};
    // if (JSON.stringify(err) === '[]') 
    //   error = undefined;
    // else
    //   error.error = err;
    //res.render('test');
    res.render('chat');
  });


  module.exports = router;