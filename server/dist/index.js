'use strict';

var MerakiWeb = require('./web/merakiWeb.js');
var MerakiSocket = require('./socket/merakiSocket.js');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var WEB_PORT = 3001;

var uri = process.env.MONGO_CONNECTION_STRING;
console.log("Connecting to mongodb: " + uri);
var db = mongoose.connect(uri);

var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

MerakiSocket.setup(io, db, sessionStore, cookieParser);
MerakiWeb.setup(app, db, sessionStore, cookieParser);

server.listen(WEB_PORT);