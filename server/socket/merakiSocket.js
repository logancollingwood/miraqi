const db = require('../db/db.js');
const moment = require('moment');

const API = require("../controllers/MerakiApi");
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
const SOCKET_TIMEOUT_MS = 5000;

function setup(io, sessionStore) {

    SocketAuth(io, sessionStore);

    let numberOfUsersWhoFinishedSong = 0;
    let numberOfUsersWhoVoteToSkip = 0;

    io.on('connection', (socket) => {
        let user = socket.request.user;
        socketLog('socketId: ' + socket.id + ' connected.');
        const socketSession = new SocketSession(io, socket);
        const dj = new DJ(socketSession, db);

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
                API.getTopRoomStats(socketSession.room._id, 5)
                    .then(topStats => {
                        socketSession.emitToRoom('stats', topStats);
                    })
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
                API.getTopRoomStats(socketSession.room._id, 5)
                    .then(topStats => {
                        socketSession.emitToRoom('stats', topStats);
                    })
                numberOfUsersWhoFinishedSong = 0;
            }
            
        });

        socket.on('subscribe', function (data) {
            console.log('got subscribe');
        })

        socket.on('disconnect', function () {
           console.log(`got disconnect. Number of users remaining: ${io.engine.clientsCount}`);
        });
    });

}

function socketLog(msg) {
    if (typeof msg === 'string') {
        console.info('ws: ' + msg);
    } else {
        console.info('ws object: ');
        console.info(msg);
    }
}

function IsUsernameAdmin(userName) {
    return userName.toUpperCase() === 'logan'.toUpperCase();
}

module.exports = {
    setup: setup
}