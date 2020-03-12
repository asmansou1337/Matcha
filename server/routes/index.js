var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');

// List of routes
const authentification = require('../controllers/authentificationController');

router.post('/signup', authentification.signup);
router.get('/activateAccount/:token', authentification.activateAccount);
router.post('/login', authentification.login);
router.post('/sendResetEmail', authentification.sendResetEmail);
router.post('/reinitializePassword/:token', authentification.reinitializePassword);

module.exports = router;