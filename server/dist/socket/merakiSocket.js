'use strict';
let db = require('../db/db.js');

function ytVidId(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
}

var users = [];

function setup(io, port) {
    io.on('connection', function (socket) {
        console.log(socket.id);

        var userName = '';
        var room = '';

        socket.on('SEND_MESSAGE', function (data) {
            var message = data.message;
            var isPlayCommand = data.message.startsWith("!play");

            if (isPlayCommand) {
                var playUrl = data.message.split(" ")[1];
                isYoutubeUrl = ytVidId(playUrl);
                if (isYoutubeUrl != false) {
                    // if this returned not false, then we got a youtube ID param back
                    var broadcastMessage = {
                        serverMessage: true,
                        author: userName,
                        message: ": queued up: " + playUrl
                    };
                    io.to(room).emit('RECEIVE_MESSAGE', broadcastMessage);
                    io.to(room).emit('PLAY_MESSAGE', playUrl);
                }
            } else {
                console.log("broadcasting message by user " + data.author + " to room " + room + " :" + data.message);
                io.to(room).emit('RECEIVE_MESSAGE', data);
            }
        });

        socket.on('subscribe', function (data) {
            userName = data.username;
            room = data.room;
            console.log("User:" + userName + " connecting to room:" + room);
            socket.join(data.room);
            users[room] += 1;
            var broadcastMessage = {
                serverMessage: true,
                author: userName,
                message: " connected to the room."
            };
            db.
            io.to(room).emit('RECEIVE_MESSAGE', broadcastMessage);
            io.to(room).emit('USER_JOINED', { userName: userName });
        });

        socket.on('disconnect', function () {
            var broadcastMessage = {
                serverMessage: true,
                author: userName,
                message: " signed off"
            };
            users[room] -= 1;
            io.to(room).emit('RECEIVE_MESSAGE', broadcastMessage);
        });
    });

    io.listen(port);
    console.log("Socket server listening on port:" + port);
}

module.exports = {
    setup: setup
};