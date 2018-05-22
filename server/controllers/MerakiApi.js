const fetchVideoInfo = require('youtube-info');
const TIME_FORMAT = "MM YY / h:mm:ss a";
const QueueUtil = require('./QueueUtil.js');


function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

class MerakiApi {


    constructor(db, socketSession) {
        this.db = db;
        this.socketSession = socketSession;
    }

    getOrCreateUser(userName, profile, loginProviderType) {
        return new Promise((resolve, reject) => {
            this.db.createOauthUser(userName, profile, loginProviderType)
                .then(user => {
                    resolve(user);
                })
                .catch(error => reject(error));
        })
    }


    createSocketUserAndAddToRoom(socketId, roomId) {
        return new Promise((resolve, reject) => {
            this.db.createUser(socketId)
                .then(user => {
                    db.addUserToRoom(user._id, roomId)
                        .then(data => {
                            const { user, room } = data;
                            resolve(data);
                        })
                        .catch(err => { reject(err) });
                })
                .catch(error => reject(error));
        });
    }

    setSocketUserName(userId, name) {
        return new Promise((resolve, reject) => {
            this.db.updateUserName(userId, name)
                .then(user => {
                    this.user = user;
                    resolve(user);
                });
        });
    }


    IsUsernameAdmin(userName) {
        return userName.toUpperCase() == 'logan'.toUpperCase();
    }

    sendMessageToRoom(roomId, userId, message) {
        let self = this;
        return new Promise((resolve, reject) => {
            const isPlayCommand = message.startsWith("!play");

            if (isPlayCommand) {
                const playUrl = message.split(" ")[1];
                const vidId = ytVidId(playUrl);
                if (vidId) {
                    if (roomId && userId) {
                        fetchVideoInfo(vidId, function (err, videoInfo) {
                            if (videoInfo == null) return;
                            let queueItem = {
                                url: playUrl,
                                userId: userId,
                                roomId: roomId,
                                trackName: videoInfo.title,
                                lengthSeconds: videoInfo.duration,
                                type: 'yt',
                            }
                            self.db.addQueueItem(queueItem)
                                .then(data => {
                                    resolve({
                                        isPlay: true,
                                        first: data.isFirstSong,
                                        queueItem: queueItem,
                                        queue: data.queue,
                                    })
                                })
                                .catch(err => console.log(err));
                        });
                    }
                }
            } else {
                resolve({isPlay: false, message: message});
                io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);
            }
        });
    }

    getNextTrack(roomId) {
        return new Promsise((resolve, reject) => {
            this.db.getFirstQueueItem(roomId)
                .then(queueItem => {
                    
                })
                .catch(error => {
                    reject(error);
                })
        });
    }


    removeUserFromRoom(userId, roomId) {
        return new Promise((resolve, reject) => {
            this.db.removeUserFromRoom(userId, roomId)
                .then(usersInRoom => {
                    resolve(usersInRoom.users);
                })
                .catch(error => reject(error));
        })
    }

    addUserToRoom(userId, roomId) {
        return new Promise((resolve, reject) => {
            this.db.addUserToRoom(userId, roomId)
                .then(({user, room}) => {
                    let nowPlaying;
                    if (room.queue.length > 0) {
                        nowPlaying = room.queue[0];
                    }
                    resolve({user: user, room: room, nowPlaying: nowPlaying});
                })
                .catch(err => {reject(err)});
        })
    }

}


module.exports = MerakiApi;