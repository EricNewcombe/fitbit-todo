var express = require('express');
var logger = require('morgan');
var http = require('http');
const cookieParser = require('cookie-parser');

var routeController = require('./routes');

var port = 5000;


var app = express();

// Set up middleware
app.use(logger('dev'));

app.use(cookieParser());

// Set up routes
routeController(app);

// Start server
http.createServer(app).listen(port);
