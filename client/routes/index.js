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

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET Reset Email page. */
router.get('/resetEmail', function(req, res, next) {
  res.render('resetEmail');
});

module.exports = router;
