const express = require('express');
const app = express();
const bodyParser = require('body-parser')
let db = require('../db/db.js');
require('dotenv').config()


function setup(port) {
    console.log("Meraki Web starting on port:" + port);
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    // respond with "hello world" when a GET request is made to the homepage
    app.get('/api/hello', function (req, res) {       
        res.send("hello");
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
        console.log(req.body);
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
        db.createUser(req.body)
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
                console.log('successfully added user with name: ' + response.userName + ' to room: ' + response.roomId);
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
    app.post('/api/room/queue', function(req, res) {
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

    app.listen(port);
}

module.exports = {
    setup: setup
}