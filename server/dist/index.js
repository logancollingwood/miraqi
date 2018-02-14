'use strict';

var io = require('socket.io')();

var MerakiWeb = require('./web/merakiWeb.js');
var MerakiSocket = require('./socket/merakiSocket.js');

var SOCKET_PORT = 8002;
var WEB_PORT = 8003;

MerakiSocket.setup(io, SOCKET_PORT);
MerakiWeb.setup(WEB_PORT);