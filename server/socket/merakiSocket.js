const io = require('socket.io')();
const db = require('../db/db.js');
const QueueHandler = require('./handler/queueHandler.js');
const moment = require('moment');
const getYoutubeTitle = require('get-youtube-title')

let TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

let users = [];

function setup(port) {
    io.on('connection', (socket) => {
        socketLog('socketId: ' + socket.id + ' connected.');

        let userModel, roomId = -1, roomModel, roomSocket, queueHandler;

        socket.on('SEND_MESSAGE', function (data) {
            const message = data.message;

            const isPlayCommand = data.message.startsWith("!play");

            if (isPlayCommand) {
                const playUrl = data.message.split(" ")[1];
                const vidId = ytVidId(playUrl);
                if (vidId) { // if this returned not false, then we got a youtube ID param back
                    var broadcastMessage = {
                        serverMessage: true,
                        author: roomModel.name,
                        message: "queued up: " + playUrl,
                        timestamp: moment().format(TIME_FORMAT)
                    }
                    io.to(roomModel._id).emit('RECEIVE_MESSAGE', broadcastMessage);
                    if (userModel && roomModel) {
                        getYoutubeTitle(vidId, function (err, title) {
                            let queueItem = {
                                url: playUrl,
                                userId: userModel._id,
                                roomId: roomModel._id,
                                trackName: title,
                                type: 'yt',
                            }
                            db.addQueueItem(queueItem)
                                .then(data => {
                                    socketLog('added item to queue db');
                                    socketLog(data);
                                    if (data.isFirstSong) {
                                        io.to(roomModel._id).emit('PLAY_MESSAGE', playUrl);
                                    }
                                })
                                .catch(err => console.error);
                        })
                    }
                }
            } else {
                socketLog("broadcasting message by user " + data.author + " to room " + roomModel._id + " :" + data.message);
                io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);
            }

        });

        socket.on('subscribe', function (data) {
            console.log('handling subscribe event');
            socketLog(data);
            userName = data.username;
            roomId = data.room;
            socket.join(roomId);
            var broadcastMessage = {
                serverMessage: true,
                author: userName,
                message: " connected to the room."
            }
            db.createUser(userName, IsUsernameAdmin(userName))
                .then(user => {
                    userModel = user;
                    let addUserToRoomRequest = {
                        roomId: roomId,
                        userId: user._id
                    }
                    console.log(`created user with id: ${user._id}`)
                    db.addUserToRoom(addUserToRoomRequest)
                        .then(userRoom => {
                            roomModel = userRoom.room;
                            io.to(roomId).emit('SYNC_ROOM', userRoom.room);
                            io.to(roomId).emit('RECEIVE_MESSAGE', broadcastMessage);
                        })
                        .catch(err => console.error('failed to add user to room'));

                })
                .catch(err => console.error('failed to create user'));
        })

        socket.on('disconnect', function () {
            console.log('ws: got disconnect event');
            console.log(userModel);
            if (userModel != null) {
                console.log('unsubscribing from channel');
                var broadcastMessage = {
                    serverMessage: true,
                    author: userModel.name,
                    message: " signed off"
                }
                if (UserRequiresLogoff(userModel, roomModel)) {
                    let removeUserFromRoomRequest = {
                        userId: userModel._id,
                        roomId: roomModel._id
                    }
                    console.log('removing user');
                    console.log(removeUserFromRoomRequest);
                    db.removeUserFromRoom(removeUserFromRoomRequest)
                        .then(userRoom => {
                            roomModel = userRoom.room;
                            io.to(roomId).emit('SYNC_ROOM', userRoom.room);
                            io.to(roomId).emit('RECEIVE_MESSAGE', broadcastMessage);
                        })
                        .catch(err => console.error);
                }
            }
        });
    });


    io.listen(port);
    console.log("Socket server listening on port:" + port);

}

function UserRequiresLogoff(userModel, roomModel) {
    return userModel._id != null && roomModel._id != null;
}

function socketLog(msg) {
    if (typeof msg == 'string') {
        console.info('ws: ' + msg);
    } else {
        console.info('ws object: ');
        console.info(msg);
    }
}

function IsUsernameAdmin(userName) {
    return userName.toUpperCase() == 'logan'.toUpperCase();
}

module.exports = {
    setup: setup
}