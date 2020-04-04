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

// personal profile of another user
router.get('/user', headerAuth.connectedHeader, async (req,res) => {
    // get user infos
  const id = req.query.id;
  axios.get(`${process.env.HostApi}/user?id=${id}`)
  .then((response) => {
      // console.log(chalk.greenBright(JSON.stringify(response.data.user)));
      user = response.data.user;
       geocoder.reverse({lat:user.latitude, lon:user.longitude}).then((result) => {
        //  console.log(result[0].city);
        user.city = result[0].city;
        user.country = result[0].country;
        // console.log(chalk.greenBright(JSON.stringify(user)));
        return res.render('profile', {userInfos: user});
      })
  }
  ).catch((e) => {
    handle.errorHandle(e, req, res)     
  });
})

module.exports = router;