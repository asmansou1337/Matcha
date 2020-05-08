const axios = require('axios');
const chalk = require('chalk');
const handle = require('./functions')

module.exports  = (req, res, next) => {
    // check if user exists & his profile is completed
  axios.get(`${process.env.HostApi}/user/getProfileStatut`)
  .then((resp) => {
    // console.log(chalk.yellow(JSON.stringify(resp.data)));
    if (resp.data.successMessage == null && resp.data.isComplete === 0) {
        req.flash('error', 'Please complete your profile first!!');
        res.redirect('/profile/editProfile'); 
    } else
        next();
  })
  .catch((e) => {
    handle.authError(e, req, res);
    if(typeof e.response !== 'undefined') {
    // console.log(chalk.green(JSON.stringify(e.response.data)))
      if(e.response.status === 400) {
        req.flash('error', e.response.data.errorMessage.error);
        res.redirect('/');
      }
    }    
  })
}

