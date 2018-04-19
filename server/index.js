const MerakiWeb = require('./web/merakiWeb.js');
const MerakiSocket = require('./socket/merakiSocket.js');

const SOCKET_PORT = 8002;
const WEB_PORT = 3001;

MerakiSocket.setup(SOCKET_PORT);
MerakiWeb.setup(WEB_PORT);