const express = require('express');
const app = express();
const bodyParser = require('body-parser')
let DataBase = require('./db/db.js');
require('dotenv').config()


function setup(port) {
    console.log("Meraki Web starting on port:" + port);
    const db = new DataBase();
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
                res.sendStatus(500)
            });
    });

    app.post('/api/room', function(req, res) {
        console.log(req.body);
        db.createRoom(req.body)
            .then(room => {
                console.log('successfully created room with name: ' + room.name);
                res.json(room);
            })
            .catch(error => {
                console.error("API CALL FAILED: Failed to create room with name" + req.params.name);
                res.sendStatus(500)
            })
    });


    app.listen(port);
}


module.exports = {
    setup: setup
}