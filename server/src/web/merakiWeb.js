const express = require('express');
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const bodyParser = require('body-parser')
const path = require('path');

const {
    WebAuth,
    SocketAuth
} = require('../auth/MerakiAuth.js');

const cors = require('cors');
const setupWebEndpoints = require('./webEndpoints.js');

require('dotenv').config()


export default function setup(app, sessionStore) {

    app.use(bodyParser.json());
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000'
    }));
    app.use(express.static(path.join(__dirname, '../../../../../client/build')));

    WebAuth(app, sessionStore);

    app.get('*', function (req, res) {
        console.log((path.join(__dirname, '../../../../../client/build', 'index.html')));
        res.sendFile(path.join(__dirname, '../../../../../client/build', 'index.html'));
    });

    setupWebEndpoints(app);

}