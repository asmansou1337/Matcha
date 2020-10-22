const func = {
    authError: (e, req, res) => {
        if(typeof e.response !== 'undefined') {
        if(e.response.status === 401) {
            req.flash('error', 'Authentification Failed, Please Login!!');
            res.clearCookie("jwt");
            return res.redirect('/login');
        }}
    },
    isEmpty: (value) => {
        if(!value || (typeof value === 'undefined') || (value.length === 0) || JSON.stringify(value) === '{}') 
            return true
        return false
    },
    formatMessage: (username, msg) => {
        msg = func.escapeHtml(msg)
        return {
          username,
          msg,
          //time: moment().format('h:mm a')
        };
    },
    escapeHtml: (str) => {
        str  = str.replace(/[&<>'"]/g, 
          tag => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&#39;',
              '"': '&quot;'
            }[tag] || tag))
        return str
      },
    // Join user to chat
    userJoin: (id, to, from, matchedUsername, username, convId) => {
        const user = { id, to, from, matchedUsername, username, convId };
        chatUsers.push(user);
        return user;
    },
    // Get current user
    getCurrentUser: (id) => {
        return chatUsers.find(user => user.id === id);
    },
    // Get if user is active in conversation
    checkConnectedUser: (id, id2, convId) => {
        for (const user of chatUsers) {
            if (Number(user.from) === Number(id) && Number(user.to) === Number(id2) && user.convId === convId) {
                return true
            }
        }
        return false
    },
    // User leaves chat
    userLeave: (id) => {
        const index = chatUsers.findIndex(user => user.id === id);
    
        if (index !== -1) {
        return chatUsers.splice(index, 1)[0];
        }
    }
}

module.exports = func