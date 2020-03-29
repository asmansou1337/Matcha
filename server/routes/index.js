var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');

// List of routes
const authentification = require('../controllers/authentificationController');
const profile = require('../controllers/profileController');

router.post('/signup', authentification.signup);
router.get('/activateAccount', authentification.activateAccount);
router.post('/login', authentification.login);
router.post('/sendResetEmail', authentification.sendResetEmail);
router.post('/reinitializePassword', authentification.reinitializePassword);
router.get('/welcome', checkAuth, authentification.welcome);


router.post('/profile/editBasic', profile.editBasic);
router.post('/profile/updateProfilePic', profile.updateProfilePic);
router.get('/profile/getInfos', profile.getCurrentUserAllInfos);
router.get('/profile/getProfilePic', profile.getCurrentUserProfilePic);
router.post('/profile/addNewPic', profile.addNewPic);
router.post('/profile/deletePic', profile.deletePic);
router.get('/profile/picturesCount', profile.getCurrentUserPicturesCount);
router.post('/profile/updateTags', profile.updateTags);
module.exports = router;