const express = require('express');
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser')
const path = require('path');

const { WebAuth, SocketAuth } = require('../auth/MerakiAuth.js');

const cors = require('cors');
const setupWebEndpoints = require('./webEndpoints.js');

require('dotenv').config()


function setup(app, sessionStore) {

    app.use(bodyParser.json());
    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
    app.use(express.static(path.join(__dirname, '../../build')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });

    WebAuth(app, sessionStore);

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });

    setupWebEndpoints(app);

}

module.exports = {
    setup: setup
}