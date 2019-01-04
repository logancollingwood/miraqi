var express = require('express');
var DiscordStrategy = require('passport-discord').Strategy;
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');
var DataBase = require('../db/db.js');
var _a = require('../auth/MerakiAuth.js'), WebAuth = _a.WebAuth, SocketAuth = _a.SocketAuth;
var cors = require('cors');
var setupWebEndpoints = require('./webEndpoints.js');
require('dotenv').config();
function MiraqiWeb(app, dbInstance, sessionStore, cookieParser) {
    var db = new DataBase(dbInstance);
    app.use(bodyParser.json());
    app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    app.use(express.static(path.join(__dirname, '../../build')));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
    WebAuth(app, db, sessionStore, cookieParser);
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
    setupWebEndpoints(app, db);
}
module.exports.MiraqiWeb = MiraqiWeb;
//# sourceMappingURL=merakiWeb.js.map