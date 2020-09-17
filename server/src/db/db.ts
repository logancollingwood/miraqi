"use strict";

require('dotenv').config();
var mongoose = require('mongoose');
var Models = require('./models/models');

export default class DataBase {

    static getRoomById(roomId) {
        console.log("Serving API request to find room with id: " + roomId);
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function (err, room) {
                console.log(err);
                if (err) {
                    reject(err);
                }
                resolve(room);
            })
        });
    }

    static getUserById(userId) {
        console.log("Serving API request to find user with id: " + userId);
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                console.log(err);
                if (err) {
                    reject(err);
                }
                resolve(user);
            })
        });
    }

    static createOauthUser(userName, profile, loginProviderType) {
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({loginProviderId: profile.id, loginProviderType: loginProviderType}, {expire: new Date()}, { upsert: true, new: true }, function(error, result) {
                if (!result) {
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
                    user.profile = profile;
                    user.lastLogin = new Date();
                }
                user.save(function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(user);
                });
            });
        });
    }

    static createUser(profile, loginProviderType) {
        console.log('creating passport user');
        console.log(profile);
        return new Promise((resolve, reject) => {
            Models.User.findOneAndUpdate({loginProviderType: loginProviderType, loingProviderId: profile.id, profile: profile}, {expire: new Date()}, { upsert: true, new: true }, function(error, result) {
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
                    if (err) {
                        reject(err);
                    }
                    resolve(user);
                });
            });
        });
    }

    static updateUserName(userId, name) {
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

    static createRoom(request) {
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
                    if (err) {
                        reject(err);
                    }
                    resolve(room);
                });
            });
        });
    }

    /**
     * Adds a user to a room
     * @param {roomId, userId} addUserToRoomRequest 
     */
    static addUserToRoom(userId, roomId) {
        let self = this;
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                if (err) {
                    reject(err);
                }
                if (user == null) {
                    reject(`No user found with id ${userId}`);
                }
                self.createRoom({
                    name: 'test',
                    roomProviderId: roomId,
                    roomProviderType: 'discord'
                }).then((room: any) => {
                    console.log(`updated room ${room._id} and added user ${user._id}`)
                    Models.Room.findByIdAndUpdate(room._id, {'users': {'$push': user}},{'new': true}, function(err2, room2) {
                        resolve({
                            user: user,
                            room: room2});
                        });
                }).catch((err3) => {
                    reject(err3);
                })
            })
        });
    }

    /**
     * Removes a user from a room
     * @param {roomId, userId} removeUserFromRoomRequest 
     */
    static removeUserFromRoom(userId, roomId) {
        
        return new Promise((resolve, reject) => {
            Models.User.findById(userId, function (err, user) {
                if (err) {
                    reject(err);
                }

                Models.Room.findByIdAndUpdate(
                    roomId,
                    { $pull: { users: user } },
                    { new: true },
                    function (err2, room) {
                        if (err2) {
                            reject(err2);
                        }
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
    static addQueueItem(addQueueItemRequest) {
        var db = this;
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
                    if (err) {
                        reject(err);
                    }
                    const firstQueueItem = model.queue.length > 0 ?
                        model.queue[0] : null;
                    let isFirstSong = model.queue.length === 1;

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
                        model.queue[0] = firstQueueItem;
                        model.save(function(error, room) {
                            let newQueueItem = room.queue[0];
                            resolve({
                                queue: model.queue,
                                isFirstSong: isFirstSong,
                                queueItem: newQueueItem,
                                timeTillPlay: timeTillPlay
                            });
                            return;
                        });
                    }
                    db.addRoomStat(queueItem, model._id);
                }
            );
        });
    }


    static getTopStats(roomId, numberOfStats) {
        return new Promise((resolve, reject) => {
            let query = Models.RoomStat.find({roomId: roomId}).sort({'count': -1}).limit(numberOfStats);
            query.exec(function(error, stats) {
                if (error) {
                    console.log(error);
                    reject();
                }
                resolve(stats);
            })
        });
    }

    static addRoomStat(queueItem, roomId) {
        return new Promise((resolve, reject) => {
            Models.RoomStat.find({roomId: roomId, playUrl: queueItem.playUrl}, function(err, roomStat) {
                if (err) {
                    console.log(err);
                    resolve();
                }
                if (roomStat.length === 0) {
                    roomStat = new Models.RoomStat({
                        roomId: roomId,
                        playUrl: queueItem.playUrl,
                        title: queueItem.trackName,
                        type: queueItem.type,
                        count: 1
                    });
                } else {
                    roomStat = roomStat[0];
                    roomStat.count++;
                }

                roomStat.save(function (error, roomStatSaved) {
                    if (error) {
                        console.log(error);
                        resolve();
                    }
                    resolve(roomStat);
                });

            })
        });
    }

    static getQueue(roomId) {
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function (err, room) {
                if (err) {
                    reject(err);
                }

                if (!room) {
                    console.log('uh oh, no room found');
                }
                const queue = room.queue;
                // if queue is empty, return empty queue
                if (queue.length == 0) { 
                    resolve({queue: []}); 
                }
                resolve({queue: queue})
            });
        });
    }

    /**
     * Returns the top of the queue and
     *   then permanently removes the item from the queue.
     * @param {*} roomId 
     */
    static popAndGetNextQueueItem(roomId) {
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
                if (queue.length === 0) { 

                    resolve({queueItem: null, queue: []}); 
                }
               
                // Pop the queue, and then save the room
                queue.shift();
               
                room.save()
                    .then(room2 => {
                        // The queueItem we want is now on top
                        let queueItem = room2.queue.shift();

                        // We just popped the last item off the queue
                        if (queueItem === undefined || queueItem === null) {
                            resolve({queueItem: null, queue: []});
                            return;
                        }
                        queueItem.playTime = new Date();
                        room.queue.unshift(queueItem);
                        queueItem.save(function(error, newQueueItem) {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            resolve({queueItem: newQueueItem, queue: room.queue});
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
    static getNextQueueItem(roomId) {
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
                if (queue.length === 0) { resolve({queue: queue}); }

                let queueItem = queue.shift();
                resolve(queueItem);
            });
        });
    }

    /**
     * 
     * @param {url, userId, roomId} addQueueItemRequest 
     */
    static addMessageToRoom(roomId, userId, msgString) {
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
                    if (err) {
                        reject(err);
                    }
                    resolve(model);
                }
            );
        });
    }

    static getNextSongForRoom(roomId) {
        console.log(`db lookup for next track in ${roomId}`);
        return new Promise((resolve, reject) => {
            Models.Room.findById(roomId, function (err, room) {
                console.log(err);
                if (err) {
                    reject(err);
                }

                const queue = room.queue;
                if (queue.length === 0) { resolve({}); }
                console.log(queue);

                queue.findOne().sort('-insertDate').exec(function (findQueueIssue, queueItem) {
                    if (findQueueIssue) {
                        reject(findQueueIssue);
                    }
                    console.log(`found queueItem in roomId: ${roomId}`);
                    console.log(queueItem);
                    queue.id(queueItem.id).remove();

                    room.save(function (roomSaveError) {
                        reject(roomSaveError);
                    });
                    resolve(queueItem);
                });

                resolve({});
            })
        });
    }



    static totalQueueLength(total, queueItem) {
        return total + queueItem.lengthSeconds;
    }



}

module.exports.DataBase = DataBase;