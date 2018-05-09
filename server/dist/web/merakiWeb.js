'use strict';

var express = require('express');
var DiscordStrategy = require('passport-discord').Strategy;
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');

var DataBase = require('../db/db.js');

var _require = require('../auth/MerakiAuth.js'),
    WebAuth = _require.WebAuth,
    SocketAuth = _require.SocketAuth;

var cors = require('cors');
var setupWebEndpoints = require('./webEndpoints.js');

require('dotenv').config();

function setup(app, dbInstance, sessionStore, cookieParser) {
    var db = new DataBase(dbInstance);

    var buildFolder = "../../../build";
    if (process.env.IS_SERVER == true) {
        buildFolder += "../";
    }
    console.log('using buildfolder: ' + buildFolder);
    app.use(bodyParser.json());
    app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, buildFolder, 'index.html'));
    });

    WebAuth(app, db, sessionStore, cookieParser);

    app.use(express.static(path.join(__dirname, buildFolder + 'static')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, buildFolder, 'index.html'));
    });

    setupWebEndpoints(app, db);
}

module.exports = {
    setup: setup
};