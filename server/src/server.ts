import MiraqiWeb  from './web/merakiWeb';
import { MerakiSocket } from "./socket/merakiSocket";
import { Mongoose } from "mongoose";
import session = require("express-session");
import * as ConnectMongo from "connect-mongo";
const MongoStore = ConnectMongo(session);
import * as cookieParser from "cookie-parser";
import Socket = require('./socket/socket.js');
import { WebAuth, SocketAuth } from "./auth/MerakiAuth.js";
import * as express  from "express";
import * as http from "http";
import * as IO from 'socket.io';

const app: any = express();
const server = http.createServer(app);
const io = IO(server);

const WEB_PORT = process.env.PORT || 3001;

const MONGO_DB_URI_ENV_NAME = "MONGODB_URI";
const uri = process.env[MONGO_DB_URI_ENV_NAME] || "";

const LOG_CONSOLE = console.log;
LOG_CONSOLE("Connecting to mongodb: " + uri);

const mongoose = new Mongoose();
const mongooseConnection = mongoose.connect(uri);

const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

// Initialize Authorization on our endpoints
SocketAuth(io, sessionStore);
WebAuth(app, mongooseConnection, sessionStorage, cookieParser);


// Set up handlers for different network requests
MerakiSocket(io, mongooseConnection, sessionStore);
MiraqiWeb(app, mongooseConnection, sessionStore, cookieParser);

server.listen(WEB_PORT);
