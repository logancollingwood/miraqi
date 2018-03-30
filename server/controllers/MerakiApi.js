const db = require("../db/db.js");
const dj = require('./Dj.js');
const TIME_FORMAT = "MM YY / h:mm:ss a";

class MerakiApi {


    constructor() {

    }


    createSocketUserAndAddToRoom(socketId, roomId) {
        return new Promise((resolve, reject) => {
            db.createUser(socketId)
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
            db.updateUserName(userId, name)
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
                console.log(vidId);
                if (vidId) {

                    if (userModel && roomModel) {
                        fetchVideoInfo(vidId, function (err, videoInfo) {
                            let queueItem = {
                                url: playUrl,
                                userId: userId,
                                roomId: roomId,
                                trackName: videoInfo.title,
                                lengthSeconds: videoInfo.duration,
                                type: 'yt',
                            }
                            db.addQueueItem(queueItem)
                                .then(data => {
                                    socketLog('added item to queue db');
                                    socketLog(data);
                                    resolve({
                                        isPlay: true,
                                        first: data.isFirstSong,
                                        playUrl: playUrl,
                                        queue: data.queue,
                                    })
                                    // if (data.isFirstSong) {
                                    //     io.to(roomModel._id).emit('PLAY_MESSAGE', playUrl);
                                    // }
                                    // io.to(roomModel._id).emit('new queue', data.queue);
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
            db.removeUserFromRoom(userId, roomId)
                .then(usersInRoom => {
                    resolve(usersInRoom.users);
                })
                .catch(error => reject(error));
        })
    }

}


module.exports = new MerakiApi();