const MerakiWeb = require('./web/merakiWeb.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const DataBase = require('./db/db.js');
const SocketService = require('./socket/SocketService');
const Bull = require('bull');
const QueueProcessor = require('./worker/QueueProcessor');


var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const WEB_PORT = process.env.PORT || 3001;


const uri = process.env.MONGODB_URI;
console.log("Connecting to mongodb: " + uri);
mongoose.connect(uri)


const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
const djQueue = new Bull('dj-queue', process.env.REDIS_URL);

const queue = new QueueProcessor(djQueue, io);

SocketService(io, sessionStore, djQueue);
MerakiWeb.setup(app, sessionStore);

server.listen(WEB_PORT);