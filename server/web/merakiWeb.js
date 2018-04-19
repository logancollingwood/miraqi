const express = require('express');
const app = express();
const bodyParser = require('body-parser')
let db = require('../db/db.js');
const passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
let session = require('express-session');
var cors = require('cors');

require('dotenv').config()


var scopes = ['identify', 'email', 'guilds'];
    
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/login/discord/return',
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

function setup(port) {
    console.log("Meraki Web starting on port:" + port);

    app.use(bodyParser.json());
    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.send('not logged in :(');
    }

    app.get('/login/discord', passport.authenticate('discord'));

    app.get('/login/discord/return', passport.authenticate('discord', {failureRedirect: '/login'}),
        function(req, res) {
            res.redirect('http://localhost:3000/home');
        }
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('http://localhost:3000/');
    });
    app.get('/user/info', checkAuth, function(req, res) {
        console.log('searching for user');
        res.json(req.user);
    });

    app.get('/api/room/:id', function(req, res) {
        db.getRoomById(req.params.id)
            .then(room => {
                console.log('returning room with id: ' + room._id);
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to find room with id" + req.params.id);
                res.json({});
            });
    });

    app.post('/api/room', function(req, res) {
        db.createRoom(req.body)
            .then(room => {
                console.log('successfully created room with name: ' + room.name);
                console.log(room);
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to create room with name" + req.params.name);
                res.sendStatus(500)
            })
    });

    app.get('/api/user/:id', function(req, res) {
        db.getUserById(req.params.id)
            .then(user => {
                console.log('returning user with id: ' + user._id);
                res.json(user);
            })
            .catch(error => {
                res.json({});
            });
    });

    app.post('/api/user', function(req, res) {
        console.log(req.body);
        db.createUser(req.body.name, false)
            .then(user => {
                console.log('successfully created user with name: ' + user.name);
                res.json(user);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to create user with name" + req.body.name);
                res.sendStatus(500)
            })
    });


    app.post('/api/room/adduser', function(req, res) {
        console.log(req.body);
        db.addUserToRoom(req.body)
            .then(response => {
                console.log('successfully added user with name: ' + response.user.name + ' to room: ' + response.room._id);
                res.json(response);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to add user with userid " + req.body.userId + ' to room' + req.body.roomId);
                res.sendStatus(500)
            })
    });

    app.post('/api/room/removeuser', function(req, res) {
        console.log(req.body);
        db.removeUserFromRoom(req.body)
            .then(response => {
                console.log('successfully removed user with name: ' + response.userName + ' from room: ' + response.roomId);
                res.json(response);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to remove user with userid " + req.body.userId + ' from room' + req.body.roomId);
                res.sendStatus(500)
            })
    });

    /**
     * POST: {
     *  url: url,
     *  userId: User Id of Requester
     * }
     */
    app.post('/api/room/queueItem', function(req, res) {
        console.log('Adding queue item');
        console.log(req.body);
        db.addQueueItem(req.body)
            .then(room => {
                console.log(room)
                console.log('successfully added queue item with url ' + room.name + ' to room: ' + room._id);
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to queue url " + req.body.url + ' to room ' + req.body.roomId);
                res.sendStatus(500)
            })
    });

    app.post('/api/room/addMessageToRoom', function(req, res) {
        console.log('Adding message item');
        console.log(req.body);
        const request = req.body;
        db.addMessageToRoom(request.roomId, request.userId, request.msg)
            .then(room => {
                console.log('hi')
                console.log(room)
                console.log('successfully added message item with msg ' + req.body.msg + ' to room: ' + room._id);
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed add message " + req.body.msg + ' to room ' + req.body.roomId);
                res.sendStatus(500)
            })
    });

    app.post('/api/room/clearqueue', function(req, res) {
        console.log('clearing queue for room ' +  req.body.roomId + ' for user ' + req.body.userId);
        db.clearQueue(req.body.roomId, req.boody.userId)
            .then(room => {
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to queue url " + req.body.url + ' to room ' + req.body.roomId);
                res.sendStatus(500)
            })
    });

    app.listen(port);
}

module.exports = {
    setup: setup
}