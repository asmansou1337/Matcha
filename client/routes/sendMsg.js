const express = require('express');
const router = express.Router();
const chalk = require('chalk')

module.exports = function(io) {
    const users = [];

// Join user to chat
function userJoin(id, to, from, matchedUsername, username, convId) {
  const user = { id, to, from, matchedUsername, username, convId };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function formatMessage(username, msg) {
  return {
    username,
    msg,
    //time: moment().format('h:mm a')
  };
}

    //we define the variables
    var sendResponse = function () {};

io.on('connection', socket => {
  // socket.emit('message', 'user connected');
  socket.on('joinConv', ({ to, from, matchedUsername, username, convId }) => {
    // const user = {socket:socket.id, userFrom, convId};
    const user = userJoin(socket.id, to, from, matchedUsername, username, convId);
    console.log(chalk.red(JSON.stringify(user)))
    socket.join(user.convId);

    // Welcome current user
    socket.emit('message', formatMessage('botName', `welcome`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.convId)
      .emit(
        'message',formatMessage('botName', `${user.username} has joined the chat`));

    // Send users and room info
    // io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });
  });
//   // Listen for chatMessage
//   socket.on('chatMessage', msg => {
//     const user = getCurrentUser(socket.id);
//     let error;
//     // to, from, matchedUsername, username, convId
//     let sendMsg = {userTo: user.to, userFrom: user.from, convId: user.convId, msg}
//     console.log(chalk.blue(JSON.stringify(sendMsg)))
//     axios.post(`${process.env.HostApi}/sendMsg`, sendMsg)
//     .then((respo) => {
//       if (typeof respo.data.errorMessage.error !== 'undefined') {
//         socket.emit('error', respo.data.errorMessage.error);
//       }
//       if (typeof respo.data.successMessage !== null) {
//         io.to(user.convId).emit('message', formatMessage(user.username, msg));
//       }
//         // get user infos
//         console.log(respo.data)
//         // res.render('search', {users: respo.data.searchList});
//     }).catch((e) => {
//       console.log(JSON.stringify(e.response.data))
//       console.log(chalk.red( e.response.data.errorMessage.error))
//       error = e.response.data.errorMessage.error
//     })
//     // socket.emit('error', error);
//     // .catch((e) => {
//     //   //handle.authError(e, req, res);
//     //   if(typeof e.response !== 'undefined') {
//     //     if(e.response.status === 400) {
//     //       console.log(chalk.red( e.response.data.errorMessage.error))
//     //       // socket.emit('error', e.response.data.errorMessage.error);
//     //       // req.flash('error', e.response.data.errorMessage.error);
//     //       // res.redirect('/');
//     //     }
//     //   }    
//     // })
//     //io.to(user.convId).emit('message', msg);
//   });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log('disconnect')
    console.log(socket.id)
    const user = userLeave(socket.id);

    // if (user) {
    //   io.to(user.room).emit(
    //     'message',
    //     formatMessage(botName, `${user.username} has left the chat`)
    //   );

    //   // Send users and room info
    //   io.to(user.room).emit('roomUsers', {
    //     room: user.room,
    //     users: getRoomUsers(user.room)
    //   });
    // }
  });
})

    // io.sockets.on("connection",function(socket){
    //     // Everytime a client logs in, display a connected message
    //     console.log("Server-Client Connected!");

    //     socket.on('connected', function(data) {
    //         //listen to event at anytime (not only when endpoint is called)
    //         //execute some code here
    //     });

    //     socket.on('taskResponse', data => {
    //         //calling a function which is inside the router so we can send a res back
    //         sendResponse(data);
    //     })     
    // });

    router.post('/sendMsg', async (req, res) => {
        console.log(chalk.red(JSON.stringify(req.body)))
        console.log(chalk.red(JSON.stringify(req.query)))
        // //pickedUser is one of the connected client
        // var pickedUser = "JZLpeA4pBECwbc5IAAAA";
        // io.to(pickedUser).emit('taskRequest', req.body);

        // sendResponse = function (data) {
        //     return res.status(200).json({"text": "Success", "response": data.data});
        // }

    });

    return router;

};