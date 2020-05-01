const func = {
    errorHandle: (e, req, res) => {
        if(typeof e.response !== 'undefined') {
            if(e.response.status === 400) {
                console.log(e.response.data);
                return;
            } else if(e.response.status === 401) {
              req.flash('error', 'Authentification Failed, Please Login!!');
              return res.redirect('/login');
          }
          }    
    },
    authError: (e, req, res) => {
        if(typeof e.response !== 'undefined') {
        if(e.response.status === 401) {
            req.flash('error', 'Authentification Failed, Please Login!!');
            return res.redirect('/login');
        }}
    },
    isEmpty: (value) => {
        if(!value || (typeof value === 'undefined') || (value.length === 0) || JSON.stringify(value) === '{}') 
            return true
        return false
      }
}

module.exports = func