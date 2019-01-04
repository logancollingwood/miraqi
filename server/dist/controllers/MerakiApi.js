var fetchVideoInfo = require('youtube-info');
var TIME_FORMAT = "MM YY / h:mm:ss a";
var QueueUtil = require('./QueueUtil.js');
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
var MerakiApi = /** @class */ (function () {
    function MerakiApi(db, socketSession) {
        this.db = db;
        this.socketSession = socketSession;
    }
    MerakiApi.prototype.getOrCreateUser = function (userName, profile, loginProviderType) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.createOauthUser(userName, profile, loginProviderType)
                .then(function (user) {
                resolve(user);
            })
                .catch(function (error) { return reject(error); });
        });
    };
    MerakiApi.prototype.createSocketUserAndAddToRoom = function (socketId, roomId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.createUser(socketId)
                .then(function (newUser) {
                db.addUserToRoom(newUser._id, roomId)
                    .then(function (data) {
                    var user = data.user, room = data.room;
                    resolve(data);
                })
                    .catch(function (err) { reject(err); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    MerakiApi.prototype.setSocketUserName = function (userId, name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.updateUserName(userId, name)
                .then(function (user) {
                _this.user = user;
                resolve(user);
            });
        });
    };
    MerakiApi.prototype.IsUsernameAdmin = function (userName) {
        return userName.toUpperCase() === 'logan'.toUpperCase();
    };
    MerakiApi.prototype.sendMessageToRoom = function (roomId, userId, message) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var isPlayCommand = message.startsWith("!play");
            if (isPlayCommand) {
                var playUrl_1 = message.split(" ")[1];
                var vidId = ytVidId(playUrl_1);
                if (vidId) {
                    if (roomId && userId) {
                        fetchVideoInfo(vidId, function (err, videoInfo) {
                            if (videoInfo == null) {
                                return;
                            }
                            var queueItem = {
                                url: playUrl_1,
                                userId: userId,
                                roomId: roomId,
                                trackName: videoInfo.title,
                                lengthSeconds: videoInfo.duration,
                                type: 'yt',
                            };
                            self.db.addQueueItem(queueItem)
                                .then(function (data) {
                                resolve({
                                    isPlay: true,
                                    first: data.isFirstSong,
                                    queueItem: queueItem,
                                    queue: data.queue,
                                });
                            })
                                .catch(function (err2) { return console.log(err2); });
                        });
                    }
                }
            }
            else {
                resolve({ isPlay: false, message: message });
                io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);
            }
        });
    };
    MerakiApi.prototype.getNextTrack = function (roomId) {
        var _this = this;
        return new Promsise(function (resolve, reject) {
            _this.db.getFirstQueueItem(roomId)
                .catch(function (error) {
                reject(error);
            });
        });
    };
    MerakiApi.prototype.removeUserFromRoom = function (userId, roomId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.removeUserFromRoom(userId, roomId)
                .then(function (usersInRoom) {
                resolve(usersInRoom.users);
            })
                .catch(function (error) { return reject(error); });
        });
    };
    MerakiApi.prototype.addUserToRoom = function (userId, roomId) {
        var _this = this;
        var api = this;
        return new Promise(function (resolve, reject) {
            _this.db.addUserToRoom(userId, roomId)
                .then(function (_a) {
                var user = _a.user, room = _a.room;
                var nowPlaying;
                if (room.queue.length > 0) {
                    nowPlaying = room.queue[0];
                }
                api.getTopRoomStats(room._id, 5)
                    .then(function (stats) {
                    resolve({ userAddedToRoom: user, room: room, nowPlaying: nowPlaying, stats: stats });
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) { reject(err); });
        });
    };
    MerakiApi.prototype.getTopRoomStats = function (roomId, numStats) {
        return this.db.getTopStats(roomId, numStats);
    };
    return MerakiApi;
}());
module.exports = MerakiApi;
//# sourceMappingURL=MerakiApi.js.map