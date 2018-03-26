const io = require('socket.io')();
let db = require('../db/db.js');

function ytVidId(url)  {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}

let users = [];

function setup(port) {
    io.on('connection', (socket) => {
        socketLog('socketId: ' + socket.id + ' connected.');

        let userModel = {}, roomModel = {}, roomSocket = {};

        socket.on('SEND_MESSAGE', function(data){
            const message = data.message;
            const isPlayCommand = data.message.startsWith("!play");

            if (isPlayCommand) {
                const playUrl = data.message.split(" ")[1];
                isYoutubeUrl = ytVidId(playUrl);
                if (isYoutubeUrl != false)  { // if this returned not false, then we got a youtube ID param back
                    var broadcastMessage = {
                        serverMessage: true,
                        author: roomModel.name,
                        message: ": queued up: " + playUrl
                    }
                    io.to(roomModel._id).emit('RECEIVE_MESSAGE', broadcastMessage);
                    io.to(roomModel._id).emit('PLAY_MESSAGE', playUrl);
                    let queueItem = {
                        url: playUrl,
                        userId: userModel._id,
                        roomId: roomModel._id
                    }
                    // db.addQueueItem(queueItem)
                    //     .then(data => {
                    //         socketLog('added item to queue db');
                    //     })
                    //     .catch(err => console.error);
                }
            } else {
                socketLog("broadcasting message by user " + data.author + " to room " + roomModel._id + " :" + data.message);
                io.to(roomModel._id).emit('RECEIVE_MESSAGE', data);		
            }

        });

        socket.on('subscribe', function(data) { 
            socketLog(data);
            userName = data.username;
            roomModel = data.room;
            socket.join(roomModel._id);
            var broadcastMessage = {
                serverMessage: true,
                author: userName,
                message: " connected to the room."
            }
            db.createUser(userName, IsUsernameAdmin(userName))
                .then(user => {
                    userModel = user;
                    let addUserToRoomRequest = {  
                        roomId: data.room._id,
                        userId: userModel._id
                    }
                    db.addUserToRoom(addUserToRoomRequest)
                        .then(data => {
                            socketLog('Successfully created and added user to room: ' +  data);
                        })
                        .catch(err => console.error);
                    
                })
                .catch(err => console.error);
            io.to(roomModel._id).emit('RECEIVE_MESSAGE', broadcastMessage);
            io.to(roomModel._id).emit('USER_JOINED', {userName: userName});
        })

        socket.on('disconnect', function () {
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
                    .then(data => socketLog)
                    .catch(err => console.error);
            }
            io.to(roomModel._id).emit('RECEIVE_MESSAGE', broadcastMessage);
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