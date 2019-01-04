const SocketSession = require('./socketSession');
const API = require("../controllers/MerakiApi");
const moment = require('moment');

const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;
let TIME_FORMAT = "MM YY / h:mm:ss a";


class SocketConnection {
    constructor(io, socket) {
        console.log(`constructing socket connection`);
        this._io = io;
        this._socket = socket;
        this._disconnectIntervalId = setTimeout(this.disconnect.bind(this), SOCKET_DISCONNECT_TIMEOUT_MS)
        this._user = socket.request.user;
        this._socketSession = new SocketSession(io, socket);


        socket.on('SEND_MESSAGE', this.handleMessageSent.bind(this));
        socket.on('skip_track', this.handleSkipTrack.bind(this));
        socket.on('next_track', this.handleNextTrack.bind(this));
        socket.on('disconnect',  this.handleDisconnect.bind(this));
        socket.on('join', this.handleJoin.bind(this));
        clearTimeout(this._disconnectIntervalId);

    }

    disconnect() {
        this._socket.disconnect(true);
    }

    async handleJoin(data) {
        clearTimeout(this._disconnectIntervalId);
        if(!data.roomId) {
            this.disconnect();
        }
        if (!this._user) {
            this._socketSession.emitToClient('notauth', {});
            this.disconnect();
        }
        console.log(`got join request from ${data.roomId} user: ${this._user.profile.username}`)
        let userName = this._user.profile.username;
        let profile = this._user.profile;
        let loginProviderType = 'discord';
        let getOrCreatedUser = await API.getOrCreateUser(userName, profile, loginProviderType);
        let {userAddedToRoom, room, nowPlaying, stats} = await API.addUserToRoom(getOrCreatedUser._id, data.roomId);
        this._socketSession.room = room;
        this._socketSession.user = userAddedToRoom;
        var broadcastMessage = {
            serverMessage: true,
            author: this._socketSession.user.profile.username,
            message: "has joined the room"
        }
        console.log(`got connect. Number of users here: ${room.users.length}`);
        this._socketSession.joinRoom(room);
        this._socketSession.emitToClient('initialize', {
            user: userAddedToRoom,
            room: room,
            stats: stats
        });
        if (nowPlaying !== undefined) {
            this._socketSession.emitToClient('nowPlaying', nowPlaying);
        }
        this._socketSession.emitToRoom('message', broadcastMessage);
        this._socketSession.emitToRoom('users', room.users);
    }

    async handleMessageSent(data) {
        const message = data.message;
        let sendMessageReturned = await API.sendMessageToRoom(this._socketSession.room._id, this._socketSession.user._id, message)
        let broadcastMessage;
        if (sendMessageReturned.isPlay) {
            console.log(sendMessageReturned.queue);
            dj.addQueueItem(sendMessageReturned.queueItem, sendMessageReturned.queue);
            broadcastMessage = {
                serverMessage: true,
                author: this._socketSession.user.profile.username,
                message: `queued up ${sendMessageReturned.queueItem.trackName}`,
                timestamp: moment().format(TIME_FORMAT)
            }
            let topStats = await API.getTopRoomStats(this._socketSession.room._id, 5)
            this._socketSession.emitToRoom('stats', topStats);
        } else {
            broadcastMessage = {
                serverMessage: false,
                author: this._socketSession.user.profile.username,
                message: message,
                timestamp: moment().format(TIME_FORMAT)
            }
        }
        this._socketSession.emitToRoom('message', broadcastMessage);

    }

    handleSkipTrack(data) {

    }

    handleNextTrack(data) {

    }

    handleDisconnect(data) {

    }

}

module.exports = SocketConnection;