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


router.post('/profile/editBasic', checkAuth, profile.editBasic);
router.post('/profile/updatePassword', checkAuth, profile.updatePassword);
router.post('/profile/updateProfilePic', checkAuth, profile.updateProfilePic);
router.get('/profile/getInfos', checkAuth, profile.getCurrentUserAllInfos);
router.get('/profile/getProfilePic', checkAuth, profile.getCurrentUserProfilePic);
router.post('/profile/addNewPic', checkAuth, profile.addNewPic);
router.post('/profile/deletePic', checkAuth, profile.deletePic);
router.get('/profile/picturesCount', checkAuth, profile.getCurrentUserPicturesCount);
router.post('/profile/updateTags', checkAuth, profile.updateTags);
router.get('/tagsList', checkAuth, profile.getTagsList);
module.exports = router;