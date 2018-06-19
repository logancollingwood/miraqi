const DataBase = require('../db/db.js');
const QueueHandler = require('./handler/queueHandler.js');
const moment = require('moment');

const MerakiApi = require("../controllers/MerakiApi");
const DJ = require('../controllers/Dj');
const SocketSession = require("./socketSession");
const { WebAuth, SocketAuth } = require('../auth/MerakiAuth.js');

let TIME_FORMAT = "MM YY / h:mm:ss a";
function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

let users = [];
const SKIP_VOTE_PERCENT = 65;

function setup(io, database, sessionStore) {

    SocketAuth(io, sessionStore);

    let numberOfUsersWhoFinishedSong = 0;
    let numberOfUsersWhoVoteToSkip = 0;

    io.on('connection', (socket) => {
        let user = socket.request.user;
        const db = new DataBase(database);
        socketLog('socketId: ' + socket.id + ' connected.');
        const queueHandler = new QueueHandler(socket);
        const socketSession = new SocketSession(io, socket);
        const API = new MerakiApi(db, socketSession);
        const dj = new DJ(socketSession, db);

        socket.on('SEND_MESSAGE', function (data) {
            const message = data.message;
            API.sendMessageToRoom(socketSession.room._id, socketSession.user._id, message)
                .then(data => {
                    let broadcastMessage = null;
                    if (data.isPlay) {
                        console.log(data.queue);
                        dj.addQueueItem(data.queueItem, data.queue);
                        broadcastMessage = {
                            serverMessage: true,
                            author: socketSession.user.profile.username,
                            message: `queued up ${data.queueItem.trackName}`,
                            timestamp: moment().format(TIME_FORMAT)
                        }
                    } else {
                        broadcastMessage = {
                            serverMessage: false,
                            author: socketSession.user.profile.username,
                            message: message,
                            timestamp: moment().format(TIME_FORMAT)
                        }
                    }
                    socketSession.emitToRoom('message', broadcastMessage);
                })
                .catch(error => { console.error(error)});

        });

        socket.on('skip_track', function(data) {
            numberOfUsersWhoVoteToSkip++;
            let readyToSkip =  ((numberOfUsersWhoVoteToSkip / io.engine.clientsCount) * 100) > SKIP_VOTE_PERCENT;
            let numUsersRequiredToSkip = Math.ceil((io.engine.clientsCount * SKIP_VOTE_PERCENT) / 100);
            console.log(`numUsers: ${io.engine.clientsCount}, number who skipped song: ${numberOfUsersWhoVoteToSkip}, so readyToSkip is: ${readyToSkip}. ${numUsersRequiredToSkip} required to skip`);
            var broadcastMessage = {
                serverMessage: true,
                author: socketSession.user.profile.username,
                message: `voted to skip the currently playing song. ${numUsersRequiredToSkip} more votes to skip`
            }
            if (readyToSkip) {
                dj.handleNextTrack()
                numberOfUsersWhoVoteToSkip = 0;
                broadcastMessage.message = `voted to skip the current song. Skipping now...`
            } else {
                broadcastMessage.message = `voted to skip the currently playing song. ${numUsersRequiredToSkip} more votes to skip`
            }
            socketSession.emitToRoom('message', broadcastMessage);
        });

        socket.on('next_track', function(data) {
            let isBehind = data.isBehind ? data.isBehind : false;
            if (isBehind) {
                // if the user is asking for the next track, but is currently parsing an old song, 
                // just finish
                return;
            }
            numberOfUsersWhoFinishedSong++;
            let readyToRemoveFromQueueAndPlay = 
                io.engine.clientsCount >= numberOfUsersWhoFinishedSong;
            console.log(`numUsers: ${io.engine.clientsCount}, number who finished song: ${numberOfUsersWhoFinishedSong}, so readyToPlay is: ${readyToRemoveFromQueueAndPlay}`);
            if (readyToRemoveFromQueueAndPlay) {
                dj.handleNextTrack()
                numberOfUsersWhoFinishedSong = 0;
            }
            
        });

        socket.on('subscribe', function (data) {
            console.log('got subscribe');
        })

        socket.on('disconnect', function () {
           console.log(`got disconnect. Number of users remaining: ${io.engine.clientsCount}`);
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
            if (user.logged_in === false) {
                console.log(`emitting notauth`);
                socketSession.emitToClient('notauth', null);
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
                    socketSession.room = room;
                    socketSession.user = user;
                    var broadcastMessage = {
                        serverMessage: true,
                        author: socketSession.user.profile.username,
                        message: "has joined the room"
                    }
                    console.log(`got connect. Number of users here: ${io.engine.clientsCount}`);
                    socketSession.joinRoom(room);
                    socketSession.emitToClient('room', room);
                    if (nowPlaying !== undefined) {
                        socketSession.emitToClient('nowPlaying', nowPlaying);
                    }
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