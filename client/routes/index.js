var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET SignUp page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
