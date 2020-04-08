var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const handle = require('../middleware/functions')
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: 'AIzaSyBg-g_Rb35tPbOZf4MVrXSpNP08hrVmhO0',
  formatter: 'json'
};
var geocoder = NodeGeocoder(options);

// axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
// .then((resp) => {
  
// })
// .catch((e) => {
//   handle.authError(e, req, res);
//   if(typeof e.response !== 'undefined') {
//     if(e.response.status === 400) {
//       req.flash('error', e.response.data.errorMessage.error);
//       res.redirect('/');
//     }
//   }    
// })

// personal profile of another user
router.get('/user', headerAuth.connectedHeader, async (req,res) => {
  const id = req.query.id;
  let error, blockMessage, reportMessage, likesMessage;
  let err = req.flash('error');
  // check if user exists and if his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then((respo) => {
      if (respo.data.errorMessage.error !== undefined)
        error = {error: respo.data.errorMessage.error};
      console.log(chalk.green(JSON.stringify(respo.data.successMessage)));
      // console.log(chalk.blue(JSON.stringify(error)));
      // get user infos
      axios.get(`${process.env.HostApi}/user?id=${id}`)
      .then((response) => {
          // add the user to visitors list
          axios.post(`${process.env.HostApi}/user/visit?id=${id}`)
          .then((re) => {
            console.log(chalk.green(JSON.stringify(re.data.successMessage)))
          }).catch((e) => {
            handle.errorHandle(e, req, res)     
          });
          user = response.data.user;
          // get the city & country by reverse geocoding
          geocoder.reverse({lat:user.latitude, lon:user.longitude}).then((result) => {
          user.city = result[0].city;
          user.country = result[0].country;
          // get the relationship with the user
          axios.get(`${process.env.HostApi}/user/getRelation?id=${id}`)
          .then((resp) => {
            user.isLiked = resp.data.isLiked;
            user.isBlocked = resp.data.isBlocked;
            user.isReported = resp.data.isReported;
            if (user.isLiked === 1) likesMessage = resp.data.likesMessage;
            if (user.isBlocked === 1) blockMessage = resp.data.blockMessage;
            if (user.isReported === 1) reportMessage = resp.data.reportMessage;
            // console.log(chalk.blue(JSON.stringify(resp.data)))
            return res.render('profile', {userInfos: user, error, message: {blockMessage, reportMessage, likesMessage, err}});
          }).catch((e) => {
            handle.errorHandle(e, req, res)     
          });
          })
      }
      ).catch((e) => {
        handle.errorHandle(e, req, res)     
      });
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/');
      }
    }    
  })
})

// Like / Unlike 
router.post('/user/like', headerAuth.connectedHeader, (req, res) => {
  const id = req.body.userId;
  // check if user exists & his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then((resp) => {
    // you can't like/unlike a profile if is not completed
    if (resp.data.successMessage == null) 
        res.redirect(`/user?id=${id}`);
    else {
         // console.log(chalk.red(id));
        axios.post(`${process.env.HostApi}/user/like?id=${id}`)
        .then((response) => {
          console.log(chalk.green(JSON.stringify(response.data.successMessage)))
          res.redirect(`/user?id=${id}`); 
        }
        ).catch((err) => {
          // console.log(chalk.red(JSON.stringify(err.response.data)));
          handle.authError(err, req, res); 
          if(typeof err.response !== 'undefined') {
            if(err.response.status === 400) {
              req.flash('error', err.response.data.errorMessage.error);
              res.redirect(`/user?id=${id}`);
            }
          }   
        });
    }
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/');
      }
    }    
  })
})

// Block / Unblock
router.post('/user/block', headerAuth.connectedHeader, (req, res) => {
  const id = req.body.userId;
  // check if user exists & his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then((resp) => {
    // console.log(chalk.magenta(JSON.stringify(resp.data)))
     // console.log(chalk.red(id));
     axios.post(`${process.env.HostApi}/user/block?id=${id}`)
     .then((response) => {
       console.log(chalk.green(JSON.stringify(response.data.successMessage)))
       res.redirect(`/user?id=${id}`); 
     }
     ).catch((err) => {
       // console.log(chalk.red(JSON.stringify(err.response.data)));
       handle.errorHandle(err, req, res)     
     });
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/');
      }
    }    
  })
})

// Report
router.post('/user/report', headerAuth.connectedHeader, (req, res) => {
  const id = req.body.userId;
  // check if user exists & his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then((resp) => {
    //console.log(chalk.magenta(JSON.stringify(resp.data)))
     // console.log(chalk.red(id));
     axios.post(`${process.env.HostApi}/user/report?id=${id}`)
     .then((response) => {
       console.log(chalk.green(JSON.stringify(response.data)))
       res.redirect(`/user?id=${id}`); 
     }).catch((err) => {
       // console.log(chalk.red(JSON.stringify(err.response.data)));
       handle.errorHandle(err, req, res)     
     });
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/');
      }
    }    
  })
})

module.exports = router;