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
    
    const db = new DataBase(database);
    SocketAuth(io, sessionStore);

    io.on('connection', (socket) => {
        console.log(socket.request.user);
        let socketSession = null;

        socketLog('socketId: ' + socket.id + ' connected.');

        let userModel, roomId = -1, roomModel, roomSocket;
        const queueHandler = new QueueHandler(socket);

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
                        socketSession.emitToRoom('message', broadcastMessage);
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
                socketSession.emitToRoom('message', broadcastMessage);
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
                    socketSession.emitToRoom('message', broadcastMessage);
                })
                .catch(err => console.log(err));

        });


        /**
         * Takes in a request object to join the room. Sent by clients
         * on joining a room (initiated when landing on a room page)
         * 
         * {
         *  userName,
         *  providerLoginId (discord atm),
         *  loginProviderType (discord/facebook/etc),
         *  roomId (the id of the room to join)
         * }
         * 
         * Creates or retrieves a user record on our side and adds 
         * them to the current room
         * 
         */
        socket.on('join', function(data) {
            const { userName, providerLoginId, loginProviderType } = data;
            if (userName == null || providerLoginId == null || loginProviderType == null) {
                return;
            }

            MerakiApi.getOrCreateUser(userName, providerLoginId, loginProviderType)
                .then(user => {
                    socketSession.user = user;
                    return MerakiApi.addUserToRoom(user._id, roomId);
                })
                .then(({user, room}) => {
                    var broadcastMessage = {
                        serverMessage: true,
                        author: user.name,
                        message: "has joined the room"
                    }
                    socketSession.emitToRoom('message', broadcastMessage);
                    socketSession.emitToRoom('users', room.users);
                });
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