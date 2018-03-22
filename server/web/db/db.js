"use strict";

require('dotenv').config();
var mongoose = require('mongoose');
var Room     = require('./models/room');

class DataBase {

    constructor() {
        var uri = process.env.MONGO_CONNECTION_STRING;
        console.log("Connecting to mongodb: " + uri);
        let db = mongoose.connect(uri);
    }


    close() {
        dbClient.close();
    }

    getRoomById(roomId) {
        console.log("Serving API request to find room with id: " + roomId);
        return new Promise((resolve, reject) => {
            Room.findById(roomId, function(err, room) {
                console.log(err);
                if (err) reject(err);
                console.log('found room ' + room);
                resolve(room);
            })
        });
    }

    createRoom(roomRequest) {
        console.log("Serving API request to create room with name: " + roomRequest.name);
        return new Promise((resolve, reject) => {
            var room = new Room({
                name: roomRequest.name, 
                description: roomRequest.description
            });
            room.save(function(err) {
                if (err) reject(err);
            })
            resolve(room);
        });
    }
}

module.exports = DataBase;
