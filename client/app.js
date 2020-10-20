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
const util = require('./middleware/functions');

chatUsers = [];

var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var userRouter = require('./routes/user');
var browseRouter = require('./routes/browse');
var chatRouter = require('./routes/chat');
var searchRouter = require('./routes/search');
var notificationsRouter = require('./routes/notification');

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
}

/**
 * Create HTTP server.
 */
const port =  process.env.PORT || 8080;
const host =  process.env.HOST || 'localhost';

server.listen(port, () => {
    console.log(chalk.yellow('Listening on http://' + host + ':' + port ));
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(ignoreFavicon);
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

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/', userRouter);
app.use('/', browseRouter);
app.use('/', chatRouter);
app.use('/', searchRouter);
app.use('/', notificationsRouter);


io.on('connection', socket => {
  socket.on('joinConv', ({ to, from, matchedUsername, username, convId }) => {
    const user = util.userJoin(socket.id, to, from, matchedUsername, username, convId);
    socket.join(user.convId);
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = util.getCurrentUser(socket.id);
    let isRead = 0;
    if (util.checkConnectedUser(user.to, user.from, user.convId) == true)
      isRead = 1;

    // to, from, matchedUsername, username, convId
    let sendMsg = {userTo: user.to, userFrom: user.from, convId: user.convId, msg, isRead}
    
    axios.post(`${process.env.HostApi}/sendMsg`, sendMsg)
    .then((respo) => {
        io.to(user.convId).emit('message', util.formatMessage(user.username, msg));
        axios.get(`${process.env.HostApi}/getUnreadMessages?userId=${user.to}`)
        .then((notif) => {
          // console.log(JSON.stringify(notif.data))
          io.emit('chatNotif', {userTo: user.to, unreadMsgs: notif.data.unreadMsgs, msg: 1})
          axios.get(`${process.env.HostApi}/getConvUnreadMessages?userId=${user.from}&convId=${user.convId}`)
            .then((unread) => {
              io.emit('convUnread', {convId: user.convId, unreadMsgs: unread.data.unreadMsgs, userId: user.to})
            })
            .catch((e) => {
              console.log(chalk.red( e.response.data.errorMessage.error))
              socket.error(e.response.data.errorMessage.error)
            })
        })
        .catch((e) => {
          console.log(chalk.red( e.response.data.errorMessage.error))
          socket.error(e.response.data.errorMessage.error)
        })
        console.log(chalk.green(respo.data.successMessage))
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  });

  socket.on('visitProfile', (data) => {
    // console.log(data)
    axios.get(`${process.env.HostApi}/unreadnotif?id=${data.visited}`)
    .then((respo) => {
        io.emit('unreadNotif', {unread: respo.data.unread, notify: respo.data.notify, id: data.visited, msg: data.msg});
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  })

  socket.on('checkNotif', (data) => {
    // console.log(data)
    axios.get(`${process.env.HostApi}/unreadnotif?id=${data.user.userId}`)
    .then((respo) => {
        io.emit('unreadNotif', {unread: respo.data.unread, notify: respo.data.notify, id: data.user.userId, msg: data.msg});
    }).catch((e) => {
      console.log(chalk.red( e.response.data.errorMessage.error))
      socket.error(e.response.data.errorMessage.error)
    })
  })

  socket.on('checkChatNotif', (data) => {
    axios.get(`${process.env.HostApi}/getUnreadMessages?userId=${data.user.userId}`)
        .then((notif) => {
          // console.log(JSON.stringify(notif.data))
          io.emit('chatNotif', {userTo: data.user.userId, unreadMsgs: notif.data.unreadMsgs, msg: data.msg})
        })
        .catch((e) => {
          socket.error(e.response.data.errorMessage.error)
        })
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    util.userLeave(socket.id);
  });
})


