var DataBase = require('../db/db.js');
var QueueHandler = require('./handler/queueHandler.js');
var moment = require('moment');
var MerakiApi = require("../controllers/MerakiApi");
var DJ = require('../controllers/Dj');
var SocketSession = require("./socketSession");
var TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
var users = [];
var SKIP_VOTE_PERCENT = 65;
module.exports.MerakiSocket = function (io, database, sessionStore) {
    var numberOfUsersWhoFinishedSong = 0;
    var numberOfUsersWhoVoteToSkip = 0;
    io.on('connection', function (socket) {
        var user = socket.request.user;
        var db = new DataBase(database);
        socketLog('socketId: ' + socket.id + ' connected.');
        var queueHandler = new QueueHandler(socket);
        var socketSession = new SocketSession(io, socket);
        var API = new MerakiApi(db, socketSession);
        var dj = new DJ(socketSession, db);
        socket.on('SEND_MESSAGE', function (data) {
            var message = data.message;
            API.sendMessageToRoom(socketSession.room._id, socketSession.user._id, message)
                .then(function (sendMessageReturned) {
                var broadcastMessage = null;
                if (sendMessageReturned.isPlay) {
                    console.log(sendMessageReturned.queue);
                    dj.addQueueItem(sendMessageReturned.queueItem, sendMessageReturned.queue);
                    broadcastMessage = {
                        serverMessage: true,
                        author: socketSession.user.profile.username,
                        message: "queued up " + sendMessageReturned.queueItem.trackName,
                        timestamp: moment().format(TIME_FORMAT)
                    };
                    API.getTopRoomStats(socketSession.room._id, 5)
                        .then(function (topStats) {
                        socketSession.emitToRoom('stats', topStats);
                    });
                }
                else {
                    broadcastMessage = {
                        serverMessage: false,
                        author: socketSession.user.profile.username,
                        message: message,
                        timestamp: moment().format(TIME_FORMAT)
                    };
                }
                socketSession.emitToRoom('message', broadcastMessage);
            })
                .catch(function (error) { console.error(error); });
        });
        socket.on('skip_track', function (data) {
            numberOfUsersWhoVoteToSkip++;
            var readyToSkip = ((numberOfUsersWhoVoteToSkip / io.engine.clientsCount) * 100) > SKIP_VOTE_PERCENT;
            var numUsersRequiredToSkip = Math.ceil((io.engine.clientsCount * SKIP_VOTE_PERCENT) / 100);
            console.log("numUsers: " + io.engine.clientsCount + ", number who skipped song: " + numberOfUsersWhoVoteToSkip + ", so readyToSkip is: " + readyToSkip + ". " + numUsersRequiredToSkip + " required to skip");
            var broadcastMessage = {
                serverMessage: true,
                author: socketSession.user.profile.username,
                message: "voted to skip the currently playing song. " + numUsersRequiredToSkip + " more votes to skip"
            };
            if (readyToSkip) {
                dj.handleNextTrack();
                API.getTopRoomStats(socketSession.room._id, 5)
                    .then(function (topStats) {
                    socketSession.emitToRoom('stats', topStats);
                });
                numberOfUsersWhoVoteToSkip = 0;
                broadcastMessage.message = "voted to skip the current song. Skipping now...";
            }
            else {
                broadcastMessage.message = "voted to skip the currently playing song. " + numUsersRequiredToSkip + " more votes to skip";
            }
            socketSession.emitToRoom('message', broadcastMessage);
        });
        socket.on('next_track', function (data) {
            var isBehind = data.isBehind ? data.isBehind : false;
            if (isBehind) {
                // if the user is asking for the next track, but is currently parsing an old song, 
                // just finish
                return;
            }
            numberOfUsersWhoFinishedSong++;
            var readyToRemoveFromQueueAndPlay = io.engine.clientsCount >= numberOfUsersWhoFinishedSong;
            console.log("numUsers: " + io.engine.clientsCount + ", number who finished song: " + numberOfUsersWhoFinishedSong + ", so readyToPlay is: " + readyToRemoveFromQueueAndPlay);
            if (readyToRemoveFromQueueAndPlay) {
                dj.handleNextTrack();
                API.getTopRoomStats(socketSession.room._id, 5)
                    .then(function (topStats) {
                    socketSession.emitToRoom('stats', topStats);
                });
                numberOfUsersWhoFinishedSong = 0;
            }
        });
        socket.on('subscribe', function (data) {
            console.log('got subscribe');
        });
        socket.on('disconnect', function () {
            console.log("got disconnect. Number of users remaining: " + io.engine.clientsCount);
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
            if (user.logged_in === false) {
                console.log("emitting notauth");
                socketSession.emitToClient('notauth', null);
                return;
            }
            console.log("got join request from " + roomId + " user: " + user.profile.username);
            var userName = user.profile.username;
            var profile = user.profile;
            var loginProviderType = 'discord';
            API.getOrCreateUser(userName, profile, loginProviderType)
                .then(function (getOrCreatedUser) {
                return API.addUserToRoom(getOrCreatedUser._id, roomId);
            })
                .then(function (_a) {
                var userAddedToRoom = _a.userAddedToRoom, room = _a.room, nowPlaying = _a.nowPlaying, stats = _a.stats;
                socketSession.room = room;
                _roomId = room._id;
                socketSession.user = userAddedToRoom;
                var broadcastMessage = {
                    serverMessage: true,
                    author: socketSession.user.profile.username,
                    message: "has joined the room"
                };
                console.log("got connect. Number of users here: " + io.engine.clientsCount);
                socketSession.joinRoom(room);
                socketSession.emitToClient('initialize', {
                    user: userAddedToRoom,
                    room: room,
                    stats: stats
                });
                if (nowPlaying !== undefined) {
                    socketSession.emitToClient('nowPlaying', nowPlaying);
                }
                socketSession.emitToRoom('message', broadcastMessage);
                socketSession.emitToRoom('users', room.users);
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    });
};
function UserRequiresLogoff(userModel, roomModel) {
    return userModel._id != null && roomModel._id != null;
}
function socketLog(msg) {
    if (typeof msg === 'string') {
        console.info('ws: ' + msg);
    }
    else {
        console.info('ws object: ');
        console.info(msg);
    }
}
function IsUsernameAdmin(userName) {
    return userName.toUpperCase() === 'logan'.toUpperCase();
}
//# sourceMappingURL=merakiSocket.js.map