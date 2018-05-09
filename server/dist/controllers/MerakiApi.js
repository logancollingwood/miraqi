'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetchVideoInfo = require('youtube-info');
var dj = require('./Dj.js');
var TIME_FORMAT = "MM YY / h:mm:ss a";
var QueueUtil = require('./QueueUtil.js');

var MerakiApi = function () {
    function MerakiApi(db) {
        _classCallCheck(this, MerakiApi);

        this.db = db;
    }

    _createClass(MerakiApi, [{
        key: 'getOrCreateUser',
        value: function getOrCreateUser(userName, profile, loginProviderType) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.db.createOauthUser(userName, profile, loginProviderType).then(function (user) {
                    resolve(user);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }
    }, {
        key: 'createSocketUserAndAddToRoom',
        value: function createSocketUserAndAddToRoom(socketId, roomId) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.db.createUser(socketId).then(function (user) {
                    db.addUserToRoom(user._id, roomId).then(function (data) {
                        var user = data.user,
                            room = data.room;

                        resolve(data);
                    }).catch(function (err) {
                        reject(err);
                    });
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }
    }, {
        key: 'setSocketUserName',
        value: function setSocketUserName(userId, name) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.db.updateUserName(userId, name).then(function (user) {
                    _this3.user = user;
                    resolve(user);
                });
            });
        }
    }, {
        key: 'IsUsernameAdmin',
        value: function IsUsernameAdmin(userName) {
            return userName.toUpperCase() == 'logan'.toUpperCase();
        }
    }, {
        key: 'sendMessageToRoom',
        value: function sendMessageToRoom(roomId, userId, message) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var isPlayCommand = message.startsWith("!play");

                if (isPlayCommand) {
                    var playUrl = message.split(" ")[1];
                    var vidId = dj.ytVidId(playUrl);
                    if (vidId) {
                        if (roomId && userId) {
                            fetchVideoInfo(vidId, function (err, videoInfo) {
                                if (videoInfo == null) return;
                                var queueItem = {
                                    url: playUrl,
                                    userId: userId,
                                    roomId: roomId,
                                    trackName: videoInfo.title,
                                    lengthSeconds: videoInfo.duration,
                                    type: 'yt'
                                };
                                self.db.addQueueItem(queueItem).then(function (data) {
                                    resolve({
                                        isPlay: true,
                                        first: data.isFirstSong,
                                        playUrl: playUrl,
                                        queue: data.queue
                                    });
                                }).catch(function (err) {
                                    return console.log(err);
                                });
                            });
                        }
                    }
                } else {
                    resolve({ isPlay: false, message: message });
                    io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);
                }
            });
        }
    }, {
        key: 'removeUserFromRoom',
        value: function removeUserFromRoom(userId, roomId) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.db.removeUserFromRoom(userId, roomId).then(function (usersInRoom) {
                    resolve(usersInRoom.users);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }
    }, {
        key: 'addUserToRoom',
        value: function addUserToRoom(userId, roomId) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                _this5.db.addUserToRoom(userId, roomId).then(function (_ref) {
                    var user = _ref.user,
                        room = _ref.room;

                    resolve({ user: user, room: room });
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }]);

    return MerakiApi;
}();

module.exports = MerakiApi;