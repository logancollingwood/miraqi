const DataBase = require('../db/db.js');
const QueueHandler = require('./handler/queueHandler.js');
const moment = require('moment');

const MerakiApi = require("../controllers/MerakiApi");
const SocketSession = require("./socketSession");
const { WebAuth, SocketAuth } = require('../auth/MerakiAuth.js');

let TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

let users = [];

function setup(io, database, sessionStore) {

    SocketAuth(io, sessionStore);

    io.on('connection', (socket) => {
        let user = socket.request.user;
        const db = new DataBase(database);
        const API = new MerakiApi(db);
        socketLog('socketId: ' + socket.id + ' connected.');
        const queueHandler = new QueueHandler(socket);
        const socketSession = new SocketSession(io, socket);

        socket.on('SEND_MESSAGE', function (data) {
            const message = data.message;
            console.log(socketSession);
            API.sendMessageToRoom(socketSession.room._id, socketSession.user._id, message)
                .then(data => {
                    if (data.isPlay) {
                        if (data.first) {
                            socketSession.emitToRoom('play', data.playUrl);
                        }
                        socketSession.emitToRoom('new queue', data.queue);
                    } else {
                        console.log('username:' + socketSession.user.profile.username);
                        var broadcastMessage = {
                            serverMessage: false,
                            author: socketSession.user.profile.username,
                            message: message,
                            timestamp: moment().format(TIME_FORMAT)
                        }
                        socketSession.emitToRoom('message', broadcastMessage);
                    }
                })
                .catch(error => { });

        });

        socket.on('subscribe', function (data) {
            console.log('got subscribe');
        })

        socket.on('disconnect', function () {
           console.log('got disconnect');
        });


        /**
         * Takes in a request object to join the room. Sent by clients
         * on joining a room. Socket has already been created an
         * the user property is created already for the oAuth profile
         * 
         * {
         *  roomId
         * }
         * 
         * Creates or retrieves a user record on our side and adds 
         * them to the current room
         * 
         */
        socket.on('join', function(data) {
            const roomId = data.roomId;
            if (roomId === null || roomId === undefined || roomId === '') {
                return;
            }
            console.log(`got join request from ${roomId} user: ${user.profile.username}`)
            let userName = user.profile.username;
            let profile = user.profile;
            let loginProviderType = 'discord';
            API.getOrCreateUser(userName, profile, loginProviderType)
                .then(user => {
                    return API.addUserToRoom(user._id, roomId);
                })
                .then(({user, room, nowPlaying}) => {
                    console.log(user);
                    console.log(room);
                    socketSession.room = room;
                    socketSession.user = user;
                    var broadcastMessage = {
                        serverMessage: true,
                        author: socketSession.user.profile.username,
                        message: "has joined the room"
                    }
                    socketSession.joinRoom(room);
                    socketSession.emitToClient('room', room);
                    socketSession.emitToClient('nowPlaying', nowPlaying);
                    socketSession.emitToRoom('message', broadcastMessage);
                    socketSession.emitToRoom('users', room.users);
                });
        });
            
    });

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