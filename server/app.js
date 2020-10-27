require('dotenv').config();
var express = require('express');
var cors = require('cors');
var logger = require('morgan');
const chalk = require('chalk');

var indexRouter = require('./routes/index');

var app = express();
const server = require('http').createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

server.listen(port, () => {
    console.log(chalk.yellow('API Listening on http://' + host + ':' + port ));
});
