require('dotenv').config();
// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
const chalk = require('chalk');

var indexRouter = require('./routes/index');

var app = express();
const server = require('http').createServer(app);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: [
      `http://localhost:${process.env.PORT_FRONT}`,
    ],
    credentials: true
  })
);

app.use(indexRouter);

// catch 404 and forward to error handler
app.use((req,res,next) =>{
  var err = new Error('not found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err)
  const status = err.status || 500;
  const error = err.message || 'Error processing your request';

  res.status(status).send({
      error
  })

});

const port =  process.env.PORT || 3000;
const host =  process.env.HOST;

server.listen(port, host, () => {
    console.log(chalk.yellow('API Listening on http://' + host + ':' + port ));
});
