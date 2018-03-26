const MerakiWeb = require('./web/merakiWeb.js');
const MerakiSocket = require('./socket/merakiSocket.js');

const SOCKET_PORT = 8002;
const WEB_PORT = 8003;

MerakiSocket.setup(SOCKET_PORT);
MerakiWeb.setup(WEB_PORT);