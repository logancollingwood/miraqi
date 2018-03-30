const io = require('socket.io')();
const db = require('../db/db.js');
const QueueHandler = require('./handler/queueHandler.js');
const moment = require('moment');

const MerakiApi = require("../controllers/MerakiApi");
const SocketSession = require("./socketSession");

let TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

let users = [];

function setup(port) {
    io.on('connection', (socket) => {

        let socketSession = null;

        socketLog('socketId: ' + socket.id + ' connected.');

        let userModel, roomId = -1, roomModel, roomSocket, queueHandler;

        socket.on('SEND_MESSAGE', function (data) {
            const message = data.message;
            const user = socketSession.getUser();
            const room = socketSession.getRoom();

            MerakiApi.sendMessageToRoom(room._id, user._id, message)
                .then(data => {
                    if (data.isPlay) {
                        if (data.first) {
                            socketSession.emitToRoom('play', data.playUrl);
                        }
                        socketSession.emitToRoom('new queue', data.queue);
                    } else {
                        var broadcastMessage = {
                            serverMessage: false,
                            author: user.name,
                            message: message,
                            timestamp: moment().format(TIME_FORMAT)
                        }
                        socketSession.emitToRoom('RECEIVE_MESSAGE', broadcastMessage);
                    }
                })
                .catch(error => { });

        });

        socket.on('subscribe', function (data) {
            let user = socketSession.getUser();
            MerakiApi.setSocketUserName(user._id, data.username)
            .then(user => {
                var broadcastMessage = {
                    serverMessage: true,
                    author: user.name,
                    message: "has joined the room"
                }
                socketSession.user = user;
                socketSession.emitToRoom('RECEIVE_MESSAGE', broadcastMessage);
            })
        })

        socket.on('disconnect', function () {
            console.log('ws: got disconnect event');
            if (socketSession == null) {
                return;
            }
            const user = socketSession.getUser();
            const room = socketSession.getRoom();

            var broadcastMessage = {
                serverMessage: true,
                author: 'no author',
                message: " signed off"
            }

            if (user.name == null) {
                broadcastMessage.author = user._id
            } else {
                broadcastMessage.author = user.name;
            }

            MerakiApi.removeUserFromRoom(user._id, room._id)
                .then(usersLeftInRoom => {
                    socketSession.emitToRoom('users', usersLeftInRoom);
                    socketSession.emitToRoom('RECEIVE_MESSAGE', broadcastMessage);
                })
                .catch(err => console.log(err));

        });

        socket.on('get next track', function (data) {
            console.log(`ws: got get next track event in room ${data.roomId}, from user ${data.userId}`);
            if (roomModel != null) {
                publishNextSongForRoomId(roomModel._id);
            }
        });


        socket.on('user joined', function (data) {
            let roomId = data.roomId;
            console.log(`ws: user joined room: ${roomId}`);
            MerakiApi.createSocketUserAndAddToRoom(socket.id, roomId)
                .then(userRoom => {
                    let { user, room } = userRoom;
                    socketSession = new SocketSession(user, room, socket, io);
                    socketSession.emitToRoom('users', room.users);
                })
                .catch(err => console.log(err));
        });
    });

    function publishNextSongForRoomId(roomId) {
        db.getNextSongForRoom(roomId)
            .then(nextSongInfo => {
                io.to(roomModel._id).emit('PLAY_MESSAGE', nextSongInfo.playUrl);
            })
            .catch(err => console.log(err));
    }

    function getNextTrackCallBack(queueItem, roomId) {
        console.log(`executing next track in room: ${roomId}`);
        console.log(queueItem);
        io.to(roomId).emit('PLAY_MESSAGE', queueItem.playUrl);
    }

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