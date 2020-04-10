const axios = require('axios');

const auth = {
    connectedHeader: (req, res, next) => {
         console.log("jwt ---> " +typeof req.cookies.jwt);
        if (typeof req.cookies.jwt === 'undefined' || req.cookies.jwt.length === 0) {
            req.flash('error', 'Authentification Failed, Please Login!!');
            return res.redirect('/login');
        } else {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
            next();
        }
    },
    nonConnected: (req, res, next) => {
        if (typeof req.cookies.jwt !== 'undefined') {
            req.flash('error', 'You are already logged in!!');
            return res.redirect('/');
        } else {
            next();
        }
    }
}

module.exports = auth