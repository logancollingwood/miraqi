'use strict';

var DataBase = require('../db/db.js');
var QueueHandler = require('./handler/queueHandler.js');
var moment = require('moment');

var MerakiApi = require("../controllers/MerakiApi");
var SocketSession = require("./socketSession");

var _require = require('../auth/MerakiAuth.js'),
    WebAuth = _require.WebAuth,
    SocketAuth = _require.SocketAuth;

var TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
}

var users = [];

function setup(io, database, sessionStore) {

    SocketAuth(io, sessionStore);

    io.on('connection', function (socket) {
        var user = socket.request.user;
        var db = new DataBase(database);
        var API = new MerakiApi(db);
        socketLog('socketId: ' + socket.id + ' connected.');
        var queueHandler = new QueueHandler(socket);
        var socketSession = new SocketSession(io, socket);

        socket.on('SEND_MESSAGE', function (data) {
            var message = data.message;
            console.log(socketSession);
            API.sendMessageToRoom(socketSession.room._id, socketSession.user._id, message).then(function (data) {
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
                    };
                    socketSession.emitToRoom('message', broadcastMessage);
                }
            }).catch(function (error) {});
        });

        socket.on('subscribe', function (data) {
            console.log('got subscribe');
        });

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
        socket.on('join', function (data) {
            var roomId = data.roomId;
            if (roomId === null || roomId === undefined || roomId === '') {
                return;
            }
            console.log('got join request from ' + roomId + ' user: ' + user.profile.username);
            var userName = user.profile.username;
            var profile = user.profile;
            var loginProviderType = 'discord';
            API.getOrCreateUser(userName, profile, loginProviderType).then(function (user) {
                return API.addUserToRoom(user._id, roomId);
            }).then(function (_ref) {
                var user = _ref.user,
                    room = _ref.room;

                console.log(user);
                console.log(room);
                socketSession.room = room;
                socketSession.user = user;
                var broadcastMessage = {
                    serverMessage: true,
                    author: socketSession.user.profile.username,
                    message: "has joined the room"
                };
                socketSession.joinRoom(room);
                socketSession.emitToClient('room', room);
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
};