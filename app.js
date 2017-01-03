'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let winston = require('winston');

// Database
let redis = require('redis');
const RDS_PORT = 6379;
const RDS_HOST = '127.0.0.1';
const RDS_OPTS = {};
let client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

client.on('error', (err) => {
  winston.info(err);
});

let routes = require('./routes/index.js');
let flows = require('./routes/flow.js');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Make our db accessible to our router
app.use((req, res, next) => {
  req.rd = client;
  next();
});

app.use('/api/v1', routes);
app.use('/api/v1/flows', flows);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
    winston.info(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
  winston.info(err.message);
});

module.exports = app;
