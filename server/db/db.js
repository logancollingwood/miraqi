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

    createOauthUser(userName, profile, loginProviderType) {
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({loginProviderId: profile.id, loginProviderType: loginProviderType}, {expire: new Date()}, { upsert: true }, function(error, result) {
                if (!result) {
                    console.log('new user');
                    var user = new Models.User({
                        admin: false,
                        loginProviderId: profile.id,
                        loginProviderType: loginProviderType,
                        userName: userName,
                        lastLogin: new Date(),
                        profile: profile
                    });
                } else {
                    user = result;
                    user.lastLogin = new Date();
                }
                user.save(function (err) {
                    if (err) reject(err);
                    resolve(user);
                });
            });
        });
    }

    createUser(profile, loginProviderType) {
        console.log('creating passport user');
        console.log(profile);
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({loginProviderType: loginProviderType, loingProviderId: profile.id, profile: profile}, {expire: new Date()}, { upsert: true }, function(error, result) {
                if (!result) {
                    var user = new Models.User({
                        loginProviderType: loginProviderType,
                        loginProviderId: profile.id,
                        profile: profile,
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

    createRoom(request) {
        console.log("Serving API request to create room with name: " + request.name);
        return new Promise((resolve, reject) => {
            let roomRequest = {
                name: request.name,
                roomProviderId: request.roomProviderId,
                roomProviderType: request.roomProviderType
            }
            
            Models.Room.findOneAndUpdate(roomRequest, {expire: new Date()}, { upsert: true }, function(error, result) {
                if (!result) {
                    var room = new Models.Room(roomRequest);
                } else {
                    room = result;
                }

                room.save(function (err) {
                    if (err) reject(err);
                    resolve(room);
                });
            });
        });
    }

    /**
     * Adds a user to a room
     * @param {roomId, userId} addUserToRoomRequest 
     */
    addUserToRoom(userId, roomId) {
        let self = this;
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                if (err) reject(err);
                if (user == null) {
                    reject(`No user found with id ${userId}`);
                }
                self.createRoom({
                    name: 'test',
                    roomProviderId: roomId,
                    roomProviderType: 'discord'
                }).then(room => {
                    console.log(`updated room ${room._id} and added user ${user._id}`)
                    Models.Room.findByIdAndUpdate(room._id, {'users': {'$push': user}},{'new': true}, function(err, room) {
                        resolve({
                            user: user,
                            room: room});
                        });
                }).catch((err) => {
                    reject(err);
                })
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
     * @param {url, userId, roomId, trackName, type, lengthSeconds} addQueueItemRequest 
     */
    addQueueItem(addQueueItemRequest) {
        return new Promise((resolve, reject) => {
            const url = addQueueItemRequest.url;
            const userId = addQueueItemRequest.userId;
            const roomId = addQueueItemRequest.roomId;
            const trackName = addQueueItemRequest.trackName;
            const type = addQueueItemRequest.type;
            const lengthSeconds = addQueueItemRequest.lengthSeconds;
            var queueItem = new Models.QueueItem({
                playUrl: url,
                userId: userId,
                trackName: trackName,
                lengthSeconds: lengthSeconds,
                type: type,
                playTime: null
            });
            Models.Room.findByIdAndUpdate(
                roomId,
                { $push: { queue: queueItem } },
                { new: true },
                function (err, model) {
                    if (err) reject(err);
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
                        resolve({
                            queue: model.queue,
                            isFirstSong: isFirstSong,
                            queueItem: queueItem,
                            timeTillPlay: timeTillPlay
                        });
                    } else {
                        firstQueueItem.playTime = new Date();
                        console.log('model');
                        console.log(model);
                        model.queue[0] = firstQueueItem;
                        console.log('new model');
                        console.log(model);
                        model.save(function(error, room) {
                            console.log(`added new queueItem which will be played in ${timeTillPlay}`);
                            console.log(room);
                            let newQueueItem = room.queue[0];
                            console.log(newQueueItem);
                            resolve({
                                queue: model.queue,
                                isFirstSong: isFirstSong,
                                queueItem: newQueueItem,
                                timeTillPlay: timeTillPlay
                            });
                            return;
                        });
                    }

                }
            );
        });
    }

    /**
     * Returns the top of the queue and
     *   then permanently removes the item from the queue.
     * @param {*} roomId 
     */
    popAndGetNextQueueItem(roomId) {
        return new Promise((resolve, reject) => {
            console.log(`grabbing and popping next queue with roomId:${roomId}`);
            Models.Room.findById(roomId, function (err, room) {
                if (err) {
                    reject(err);
                }

                if (!room) {
                    console.log('uh oh, no room found');
                }

                const queue = room.queue;
                // if queue is empty, return empty queue
                if (queue.length === 0) resolve({queue: queue});
               
                // Pop the queue, and then save the room
                queue.shift();
               
                room.save()
                    .then(room => {
                        // The queueItem we want is now on top
                        let queueItem = room.queue.shift();
                        if (queueItem === undefined || queueItem === null) {
                            resolve(null);
                            return;
                        }
                        queueItem.playTime = new Date();
                        room.queue.unshift(queueItem);
                        queueItem.save(function(error, queueItem) {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            resolve({queueItem: queueItem, queue: room.queue});
                        });
                        
                    })  
                    .catch(error => {
                        console.log(error);
                        console.log(`unable to pop top of room queue on db`);
                    });                


            });
        });
    }


    /**
     * Simply returns the top of the queue
     * @param {the roomId of the room to grab the top of the queue for} roomId 
     */
    getNextQueueItem(roomId) {
        return new Promise((resolve, reject) => {
            console.log(`grabbing next queue with roomId:${roomId}`);
            Models.Room.findById(roomId, function (err, room) {
                if (err) {
                    reject(err);
                }

                if (!room) {
                    console.log('uh oh, no room found');
                }

                const queue = room.queue;
                // if queue is empty, return empty queue
                if (queue.length === 0) resolve({queue: queue});

                let queueItem = queue.shift();
                resolve(queueItem);
            });
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
