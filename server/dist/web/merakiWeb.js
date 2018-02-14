'use strict';

var express = require('express');
var app = express();
var db = require('./db/db.js');

function setup(port) {
    console.log("Meraki Web starting on port:" + port);

    // respond with "hello world" when a GET request is made to the homepage
    app.get('/api/hello', function (req, res) {

        res.send(data);
    });

    app.get('/api/room/:id', function (req, res) {
        var searchId = req.params.id;
        res.send(db.getRoomById(searchId));
    });

    app.listen(port);
}

module.exports = {
    setup: setup
};