var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const upload = require('../middleware/uploadImg');

/* GET Welcome Page */
router.get('/welcome', function(req, res) {
  //axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.headers.cookie;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
  console.log(chalk.yellow(JSON.stringify(axios.defaults.headers)));
  axios.get(`${process.env.HostApi}/welcome`)
    .then((response) => {
      console.log(chalk.greenBright(JSON.stringify(response)));
        return res.send(response);   
    }
    ).catch((e) => {
      //console.log(chalk.redBright('error1 ' + JSON.stringify(e.response.data)));
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
            console.log(error.response.data);
            return;
        }
      }      
    });
});


router.post('/editProfile', (req, res) => {
 // console.log(chalk.blue(JSON.stringify(req.file)));
 // console.log(chalk.blue(JSON.stringify(req.fileError)));
  res.render('editProfile', { error: req.flash('error'), successMessage: req.flash('successMessage') });
  console.log(chalk.green(JSON.stringify(req.body)));
  // upload(req, res, (err) => {
  //   if(err){
  //     res.render('editProfile', {
  //       error: {error: err}
  //     });
  //   } else {
  //     if(req.file == undefined){
  //       res.render('editProfile', {
  //         error: {error:'Error: No File Selected!'}
  //       });
  //     } else {
  //       res.render('editProfile', {
  //         success: {successMessage: 'File Uploaded!'},
  //         file: `/uploads/${req.file.filename}`
  //       });
  //     }
  //   }
  // });
  // console.log(chalk.blue(JSON.stringify(req.body)))
  // let userInfos = req.body
  // axios.post(`${process.env.HostApi}/profile/editBasic`, userInfos)
  //   .then((response) => {
  //       return res.render('editProfile', {success: response.data});     
  //   }
  //   ).catch((e) => {
  //     if(typeof e.response !== 'undefined') {
  //       if(e.response.status === 400) {
  //           const error = e.response.data.errorMessage;
  //           return res.render('editProfile', {error});
  //       }
  //     }      
  //   });
   
})

router.post('/uploadProfile', (req, res) => {
  // console.log(chalk.blue(JSON.stringify(req.file)));
   //console.log(chalk.green(JSON.stringify(req.body)));
   upload(req, res, (err) => {
     if(err){
       console.log(chalk.red(err));
       req.flash('error', 'Images Allowed (jpg, jpeg, png, gif), size: less than 10MB');
       res.redirect('/profile/editProfile');
      //  res.render('editProfile', {
      //    error: {error: 'Images Allowed (jpg, jpeg, png, gif), size: less than 10MB'}
      //  });
     } else {
       if(req.file == undefined){
          req.flash('error', 'Please Select An Image To Upload!');
          res.redirect('/profile/editProfile');
        //  res.render('editProfile', {
        //    error: {error:'Please Select An Image To Upload!'}
        //  });
       } else {
        console.log(chalk.green(JSON.stringify(req.file)));
        req.flash('successMessage', 'Your Profile Image Is Updated Successfully!');
        res.redirect('/profile/editProfile');
        //  res.render('editProfile', {
        //    success: {successMessage: 'Your Profile Image Is Updated Successfully!'},
        //    file: `/uploads/${req.file.filename}`
        //  });
       }
     }
   });
   // console.log(chalk.blue(JSON.stringify(req.body)))
   // let userInfos = req.body
   // axios.post(`${process.env.HostApi}/profile/editBasic`, userInfos)
   //   .then((response) => {
   //       return res.render('editProfile', {success: response.data});     
   //   }
   //   ).catch((e) => {
   //     if(typeof e.response !== 'undefined') {
   //       if(e.response.status === 400) {
   //           const error = e.response.data.errorMessage;
   //           return res.render('editProfile', {error});
   //       }
   //     }      
   //   });
    
 })

/* GET edit profile page. */
router.get('/editProfile', (req, res) => {
  let error = req.flash('error');
  let successMessage = req.flash('successMessage');
  if (JSON.stringify(error) === '[]') error = undefined;
  if (JSON.stringify(successMessage) === '[]') successMessage = undefined;
  res.render('editProfile', { success: {successMessage},
      error: {error} });
});

module.exports = router;
