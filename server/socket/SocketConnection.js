const SocketSession = require('./socketSession');
const API = require("../controllers/MerakiApi");
const moment = require('moment');

const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;
let TIME_FORMAT = "MM YY / h:mm:ss a";
let LOGIN_PROVIDER_TYPE_DISCORD = 'discord';

class SocketConnection {
    constructor(io, socket) {
        this._io = io;
        this._socket = socket;
        this._disconnectTimeout = setTimeout(this.disconnect.bind(this), SOCKET_DISCONNECT_TIMEOUT_MS)
        this._user = socket.request.user;
        this._socketSession = new SocketSession(io, socket);


        socket.on('SEND_MESSAGE', this.handleMessageSent.bind(this));
        socket.on('skip_track', this.handleSkipTrack.bind(this));
        socket.on('next_track', this.handleNextTrack.bind(this));
        socket.on('disconnect',  this.handleDisconnect.bind(this));
        socket.on('join', this.handleJoin.bind(this));
    }

    disconnect() {
        this._socket.disconnect(true);
    }

    async handleJoin(data) {
        clearTimeout(this._disconnectTimeout);
        if(!data.roomId) {
            this.disconnect();
        }
        if (!this._user) {
            this._socketSession.emitToClient('notauth', {});
            this.disconnect();
        }
        let userName = this._user.profile.username;
        let profile = this._user.profile;
        let getOrCreatedUser = await API.getOrCreateUser(userName, profile, LOGIN_PROVIDER_TYPE_DISCORD);
        let {userAddedToRoom, room, nowPlaying, stats} = await API.addUserToRoom(getOrCreatedUser._id, data.roomId);
        this._socketSession.room = room;
        this._socketSession.user = userAddedToRoom;
        this._socketSession.joinRoom(room);
        this._socketSession.emitToClient('initialize', {
            user: userAddedToRoom,
            room: room,
            stats: stats
        });
        if (nowPlaying) {
            this._socketSession.emitToClient('nowPlaying', nowPlaying);
        }
        this._socketSession.emitToRoom('message', {
            serverMessage: true,
            author: userName,
            message: "has joined the room"
        });
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