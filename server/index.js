
const io = require('socket.io')();

const MerakiWeb = require('./web/merakiWeb.js');
const MerakiSocket = require('./socket/merakiSocket.js');

const SOCKET_PORT = 8002;
const WEB_PORT = 8003;

MerakiSocket.setup(io, SOCKET_PORT);
MerakiWeb.setup(WEB_PORT);