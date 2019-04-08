import { Mongoose } from "mongoose";
import { MongoError } from "mongodb";
import QueueProcessor from "./worker/QueueProcessor";

const MerakiWeb = require('./web/merakiWeb.js');
const mongoose: Mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const SocketService = require('./socket/SocketService');
const Bull = require('bull');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const WEB_PORT = process.env.PORT || 3001;


const uri = process.env.MONGODB_URI;
console.log("Connecting to mongodb:");
mongoose.connect(uri, { useNewUrlParser: true }, (err: MongoError) => { console.log(`connected to mongoose`)});


const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
const djQueue = new Bull('dj-queue', process.env.REDIS_URL);

const queue = new QueueProcessor(djQueue, io);

SocketService(io, sessionStore, djQueue);
MerakiWeb.setup(app, sessionStore);

server.listen(WEB_PORT);
