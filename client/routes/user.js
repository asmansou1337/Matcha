var express = require('express');
var router = express.Router();
const axios = require('axios');
const chalk = require('chalk');
const headerAuth = require('../middleware/authHeader')
const isComplete = require('../middleware/isCompleted');
const handle = require('../middleware/functions')


async function getUserInfos(id) {
  try {
    const result = await axios.get(`${process.env.HostApi}/user?id=${id}`)
    return result.data.user
  } catch (e) {
      throw new Error(e.response.data.errorMessage.error)
  }
}

async function addVisit(id) {
  // add the user to visitors 
  try {
    const result = await axios.post(`${process.env.HostApi}/user/visit?id=${id}`)
    console.log(chalk.green(JSON.stringify(result.data.successMessage)))
    return result
  } catch(e) {
    throw new Error(e.response.data.errorMessage.error)
  }
}

async function getRelation(id) {
  try {
    const result = await axios.get(`${process.env.HostApi}/user/getRelation?id=${id}`);
    let user = {
      isLiked: result.data.isLiked,
      isBlocked: result.data.isBlocked,
      isReported: result.data.isReported,
      likesMessage: result.data.likesMessage,
      blockMessage: result.data.blockMessage,
      reportMessage: result.data.reportMessage
    }
    return user
  } catch (e) {
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
        // get the relationship with the user
        const relation = await getRelation(id)
        return res.render('profile', {userInfos: user, error, relation, message: {err},isAdmin: req.isAdmin, token: req.cookies.jwt});
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
    // you can't like/unlike a profile if is not completed
    if (resp.data.successMessage == null && resp.data.isComplete === 0) 
        res.redirect(`/user?id=${id}`);
    else {
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
     axios.post(`${process.env.HostApi}/user/block?id=${id}`)
     .then((response) => {
       console.log(chalk.green(JSON.stringify(response.data.successMessage)))
       res.redirect(`/user?id=${id}`); 
     }
     ).catch((err) => {
      handle.authError(err, req, res); 
      if(typeof err.response !== 'undefined') {
        if(err.response.status === 400) {
          req.flash('error', err.response.data.errorMessage.error);
          res.redirect(`/user?id=${id}`);
        }
      }     
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
     axios.post(`${process.env.HostApi}/user/report?id=${id}`)
     .then((response) => {
       console.log(chalk.green(JSON.stringify(response.data)))
       res.redirect(`/user?id=${id}`); 
     }).catch((err) => {
        handle.authError(err, req, res); 
        if(typeof err.response !== 'undefined') {
          if(err.response.status === 400) {
            req.flash('error', err.response.data.errorMessage.error);
            res.redirect(`/user?id=${id}`);
          }
        }      
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