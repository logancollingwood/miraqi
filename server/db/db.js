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
                console.log(`found room ${room}`);
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

    createUser(name, isAdmin) {
        if (name == null || isAdmin == null) {
            return;
        }
        return new Promise((resolve, reject) => {
            var user = new Models.User({
                name: name, 
                admin: isAdmin,
                lastLogin: new Date(),
            });
            user.save(function(err) {
                if (err) reject(err);
                resolve(user);
            })
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
                resolve(room);
            })
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
                console.log(`found user ${user.name}`);
                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $addToSet: { users: user } },
                    {new: true},
                    function(err, room) {
                        if (err) {
                            reject(err);
                        }
                        console.log(`updated room ${room._id} and added user ${user.name}`)
                        resolve({
                            user: user,
                            room: room
                        });
                    }
                );
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
                    {new: true},
                    function(err, room) {
                        if (err) reject(err)
                        console.log(`updated room and removed user ${room._id}`)
                        resolve({
                            user: user,
                            room: room
                        });
                    }
                );
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
        });
        // return new Promise((resolve, reject) => {
        //     Models.Room.findById(roomId, function(err, room) {
        //         if (err) reject(err);
                
        //         var queueItem = new Models.QueueItem({
        //                 playUrl: url,
        //                 userId: userId,
        //         });
                
        //         Models.Room.findByIdAndUpdate(
        //             roomId,
        //             { $push: { queue: queueItem } },
        //             function(err, model) {
        //                 if (err) reject(err);
        //                 console.log(model);
        //                 resolve(model);
        //             }
        //         );
        //     })
        // });
    }

    /**
     * 
     * @param {url, userId, roomId} addQueueItemRequest 
     */
    addMessageToRoom(roomId, userId, msgString) {
        if (roomId == null || userId == null || msgString == null) {
            return new Promise((resolve, reject) => {reject('Validate Params')});
        };


        return new Promise((resolve, reject) => {
            var messageItem = new Models.Message({
                message: msgString,
                userId: userId,
            });
            Models.Room.findByIdAndUpdate(
                roomId,
                { $push: { messages: messageItem } },
                function(err, model) {
                    console.log('error');
                    console.log(err);
                    if (err) reject(err);
                    console.log(model);
                    resolve(model);
                }
            );
        });
    }

    clearQueue(roomId, userId) {
        
    }
}

module.exports = new DataBase();
