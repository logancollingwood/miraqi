"use strict";

require('dotenv').config();
var mongoose = require('mongoose');
var Models = require('./models/models');

class DataBase {

    constructor(databaseConnection) {
        const db = databaseConnection;
    }


    close() {
        dbClient.close();
    }

    getRoomById(roomId) {
        console.log("Serving API request to find room with id: " + roomId);
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function (err, room) {
                console.log(err);
                if (err) reject(err);
                resolve(room);
            })
        });
    }

    getUserById(userId) {
        console.log("Serving API request to find user with id: " + userId);
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                console.log(err);
                if (err) reject(err);
                resolve(user);
            })
        });
    }

    createOauthUser(userName, providerLoginId, loginProviderType) {
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({providerLoginId: providerLoginId, loginProviderType: loginProviderType}, {expire: new Date()}, { upsert: true }, function(error, result) {
                console.log('found result');
                console.log(result);
                if (!result) {
                    var user = new Models.User({
                        admin: false,
                        providerLoginId: providerLoginId,
                        loginProviderType: loginProviderType,
                        lastLogin: new Date(),
                    });
                } else {
                    console.log('user already exists');
                    user = result;
                    user.lastLogin = new Date();
                }
                console.log(user);

                user.save(function (err) {
                    if (err) reject(err);
                    resolve(user);
                });
            });
        });
    }

    createUser(isAdmin, profile) {
        console.log('creating passport user');
        console.log(isAdmin);
        console.log(profile);
        if (isAdmin == null) {
            isAdmin = false;
        }
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({discordId: profile.id}, {expire: new Date()}, { upsert: true }, function(error, result) {
                console.log('found result');
                console.log(result);
                if (!result) {
                    var user = new Models.User({
                        admin: isAdmin,
                        discordId: profile.id,
                        lastLogin: new Date(),
                    });
                } else {
                    console.log('user already exists');
                    user = result;
                    user.lastLogin = new Date();
                }
                console.log(user);

                user.save(function (err) {
                    if (err) reject(err);
                    resolve(user);
                });
            });
        });
    }

    updateUserName(userId, name) {
        return new Promise((resolve, reject) => {
            Models.User.findByIdAndUpdate(
                userId,
                { name: name },
                { new: true },
                function (err, user) {
                    if (err) {
                        console.log(`failed to update user with id: ${userId}`);
                        reject(err);
                    }
                    console.log(`updated user ${user._id}, set name:${user.name}`);
                    resolve(user);
                }
            );
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
            room.save(function (err) {
                if (err) reject(err);
                resolve(room);
            })
        });
    }

    /**
     * Adds a user to a room
     * @param {roomId, userId} addUserToRoomRequest 
     */
    addUserToRoom(userId, roomId) {
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                if (err) reject(err);
                if (user == null) {
                    reject(`No user found with id ${userId}`);
                }
                console.log(`found user ${user._id}`);

                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $addToSet: { users: user } },
                    { new: true },
                    function (err, room) {
                        if (err) {
                            reject(err);
                        }
                        console.log(`updated room ${room._id} and added user ${user._id}`)
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
    removeUserFromRoom(userId, roomId) {
        
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                if (err) reject(err);

                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $pull: { users: user } },
                    { new: true },
                    function (err, room) {
                        if (err) reject(err);
                        if (room == null) {
                            reject(`room was not found with id: ${roomId}`);
                        }
                        console.log(`updated room and removed user ${room._id}`)
                        console.log(room.users);
                        resolve({
                            users: room.users
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
        const trackName = addQueueItemRequest.trackName;
        const type = addQueueItemRequest.type;
        const lengthSeconds = addQueueItemRequest.lengthSeconds;
        console.log(`adding queue item`);
        console.log(addQueueItemRequest);
        return new Promise((resolve, reject) => {

            var queueItem = new Models.QueueItem({
                playUrl: url,
                userId: userId,
                trackName: trackName,
                lengthSeconds: lengthSeconds,
                type: type
            });
            Models.Room.findByIdAndUpdate(
                roomId,
                { $push: { queue: queueItem } },
                { new: true },
                function (err, model) {
                    if (err) reject(err);
                    console.log(model);
                    const firstQueueItem = model.queue.length > 0 ?
                        model.queue[0] : null;
                    let isFirstSong = model.queue.length == 1;

                    let timeTillPlay = 0;
                    if (!isFirstSong) {

                        // Sum up the length of all the songs in the queue 
                        // except the new one
                        model.queue.map((item) => {
                            if (item._id !== queueItem._id) {
                                timeTillPlay += item.lengthSeconds;
                            }
                        });

                        // Now, calculate the time that has passed since the currently playing item
                        // and subtract that from the time until next play
                        let timeSinceFirstQueueItem = 0;
                        if (firstQueueItem) {
                            let currentTime = new Date().getTime();
                            let firstQueuedItemAt = new Date(firstQueueItem.createdAt).getTime();
                            timeSinceFirstQueueItem = (currentTime - firstQueuedItemAt) / 1000;
                        }

                        timeTillPlay -= timeSinceFirstQueueItem;
                    }
                    console.log(`added new queueItem which will be played in ${timeTillPlay}`);
                    resolve({
                        queue: model.queue,
                        isFirstSong: isFirstSong,
                        queueItem: queueItem,
                        timeTillPlay: timeTillPlay
                    });
                }
            );
        });
    }

    /**
     * 
     * @param {url, userId, roomId} addQueueItemRequest 
     */
    addMessageToRoom(roomId, userId, msgString) {
        if (roomId == null || userId == null || msgString == null) {
            return new Promise((resolve, reject) => { reject('Validate Params') });
        };


        return new Promise((resolve, reject) => {
            var messageItem = new Models.Message({
                message: msgString,
                userId: userId,
            });
            Models.Room.findByIdAndUpdate(
                roomId,
                { $push: { messages: messageItem } },
                function (err, model) {
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

    getNextSongForRoom(roomId) {
        console.log(`db lookup for next track in ${roomId}`);
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function (err, room) {
                console.log(err);
                if (err) {
                    reject(err);
                }

                const queue = room.queue;
                if (queue.length === 0) resolve({});
                console.log(queue);

                queue.findOne().sort('-insertDate').exec(function (err, queueItem) {
                    if (err) {
                        reject(err);
                    }
                    console.log(`found queueItem in roomId: ${roomId}`);
                    console.log(queueItem);
                    queue.id(queueItem.id).remove();

                    room.save(function (err) {
                        reject(err);
                    });
                    resolve(queueItem);
                });

                resolve({});
            })
        });
    }



    totalQueueLength(total, queueItem) {
        return total + queueItem.lengthSeconds;
    }



}

module.exports = DataBase;
