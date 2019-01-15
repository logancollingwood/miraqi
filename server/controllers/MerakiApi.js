const fetchVideoInfo = require('youtube-info');
const TIME_FORMAT = "MM YY / h:mm:ss a";
const QueueUtil = require('./QueueUtil.js');
const DB = require('../db/db.js');



function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

class MerakiApi {

    static async getOrCreateUser(userName, profile, loginProviderType) {
        let user = await DB.createOauthUser(userName, profile, loginProviderType);
        return user;
    }


    static createSocketUserAndAddToRoom(socketId, roomId) {
        return new Promise((resolve, reject) => {
            DB.createUser(socketId)
                .then(newUser => {
                    DB.addUserToRoom(newUser._id, roomId)
                        .then(data => {
                            const { user, room } = data;
                            resolve(data);
                        })
                        .catch(err => { reject(err) });
                })
                .catch(error => reject(error));
        });
    }

    static setSocketUserName(userId, name) {
        return new Promise((resolve, reject) => {
            DB.updateUserName(userId, name)
                .then(user => {
                    this.user = user;
                    resolve(user);
                });
        });
    }




    static IsUsernameAdmin(userName) {
        return userName.toUpperCase() === 'logan'.toUpperCase();
    }

    static sendMessageToRoom(roomId, userId, message) {
        return new Promise((resolve, reject) => {
            const isPlayCommand = message.startsWith("!play");

            if (isPlayCommand) {
                const playUrl = message.split(" ")[1];
                const vidId = ytVidId(playUrl);
                if (vidId) {
                    if (roomId && userId) {
                        fetchVideoInfo(vidId, function (err, videoInfo) {
                            if (videoInfo == null) {
                                return;
                            }
                            let queueItem = {
                                url: playUrl,
                                userId: userId,
                                roomId: roomId,
                                trackName: videoInfo.title,
                                lengthSeconds: videoInfo.duration,
                                type: 'yt',
                            }
                            DB.addQueueItem(queueItem)
                                .then(data => {
                                    resolve({
                                        isPlay: true,
                                        first: data.isFirstSong,
                                        queueItem: queueItem,
                                        queue: data.queue,
                                    })
                                })
                                .catch(err2 => console.log(err2));
                        });
                    }
                }
            } else {
                resolve({isPlay: false, message: message});
                io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);
            }
        });
    }

    static getNextTrack(roomId) {
        return new Promsise((resolve, reject) => {
            DB.getFirstQueueItem(roomId)
                .catch(error => {
                    reject(error);
                })
        });
    }


    static  removeUserFromRoom(userId, roomId) {
        return new Promise((resolve, reject) => {
            DB.removeUserFromRoom(userId, roomId)
                .then(usersInRoom => {
                    resolve(usersInRoom.users);
                })
                .catch(error => reject(error));
        })
    }

    static addUserToRoom(userId, roomId) {
        const api = this;
        return new Promise((resolve, reject) => {
            DB.addUserToRoom(userId, roomId)
                .then(({user, room}) => {
                    let nowPlaying;
                    if (room.queue.length > 0) {
                        nowPlaying = room.queue[0];
                    }
                    api.getTopRoomStats(room._id, 5)
                        .then(stats => {
                            resolve({userAddedToRoom: user, room: room, nowPlaying: nowPlaying, stats: stats});
                        })
                        .catch(err => reject(err));
                })
                .catch(err => {reject(err)});
        })
    }

    static async getTopRoomStats(roomId, numStats) {
        return DB.getTopStats(roomId, numStats);
    }

}


module.exports = MerakiApi;