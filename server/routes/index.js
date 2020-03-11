var express = require('express');
var router = express.Router();

// List of routes
const authentification = require('../controllers/authentificationController');

router.post('/signup', authentification.signup);
router.get('/activateAccount/:token', authentification.activateAccount);
router.post('/login', authentification.login);
// router.post('/sendResetEmail', authentification);
// router.post('/resetPassword', authentification);

module.exports = router;