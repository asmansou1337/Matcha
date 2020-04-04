var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const upload = require('../middleware/uploadImg');
const fs = require('fs');
const multer = require('multer');
const iplocate = require("node-iplocate");
const publicIp = require('public-ip');
 const headerAuth = require('../middleware/authHeader')
 const handle = require('../middleware/functions')

/* GET Welcome Page */
// router.get('/welcome', function(req, res) {
//   //axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.headers.cookie;
//   axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
//   console.log(chalk.yellow(JSON.stringify(axios.defaults.headers)));
//   axios.get(`${process.env.HostApi}/welcome`)
//     .then((response) => {
//       console.log(chalk.greenBright(JSON.stringify(response)));
//         return res.send(response);   
//     }
//     ).catch((e) => {
//       //console.log(chalk.redBright('error1 ' + JSON.stringify(e.response.data)));
//       if(typeof e.response !== 'undefined') {
//         if(e.response.status === 400) {
//             console.log(error.response.data);
//             return;
//         }
//       }      
//     });
// });

// preview connected user profile
router.get('/myProfile', headerAuth.connectedHeader, (req,res) => {
  // get user infos
  axios.get(`${process.env.HostApi}/profile/getInfos`)
    .then((response) => {
        //console.log(chalk.greenBright(JSON.stringify(response.data.user)));
        user = response.data.user;
        console.log(chalk.greenBright(JSON.stringify(user)));
        return res.render('myProfile', {userInfos: user});
    }
    ).catch((e) => {
      handle.errorHandle(e, req, res)     
    });
})

// edit basic infos form POST
router.post('/editProfile', headerAuth.connectedHeader, (req, res) => {
  let userInfos = req.body
  let user = undefined
  let success = undefined
  let error = undefined
  axios.post(`${process.env.HostApi}/profile/editBasic`, userInfos)
    .then((response) => {
        success = response.data
      //  return res.render('editProfile', {success: response.data});     
    }
    ).catch((e) => {
      handle.errorHandle(e, req, res)       
    });
    axios.get(`${process.env.HostApi}/profile/getInfos`)
        .then((resp) => {
            //console.log(chalk.greenBright(JSON.stringify(response.data.user)));
            user = resp.data.user;
            console.log(chalk.greenBright(JSON.stringify(user)));
            res.render('editProfile', { success, error, userInfos: user, nav: {path: 'basic'} });
        }
        ).catch((e) => {
          handle.errorHandle(e, req, res)      
        });
})

// Update password
router.post('/updatePassword', headerAuth.connectedHeader, (req, res) => {
  console.log(JSON.stringify(req.body));
  axios.post(`${process.env.HostApi}/profile/updatePassword`, req.body)
  .then((response) => {
    req.flash('path', 'password');
    console.log(chalk.blue(response.data.successMessage)); 
    req.flash('successMessage', response.data.successMessage);
    res.redirect('/profile/editProfile'); 
  }
  ).catch((e) => {
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        res.render('editProfile', {error:e.response.data.errorMessage, nav: {path:'password'}});
      }
      handle.authError(e)
    }      
  });
})

// Upload profile picture form
router.post('/uploadProfile', headerAuth.connectedHeader, (req, res) => {
    req.flash('path', 'picture');
    let oldProfilePic = '';
    // Get The old profile picture name if exists
    axios.get(`${process.env.HostApi}/profile/getProfilePic`)
        .then((resp) => {
            console.log(chalk.magenta(JSON.stringify(resp.data.user.profilePic)));
            oldProfilePic = resp.data.user.profilePic;
        }).catch((e) => {
          handle.authError(e)
        })
        
    // upload new picture
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(chalk.red(err));
        req.flash('error', 'Images Allowed (jpg, jpeg, png, gif), size: less than 10MB');
        res.redirect('/profile/editProfile');
      } else if(err){
        console.log(chalk.red(err));
        req.flash('error', err);
        res.redirect('/profile/editProfile');
      } else {
        if(req.file == undefined){
            req.flash('error', 'Please Select An Image To Upload!');
            res.redirect('/profile/editProfile');
        } else {
          // Update the image name on the backend
          let pic = {
            name: req.file.filename,
          }
          //console.log(chalk.green(JSON.stringify(req.file)));
          axios.post(`${process.env.HostApi}/profile/updateProfilePic`, pic)
          .then((response) => {
            // delete old picture first before redirecting
            if (oldProfilePic != '' && oldProfilePic != null)
              fs.unlinkSync(process.cwd() + '/public/uploads/' + oldProfilePic);
            req.flash('successMessage', response.data.successMessage);
            res.redirect('/profile/editProfile');    
          }
          ).catch((e) => {
            if(typeof e.response !== 'undefined') {
              if(e.response.status === 400) {
                req.flash('error', e.response.data.errorMessage.error);
                res.redirect('/profile/editProfile');
              }
              handle.authError(e)
            }      
          });
        }
      }
    });
 })

// Delete profile picture form
 router.post('/deleteProfile', headerAuth.connectedHeader, (req, res) => {
    req.flash('path', 'picture');
    axios.get(`${process.env.HostApi}/profile/getProfilePic`)
    .then((resp) => {
          console.log(chalk.magenta(JSON.stringify(resp.data.user.profilePic)));
          if (resp.data.user.profilePic != '' && resp.data.user.profilePic != null)
              fs.unlinkSync(process.cwd() + '/public/uploads/' + resp.data.user.profilePic);
              // Update the image name on the backend
              let pic = {
                name: null,
              }
              //console.log(chalk.green(JSON.stringify(req.file)));
              axios.post(`${process.env.HostApi}/profile/updateProfilePic`, pic)
              .then((response) => {
                console.log(chalk.blue(response.data.successMessage));  
              }
              ).catch((e) => {
                if(typeof e.response !== 'undefined') {
                  if(e.response.status === 400) {
                    req.flash('error', e.response.data.errorMessage.error);
                    res.redirect('/profile/editProfile');
                  }
                }  
                handle.authError(e, req, res)    
              });
              req.flash('successMessage', 'Your profile picture is deleted successfully.');
              res.redirect('/profile/editProfile');
    }
    ).catch((e) => {
     handle.errorHandle(e, req, res)    
    });
})

// Upload other picture form (max 4)
router.post('/uploadPicture', headerAuth.connectedHeader, (req, res) => {
  req.flash('path', 'picture');
  axios.get(`${process.env.HostApi}/profile/picturesCount`)
    .then((resp) => {
       console.log(chalk.yellow(JSON.stringify(resp.data)))
       // upload new picture
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          console.log(chalk.red(err));
          req.flash('error', 'Images Allowed (jpg, jpeg, png, gif), size: less than 10MB');
          res.redirect('/profile/editProfile');
        } else if(err){
          console.log(chalk.red(err));
          req.flash('error', err);
          res.redirect('/profile/editProfile');
        } else {
          if(req.file == undefined){
              req.flash('error', 'Please Select An Image To Upload!');
              res.redirect('/profile/editProfile');
          } else {
            // Update the image name on the backend
            let pic = {
              name: req.file.filename,
            }
            console.log(chalk.green(JSON.stringify(req.file)));
            axios.post(`${process.env.HostApi}/profile/addNewPic`, pic)
            .then((response) => {
              req.flash('successMessage', response.data.successMessage);
              res.redirect('/profile/editProfile');    
            }
            ).catch((e) => {
              if(typeof e.response !== 'undefined') {
                if(e.response.status === 400) {
                  req.flash('error', e.response.data.errorMessage.error);
                  res.redirect('/profile/editProfile');
                }
              }
              handle.authError(e, req, res)      
            });
          }
        }
      });
  }).catch((e) => {
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/profile/editProfile');
      }
    }
    handle.authError(e, req, res)      
  });
})

// Delete profile picture form
router.post('/deletePicture', headerAuth.connectedHeader, (req, res) => {
  req.flash('path', 'picture');
  let img = req.body.img
  //console.log(chalk.magenta(JSON.stringify(req.body)));
  if (fs.existsSync(process.cwd() + '/public/uploads/' + img)) {
    fs.unlinkSync(process.cwd() + '/public/uploads/' + img);
     // Remove the image name on the backend
     let pic = {
      name: img,
    }
    //console.log(chalk.green(JSON.stringify(req.file)));
    axios.post(`${process.env.HostApi}/profile/deletePic`, pic)
    .then((response) => {
      console.log(chalk.blue(response.data.successMessage)); 
      req.flash('successMessage', response.data.successMessage);
      res.redirect('/profile/editProfile'); 
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          req.flash('error', e.response.data.errorMessage.error);
          res.redirect('/profile/editProfile');
        }
      }  
      handle.authError(e, req, res)    
    });
  } else {
    req.flash('error', 'This image does not exists!!');
    res.redirect('/profile/editProfile');
  }
})

// edit tags infos form POST
router.post('/addTags', headerAuth.connectedHeader, (req, res) => {
  req.flash('path', 'tag');
  console.log(chalk.yellow(req.body.TagsTab));
  let userTags = JSON.parse(req.body.TagsTab);
  axios.post(`${process.env.HostApi}/profile/updateTags`, userTags)
    .then((response) => {
      req.flash('successMessage', response.data.successMessage);
      res.redirect('/profile/editProfile');    
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          req.flash('error', e.response.data.errorMessage.error);
          res.redirect('/profile/editProfile');
        }
      }   
      handle.authError(e, req, res)   
    }); 
})


/* GET edit profile page. */
router.get('/editProfile', headerAuth.connectedHeader, (req, res) => {
  // getting success/error messages from redirect
  let path = req.flash('path');
  let err = req.flash('error');
  let successMessage = req.flash('successMessage');
  let error = {}, success = {}, user = undefined;
  let tagsList = [];

  if (JSON.stringify(err) === '[]') 
    error = undefined;
  else
    error.error = err;
  if (JSON.stringify(successMessage) === '[]') 
    success = undefined;
  else
    success.successMessage = successMessage;
  if (JSON.stringify(path) === '[]')
    path = 'basic';
  
  // get user infos
  axios.get(`${process.env.HostApi}/profile/getInfos`)
    .then((response) => {
        user = response.data.user;
        //  console.log(chalk.greenBright(JSON.stringify(user)));
        res.render('editProfile', { success, error, userInfos: user , nav: {path}, tagsList});
    }
    ).catch((e) => {
      handle.errorHandle(e, req, res)     
    });
});



// Update user location
router.post('/updateLocation', headerAuth.connectedHeader, async (req, res) => {
  req.flash('path', 'location');
  let userCoor = {latitude: req.body.latitude, longitude: req.body.longitude}
  if (handle.isEmpty(userCoor.latitude) || handle.isEmpty(userCoor.longitude)) {
    // locate the user automatically
    await axios.get(`http://ip-api.com/json`)
    .then((response) => {
      //console.log(chalk.cyan(JSON.stringify(response.data)));
      userCoor.longitude = response.data.lon;
      userCoor.latitude = response.data.lat;  
    })
  }
  //console.log(chalk.magenta(JSON.stringify(userCoor)));
  // update user location on the backend
  axios.post(`${process.env.HostApi}/profile/updateLocation`, userCoor)
    .then((response) => {
      req.flash('successMessage', response.data.successMessage);
      res.redirect('/profile/editProfile');    
    }
    ).catch((e) => {
      if(typeof e.response !== 'undefined') {
        if(e.response.status === 400) {
          req.flash('error', e.response.data.errorMessage.error);
          res.redirect('/profile/editProfile');
        }
      } 
      handle.authError(e, req, res)     
    });
})



module.exports = router;
