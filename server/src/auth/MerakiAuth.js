"use strict";
exports.__esModule = true;
var passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
var session = require('express-session');
var passportSocketIo = require("passport.socketio");
var db_1 = require("../db/db");
var cookieParser = require('cookie-parser');
function InitializePassportWeb(app, sessionStore) {
    var scopes = ['identify', 'email', 'guilds'];
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
    var hostName = process.env.HOST_NAME;
    console.log("using hostName: " + hostName);
    passport.use(new DiscordStrategy({
        callbackURL: hostName + 'login/discord/return',
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        proxy: true,
        scope: scopes
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            db_1["default"].createUser(profile, 'discord')
                .then(function (user) {
                return done(null, user);
            });
        });
    }));
    app.use(cookieParser());
    app.use(session({
        cookie: {
            httpOnly: false
        },
        resave: false,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        store: sessionStore
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send({ loggedIn: false });
    }
    app.get('/login/discord', passport.authenticate('discord'));
    app.get('/login/discord/return', passport.authenticate('discord', { failureRedirect: '/login' }), function (req, res) {
        console.log('successful auth return');
        res.redirect('/home');
    });
    app.get('/auth/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/user/info', checkAuth, function (req, res) {
        console.log('user requested info');
        console.log(req.user);
        res.json({ loggedIn: true, user: req.user });
    });
    app.post('/account/create', function (req, res) {
        console.log('user created info');
        console.log(req.body.email);
    });
}
function InitializePassportSocket(io, sessionStore) {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        secret: process.env.SESSION_SECRET,
        key: 'connect.sid',
        store: sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));
}
function onAuthorizeSuccess(data, accept) {
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
}
function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    console.log(error);
    console.log('FAILED CONNECTION TO SOCKET.IO: ' + message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
}
module.exports = {
    WebAuth: InitializePassportWeb,
    SocketAuth: InitializePassportSocket
};
