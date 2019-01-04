const MerakiWeb = require('./web/merakiWeb.js');
const MerakiSocket = require('./socket/merakiSocket.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const DataBase = require('./db/db.js');
const SocketService = require('./socket/SocketService');


var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const WEB_PORT = process.env.PORT || 3001;


const uri = process.env.MONGODB_URI;
console.log("Connecting to mongodb: " + uri);
let db = new DataBase(mongoose.connect(uri));


const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

SocketService(io, db, sessionStore);
MerakiSocket.setup(io, db, sessionStore, cookieParser);
MerakiWeb.setup(app, db, sessionStore, cookieParser);

server.listen(WEB_PORT);
