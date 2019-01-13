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

    let numberOfUsersWhoFinishedSong = 0;
    let numberOfUsersWhoVoteToSkip = 0;

    io.on('connection', (socket) => {
        let user = socket.request.user;
        socketLog('socketId: ' + socket.id + ' connected.');
        const socketSession = new SocketSession(io, socket);
        const dj = new DJ(socketSession);

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