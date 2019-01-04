"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merakiWeb_1 = require("./web/merakiWeb");
var merakiSocket_1 = require("./socket/merakiSocket");
var mongoose_1 = require("mongoose");
var session = require("express-session");
var ConnectMongo = require("connect-mongo");
var MongoStore = ConnectMongo(session);
var cookieParser = require("cookie-parser");
var MerakiAuth_js_1 = require("./auth/MerakiAuth.js");
var express = require("express");
var http = require("http");
var IO = require("socket.io");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
var server = http.createServer(app);
var io = IO(server);
var WEB_PORT = process.env.PORT || 3001;
var MONGO_DB_URI_ENV_NAME = "MONGODB_URI";
var uri = process.env[MONGO_DB_URI_ENV_NAME] || "";
// const LOG_CONSOLE = console.log;
// LOG_CONSOLE("Connecting to mongodb: " + uri);
var mongoose = new mongoose_1.Mongoose();
var mongooseConnection = mongoose.connect(uri);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
// Initialize Authorization on our endpoints
MerakiAuth_js_1.SocketAuth(io, sessionStore);
MerakiAuth_js_1.WebAuth(app, mongooseConnection, sessionStore, cookieParser);
// Set up handlers for different network requests
merakiSocket_1.MerakiSocket(io, mongooseConnection, sessionStore);
merakiWeb_1.MiraqiWeb(app, mongooseConnection, sessionStore, cookieParser);
server.listen(WEB_PORT);
//# sourceMappingURL=server.js.map