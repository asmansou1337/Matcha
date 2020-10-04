const axios = require('axios');

const auth = {
    // If user is not connected redirect him to login page
    // Otherwise add the cookie to the header request
    connectedHeader: (req, res, next) => {
        if (typeof req.cookies.jwt === 'undefined' || req.cookies.jwt.length === 0) {
             if (req.originalUrl !== '/')
                req.flash('error', 'Authentification Failed, Please Login!!');
            return res.redirect('/login');
        } else {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
            next();
        }
    },
    // If user is already connected redirect it to home page
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