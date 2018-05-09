"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();
var mongoose = require('mongoose');
var Models = require('./models/models');

var DataBase = function () {
    function DataBase(databaseConnection) {
        _classCallCheck(this, DataBase);

        var db = databaseConnection;
    }

    _createClass(DataBase, [{
        key: 'close',
        value: function close() {
            dbClient.close();
        }
    }, {
        key: 'getRoomById',
        value: function getRoomById(roomId) {
            console.log("Serving API request to find room with id: " + roomId);
            return new Promise(function (resolve, reject) {
                Models.Room.findById(roomId, function (err, room) {
                    console.log(err);
                    if (err) reject(err);
                    resolve(room);
                });
            });
        }
    }, {
        key: 'getUserById',
        value: function getUserById(userId) {
            console.log("Serving API request to find user with id: " + userId);
            return new Promise(function (resolve, reject) {
                Models.User.findById(userId, function (err, user) {
                    console.log(err);
                    if (err) reject(err);
                    resolve(user);
                });
            });
        }
    }, {
        key: 'createOauthUser',
        value: function createOauthUser(userName, profile, loginProviderType) {
            return new Promise(function (resolve, reject) {
                Models.User.findOneAndUpdate({ loginProviderId: profile.id, loginProviderType: loginProviderType }, { expire: new Date() }, { upsert: true }, function (error, result) {
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
                        console.log('user already exists');
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
    }, {
        key: 'createUser',
        value: function createUser(profile, loginProviderType) {
            console.log('creating passport user');
            console.log(profile);
            return new Promise(function (resolve, reject) {
                Models.User.findOneAndUpdate({ loginProviderType: loginProviderType, loingProviderId: profile.id, profile: profile }, { expire: new Date() }, { upsert: true }, function (error, result) {
                    if (!result) {
                        var user = new Models.User({
                            loginProviderType: loginProviderType,
                            loginProviderId: profile.id,
                            profile: profile,
                            lastLogin: new Date()
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
    }, {
        key: 'updateUserName',
        value: function updateUserName(userId, name) {
            return new Promise(function (resolve, reject) {
                Models.User.findByIdAndUpdate(userId, { name: name }, { new: true }, function (err, user) {
                    if (err) {
                        console.log('failed to update user with id: ' + userId);
                        reject(err);
                    }
                    console.log('updated user ' + user._id + ', set name:' + user.name);
                    resolve(user);
                });
            });
        }
    }, {
        key: 'createRoom',
        value: function createRoom(request) {
            console.log("Serving API request to create room with name: " + request.name);
            return new Promise(function (resolve, reject) {
                var roomRequest = {
                    name: request.name,
                    roomProviderId: request.roomProviderId,
                    roomProviderType: request.roomProviderType
                };

                Models.Room.findOneAndUpdate(roomRequest, { expire: new Date() }, { upsert: true }, function (error, result) {
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

    }, {
        key: 'addUserToRoom',
        value: function addUserToRoom(userId, roomId) {
            var self = this;
            return new Promise(function (resolve, reject) {
                Models.User.findById(userId, function (err, user) {
                    if (err) reject(err);
                    if (user == null) {
                        reject('No user found with id ' + userId);
                    }
                    console.log('found user ' + user._id);
                    self.createRoom({
                        name: 'test',
                        roomProviderId: roomId,
                        roomProviderType: 'discord'
                    }).then(function (room) {
                        console.log('updated room ' + room._id + ' and added user ' + user._id);
                        Models.Room.findByIdAndUpdate(room._id, { 'users': { '$push': user } }, { 'new': true }, function (err, room) {
                            resolve({
                                user: user,
                                room: room });
                        });
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            });
        }

        /**
         * Removes a user from a room
         * @param {roomId, userId} removeUserFromRoomRequest 
         */

    }, {
        key: 'removeUserFromRoom',
        value: function removeUserFromRoom(userId, roomId) {

            return new Promise(function (resolve, reject) {
                Models.User.findById(userId, function (err, user) {
                    if (err) reject(err);

                    Models.Room.findByIdAndUpdate(roomId, { $pull: { users: user } }, { new: true }, function (err, room) {
                        if (err) reject(err);
                        if (room == null) {
                            reject('room was not found with id: ' + roomId);
                        }
                        console.log('updated room and removed user ' + room._id);
                        console.log(room.users);
                        resolve({
                            users: room.users
                        });
                    });
                });
            });
        }

        /**
         * 
         * @param {url, userId, roomId, trackName, type, lengthSeconds} addQueueItemRequest 
         */

    }, {
        key: 'addQueueItem',
        value: function addQueueItem(addQueueItemRequest) {
            return new Promise(function (resolve, reject) {
                var url = addQueueItemRequest.url;
                var userId = addQueueItemRequest.userId;
                var roomId = addQueueItemRequest.roomId;
                var trackName = addQueueItemRequest.trackName;
                var type = addQueueItemRequest.type;
                var lengthSeconds = addQueueItemRequest.lengthSeconds;
                var queueItem = new Models.QueueItem({
                    playUrl: url,
                    userId: userId,
                    trackName: trackName,
                    lengthSeconds: lengthSeconds,
                    type: type
                });
                Models.Room.findByIdAndUpdate(roomId, { $push: { queue: queueItem } }, { new: true }, function (err, model) {
                    if (err) reject(err);
                    console.log(model);
                    var firstQueueItem = model.queue.length > 0 ? model.queue[0] : null;
                    var isFirstSong = model.queue.length == 1;

                    var timeTillPlay = 0;
                    if (!isFirstSong) {

                        // Sum up the length of all the songs in the queue 
                        // except the new one
                        model.queue.map(function (item) {
                            if (item._id !== queueItem._id) {
                                timeTillPlay += item.lengthSeconds;
                            }
                        });

                        // Now, calculate the time that has passed since the currently playing item
                        // and subtract that from the time until next play
                        var timeSinceFirstQueueItem = 0;
                        if (firstQueueItem) {
                            var currentTime = new Date().getTime();
                            var firstQueuedItemAt = new Date(firstQueueItem.createdAt).getTime();
                            timeSinceFirstQueueItem = (currentTime - firstQueuedItemAt) / 1000;
                        }

                        timeTillPlay -= timeSinceFirstQueueItem;
                    }
                    console.log('added new queueItem which will be played in ' + timeTillPlay);
                    resolve({
                        queue: model.queue,
                        isFirstSong: isFirstSong,
                        queueItem: queueItem,
                        timeTillPlay: timeTillPlay
                    });
                });
            });
        }

        /**
         * 
         * @param {url, userId, roomId} addQueueItemRequest 
         */

    }, {
        key: 'addMessageToRoom',
        value: function addMessageToRoom(roomId, userId, msgString) {
            if (roomId == null || userId == null || msgString == null) {
                return new Promise(function (resolve, reject) {
                    reject('Validate Params');
                });
            };

            return new Promise(function (resolve, reject) {
                var messageItem = new Models.Message({
                    message: msgString,
                    userId: userId
                });
                Models.Room.findByIdAndUpdate(roomId, { $push: { messages: messageItem } }, function (err, model) {
                    console.log('error');
                    console.log(err);
                    if (err) reject(err);
                    console.log(model);
                    resolve(model);
                });
            });
        }
    }, {
        key: 'clearQueue',
        value: function clearQueue(roomId, userId) {}
    }, {
        key: 'getNextSongForRoom',
        value: function getNextSongForRoom(roomId) {
            console.log('db lookup for next track in ' + roomId);
            return new Promise(function (resolve, reject) {
                Models.Room.findById(roomId, function (err, room) {
                    console.log(err);
                    if (err) {
                        reject(err);
                    }

                    var queue = room.queue;
                    if (queue.length === 0) resolve({});
                    console.log(queue);

                    queue.findOne().sort('-insertDate').exec(function (err, queueItem) {
                        if (err) {
                            reject(err);
                        }
                        console.log('found queueItem in roomId: ' + roomId);
                        console.log(queueItem);
                        queue.id(queueItem.id).remove();

                        room.save(function (err) {
                            reject(err);
                        });
                        resolve(queueItem);
                    });

                    resolve({});
                });
            });
        }
    }, {
        key: 'totalQueueLength',
        value: function totalQueueLength(total, queueItem) {
            return total + queueItem.lengthSeconds;
        }
    }]);

    return DataBase;
}();

module.exports = DataBase;