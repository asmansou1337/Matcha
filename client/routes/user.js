var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: 'AIzaSyBg-g_Rb35tPbOZf4MVrXSpNP08hrVmhO0',
  formatter: 'json'
};
var geocoder = NodeGeocoder(options);

// var io = require('socket.io')(8080);


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

async function getUserInfos(id) {
  try {
    const result = await axios.get(`${process.env.HostApi}/user?id=${id}`)
    return result.data.user
  } catch (e) {
    console.log(chalk.red(JSON.stringify(e.response.data.errorMessage.error)))
      throw new Error(e.response.data.errorMessage.error)
  }
}

async function addVisit(id) {
  // add the user to visitors 
  try {
    const result = await axios.post(`${process.env.HostApi}/user/visit?id=${id}`)
    console.log(chalk.green(JSON.stringify(result.data.successMessage)))
    // io.sockets.connected[user.socket].emit('visit');
    return result
  } catch(e) {
    console.log(chalk.red(JSON.stringify(e.response.data.errorMessage.error)))
    throw new Error(e.response.data.errorMessage.error)
  }
}

async function getRelation(id) {
  try {
    const result = await axios.get(`${process.env.HostApi}/user/getRelation?id=${id}`);
    // console.log(chalk.magenta(JSON.stringify(result.data)))
    let user = {
      isLiked: result.data.isLiked,
      isBlocked: result.data.isBlocked,
      isReported: result.data.isReported,
      likesMessage: result.data.likesMessage,
      blockMessage: result.data.blockMessage,
      reportMessage: result.data.reportMessage
    }
    // console.log(chalk.magenta(JSON.stringify(user)))
    return user
  } catch (e) {
    console.log(chalk.red(JSON.stringify(e.response.data.errorMessage.error)))
    throw new Error(e.response.data.errorMessage.error)
  }
}


// personal profile of another user
router.get('/user', headerAuth.connectedHeader, isComplete, async (req,res) => {
  const id = req.query.id;
  let error;
  let err = req.flash('error');
  // check if user exists and if his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then(async (respo) => {
    try {
      if (respo.data.errorMessage.error !== undefined)
        error = {error: respo.data.errorMessage.error};
        console.log(chalk.green(JSON.stringify(respo.data.successMessage)));
        // add the user to visitors list
        addVisit(id)
        // get user infos
        const user = await getUserInfos(id)
        // console.log(chalk.yellow(JSON.stringify(user)))
          // io.sockets.emit('visit');
          // get the relationship with the user
          const relation = await getRelation(id)
          // console.log(chalk.blue(JSON.stringify(relation)))
          return res.render('profile', {userInfos: user, error, relation, message: {err}, token: req.cookies.jwt});
    } catch (e) {
      console.log(chalk.red(JSON.stringify(e.message)))
      req.flash('error', e.message);
      res.redirect('/');
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

// Like / Unlike 
router.post('/user/like', headerAuth.connectedHeader, isComplete, (req, res) => {
  const id = req.body.userId;
  // check if user exists & his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut?id=${id}`)
  .then((resp) => {
    console.log(chalk.yellow(JSON.stringify(resp.data)))
    // you can't like/unlike a profile if is not completed
    if (resp.data.successMessage == null && resp.data.isComplete === 0) 
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
router.post('/user/block', headerAuth.connectedHeader, isComplete, (req, res) => {
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
router.post('/user/report', headerAuth.connectedHeader, isComplete, (req, res) => {
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