var express = require('express');
var logger = require('morgan');
var http = require('http');

var routeController = require('./routes');

var port = 3000;


var app = express();

// Set up middleware
app.use(logger('dev'));

// Set up routes
routeController(app);

// Start server
http.createServer(app).listen(port);
