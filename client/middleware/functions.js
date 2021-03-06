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
          time: func.formatTime(new Date())
        };
    },
    formatTime: (lastConnection) => {
        let connDate = new Date(lastConnection);
        let dayOfMonth = connDate.getDate();
        let month = connDate.getMonth() + 1;
        let year = connDate.getFullYear();
        let hour = connDate.getHours();
        let minutes = connDate.getMinutes();
        month = month < 10 ? '0' + month : month;
        dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
        hour = hour < 10 ? '0' + hour : hour;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        lastLogin = dayOfMonth+'/'+ month+'/'+year +' at '+ hour+':'+ minutes
        return lastLogin;
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
    },
}

module.exports = func