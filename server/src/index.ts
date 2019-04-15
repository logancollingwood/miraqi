import { Queue } from "bull";
import * as Mongoose from "mongoose";
import * as express from "express";
import { Application } from "express";
import { Store } from "express-session";
import { MongoError } from "mongodb";
import { Server } from "socket.io";
import SocketService from "./socket/SocketService";
import MerakiWeb from "./web/merakiWeb";
import QueueProcessor from "./worker/QueueProcessor";

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const Bull = require('bull');

var app: Application = express();
var server = require('http').createServer(app);
var io: Server = require('socket.io')(server);

const WEB_PORT = process.env.PORT || 3001;


const uri = process.env.MONGODB_URI;
console.log("Connecting to mongodb:");
Mongoose.connect(uri, { useNewUrlParser: true }, (err: MongoError) => { console.log(`connected to mongoose`) });


const sessionStore: Store = new MongoStore({ mongooseConnection: Mongoose.connection });
const djQueue: Queue = new Bull('dj-queue', process.env.REDIS_URL);

const queue = new QueueProcessor(djQueue, io);

SocketService(io, sessionStore, queue);
MerakiWeb(app, sessionStore);

server.listen(WEB_PORT);
