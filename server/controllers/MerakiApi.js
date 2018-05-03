const fetchVideoInfo = require('youtube-info');
const dj = require('./Dj.js');
const TIME_FORMAT = "MM YY / h:mm:ss a";
const QueueUtil = require('./QueueUtil.js');

class MerakiApi {


    constructor(db) {
        this.db = db;
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
        return new Promise((resolve, reject) => {
            const isPlayCommand = message.startsWith("!play");

            if (isPlayCommand) {
                const playUrl = message.split(" ")[1];
                const vidId = dj.ytVidId(playUrl);
                console.log(`videoId: ${vidId}`);
                if (vidId) {
                    console.log(roomId + ' ' + userId);
                    if (roomId && userId) {
                        fetchVideoInfo(vidId, function (err, videoInfo) {
                            let queueItem = {
                                url: playUrl,
                                userId: userId,
                                roomId: roomId,
                                trackName: videoInfo.title,
                                lengthSeconds: videoInfo.duration,
                                type: 'yt',
                            }
                            console.log(queueItem);
                            this.db.addQueueItem(queueItem)
                                .then(data => {
                                    resolve({
                                        isPlay: true,
                                        first: data.isFirstSong,
                                        playUrl: playUrl,
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
                    resolve({user: user, room: room});
                })
                .catch(err => {reject(err)});
        })
    }

}


module.exports = MerakiApi;