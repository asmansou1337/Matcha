require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash-plus');
var session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const chalk = require('chalk');
var app = express();
const server = require('http').createServer(app);
io = require('socket.io').listen(server);

chatUsers = [];
connectedUsers = [];



function formatMessage(username, msg) {
  return {
    username,
    msg,
    //time: moment().format('h:mm a')
  };
}
// var cors = require('cors');

var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var userRouter = require('./routes/user');
var browseRouter = require('./routes/browse');
var chatRouter = require('./routes/chat');
var searchRouter = require('./routes/search');
var notificationsRouter = require('./routes/notification');


/**
 * Create HTTP server.
 */
const port =  process.env.PORT || 8080;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(chalk.yellow('Listening on http://' + host + ':' + port ));
});

// app.use(cors({
//   origin: 'http://localhost:8080/',
//   credentials: true
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
 
app.use(flash());

// app.use(cors({
//   credentials: true,
// }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/', userRouter);
app.use('/', browseRouter);
app.use('/', chatRouter);
app.use('/', searchRouter);
app.use('/', notificationsRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res) {
  if(typeof err.response !== 'undefined') {
    if(err.response.status === 400) {
        const error = err.response.data.errorMessage;
        return res.render('signup', {error});
    }
  }  
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});


/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '8080');
// app.set('port', port);

/**
 * Create HTTP server.
 */


// var server = http.createServer(app);
// const io = socketio(server);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

// io.sockets.on('connection', (socket) => {
//   let currentUser = null;

//     socket.on('identify', ({playload}) => {
//       // console.log(JSON.stringify(playload))
//       currentUser = {
//         id: playload.userId,
//         username: playload.username,
//         count: 1
//     };
//     console.log(chalk.green('current user -- ' + JSON.stringify(currentUser)))
//     const user = connectedUsers.find(u => u.id === currentUser.id);
//     if (user) {
//         user.count++;
//     } else {
//         currentUser.socket = socket.id;
//         connectedUsers.push(currentUser)
//     }
//     console.log(JSON.stringify(connectedUsers))
//     })

//     socket.on('disconnect', () => {
//       if (currentUser) {
//           const user = connectedUsers.find(u => u.id === currentUser.id);
//           if (user) {
//               user.count--;
//               if (user.count === 0) {
//                 const index = connectedUsers.findIndex(user => user.id === currentUser.id);
//               if (index !== -1) {
//                 connectedUsers = connectedUsers.splice(index, 1)[0];
//               }
//                   // // Deconnexion utilisateur
//                   // // checkDb.updateOnlineStatus(currentUser.id, 'logout');
//                   // connectedUsers = connectedUsers.filter(u => u.id !== currentUser.id);
//                   // socket.broadcast.emit('users.leave', {user: currentUser});
//                   console.log(JSON.stringify(connectedUsers))
//               }
//           }
//       }
//   })
// })

// Join user to chat
function userJoin(id, to, from, matchedUsername, username, convId) {
  const user = { id, to, from, matchedUsername, username, convId };

  chatUsers.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return chatUsers.find(user => user.id === id);
}

// Get current user
function checkConnectedUser(id, id2, convId) {
  for (const user of chatUsers) {
    if (user.from === id && user.to === id2 && user.convId === convId) {
      return true
    }
  }
  return false
}

// User leaves chat
function userLeave(id) {
  const index = chatUsers.findIndex(user => user.id === id);

  if (index !== -1) {
    return chatUsers.splice(index, 1)[0];
  }
}

io.on('connection', socket => {
    let currentUser = null;

    socket.on('identify', ({playload}) => {
      // console.log(JSON.stringify(playload))
      currentUser = {
        id: playload.userId,
        username: playload.username,
        count: 1
      };
      // console.log(chalk.red(JSON.stringify(connectedUsers)))
      let user = connectedUsers.find(u => u.id == currentUser.id)
      if (user) {
        // console.log('increment')
        user.count++;
      } else {
          currentUser.socket = socket.id;
          connectedUsers.push(currentUser)
      }
      // console.log(chalk.green('current user -- ' + JSON.stringify(currentUser)))
      // connectedUsers.push(currentUser)
      // console.log(chalk.yellow(JSON.stringify(connectedUsers)))
      // console.log(chalk.yellow('user connected'))
      
    })

  //  socket.emit('message', 'user connected');
  socket.on('joinConv', ({ to, from, matchedUsername, username, convId }) => {
    // const user = {socket:socket.id, userFrom, convId};
    const user = userJoin(socket.id, to, from, matchedUsername, username, convId);
    console.log(chalk.blue(JSON.stringify(chatUsers)))
    socket.join(user.convId);
    // // Welcome current user
    // socket.emit('message', formatMessage('botName', `welcome`));

    // // Broadcast when a user connects
    // socket.broadcast
    //   .to(user.convId)
    //   .emit(
    //     'message',formatMessage('botName', `${user.username} has joined the chat`));

    // Send users and room info
    // io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });
  });
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    console.log(chalk.yellow('current user ' + JSON.stringify(user)))
    let isRead = 0;
    console.log(chalk.magentaBright(checkConnectedUser(user.to, user.from, user.convId)))
    if (checkConnectedUser(user.to, user.from, user.convId))
      isRead = 1;

    // to, from, matchedUsername, username, convId
    let sendMsg = {userTo: user.to, userFrom: user.from, convId: user.convId, msg, isRead}
    // console.log(chalk.blue(JSON.stringify(sendMsg)))
    
    axios.post(`${process.env.HostApi}/sendMsg`, sendMsg)
    .then((respo) => {
        io.to(user.convId).emit('message', formatMessage(user.username, msg));
        axios.get(`${process.env.HostApi}/getUnreadMessages`)
        .then((notif) => {
          console.log(JSON.stringify(notif.data))
          io.emit('chatNotif', {userTo: user.to, unreadMsgs: notif.data.unreadMsgs})
        })
        .catch()
        console.log(chalk.green(respo.data.successMessage))
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  });

  socket.on('addNotif', (msg) => {
    console.log(msg)
  })

  socket.on('visitProfile', (data) => {
    console.log(data)
    axios.get(`${process.env.HostApi}/unreadnotif?id=${data.visited}`)
    .then((respo) => {
        io.emit('unreadNotif', {unread: respo.data.unread, id: data.visited, msg: data.msg});
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  })

  socket.on('checkNotif', (data) => {
    console.log(data)
    axios.get(`${process.env.HostApi}/unreadnotif?id=${data.user.userId}`)
    .then((respo) => {
        io.emit('unreadNotif', {unread: respo.data.unread, id: data.user.userId, msg: data.msg});
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log('disconnect')
    // console.log(socket.id)
    // const user = userLeave(socket.id);
    userLeave(socket.id);
    console.log(chalk.magenta(JSON.stringify(chatUsers)))
    if (currentUser) {
                const user = connectedUsers.find(u => u.id === currentUser.id);
                if (user) {
                    user.count--;
                    if (user.count === 0) {
                      connectedUsers = connectedUsers.filter(u => u.id !== currentUser.id);
                        // // Deconnexion utilisateur
                        // // checkDb.updateOnlineStatus(currentUser.id, 'logout');
                        // connectedUsers = connectedUsers.filter(u => u.id !== currentUser.id);
                        // socket.broadcast.emit('users.leave', {user: currentUser});
                        // console.log(chalk.blue(JSON.stringify(connectedUsers)))
                    }
                }
            }
  });
})




/**
 * Normalize a port into a number, string, or false.
 */

// function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }
