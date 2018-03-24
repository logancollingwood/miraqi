"use strict";

require('dotenv').config();
var mongoose = require('mongoose');
var Models     = require('./models/models');

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
            Models.Room.findById(roomId, function(err, room) {
                console.log(err);
                if (err) reject(err);
                resolve(room);
            })
        });
    }

    getUserById(userId) {
         console.log("Serving API request to find user with id: " + userId);
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function(err, user) {
                console.log(err);
                if (err) reject(err);
                resolve(user);
            })
        });
    }

    createUser(userCreateRequest) {
        return new Promise((resolve, reject) => {
            var user = new Models.User({
                name: userCreateRequest.name, 
                admin: false,
                lastLogin: new Date(),
            });
            user.save(function(err) {
                if (err) reject(err);
            })
            resolve(user);
        });
    }

    createRoom(roomRequest) {
        console.log("Serving API request to create room with name: " + roomRequest.name);
        return new Promise((resolve, reject) => {
            var room = new Models.Room({
                name: roomRequest.name, 
                description: roomRequest.description,
                sourceIp: roomRequest.sourceIp
            });
            room.save(function(err) {
                if (err) reject(err);
            })
            resolve(room);
        });
    }

    /**
     * Adds a user to a room
     * @param {roomId, userId} addUserToRoomRequest 
     */
    addUserToRoom(addUserToRoomRequest) {
        const roomId = addUserToRoomRequest.roomId;
        const userId = addUserToRoomRequest.userId;
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function(err, user) {
                if (err) reject(err);
                
                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $addToSet: { users: user } },
                    function(err, model) {
                        console.log(err);
                    }
                );
                resolve({
                    userName: user.name,
                    roomId: roomId
                });
            })
        });
    }

    /**
     * Removes a user from a room
     * @param {roomId, userId} removeUserFromRoomRequest 
     */
    removeUserFromRoom(removeUserFromRoomRequest) {
        const roomId = removeUserFromRoomRequest.roomId;
        const userId = removeUserFromRoomRequest.userId;
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function(err, user) {
                if (err) reject(err);
                
                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $pull: { users: user } },
                    function(err, model) {
                        console.log(err);
                    }
                );
                resolve({
                    userName: user.name,
                    roomId: roomId
                });
            })
        });
    }

    /**
     * 
     * @param {url, userId, roomId} addQueueItemRequest 
     */
    addQueueItem(addQueueItemRequest) {
        const url = addQueueItemRequest.url;
        const userId = addQueueItemRequest.userId;
        const roomId = addQueueItemRequest.roomId;
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function(err, room) {
                if (err) reject(err);
                
                var queueItem = new Models.QueueItem({
                        playUrl: url,
                        userId: userId,
                });
                
                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $push: { queue: queueItem } },
                    function(err, model) {
                        if (err) reject(err);
                        console.log(model);
                        resolve(model);
                    }
                );
            })
        });
    }
}

module.exports = new DataBase();
