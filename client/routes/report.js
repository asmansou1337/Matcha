var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const fs = require("fs");
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


/* GET reported users page. */
router.get('/reported',  headerAuth.connectedHeader, isComplete, (req, res) => {
  let successMessage = req.flash("success");
  let success = {};

  if (JSON.stringify(successMessage) === "[]") success = undefined;
  else success.successMessage = successMessage;
  
    axios.get(`${process.env.HostApi}/reportedUsers`)
    .then((respo) => {
        res.render('report', {success, users: respo.data.reportedUsers, isAdmin: req.isAdmin, token: req.cookies.jwt});
    })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/");
        }
      }    
    })
  });

/* Delete user profile page. */
router.post('/deleteProfile',  headerAuth.connectedHeader, isComplete, (req, res) => {
  
  let profilePic = req.body.profilePic

  // Delete User from DB
    axios.post(`${process.env.HostApi}/deleteProfile`, req.body)
    .then((respo) => {
      // Delete profile image from uploads folder
        if (profilePic !== undefined && profilePic !== null && !handle.isEmpty(profilePic)) 
          if (fs.existsSync(process.cwd() + "/public/uploads/" + profilePic))
            fs.unlinkSync(process.cwd() + "/public/uploads/" + profilePic);
        req.flash("success", respo.data.successMessage);
        res.redirect("/reported");
        })
    .catch((e) => {
      handle.authError(e, req, res);
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          req.flash("error", e.response.data.errorMessage.error);
          res.redirect("/");
        }
      }    
    })
  });

module.exports = router;