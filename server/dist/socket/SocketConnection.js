var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SocketSession = require('./socketSession');
const API = require("../controllers/MerakiApi");
const moment = require('moment');
const DataBase = require('../db/db.js');
const DJ = require("../controllers/Dj");
const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;
let TIME_FORMAT = "MM YY / h:mm:ss a";
let LOGIN_PROVIDER_TYPE_DISCORD = 'discord';
const SKIP_VOTE_PERCENT = 65;
class SocketConnection {
    constructor(io, socket, queueProcessor) {
        this._io = io;
        this._socket = socket;
        this._queueProcessor = queueProcessor;
        // Set a timeout to disconnect unless we receive the JOIN event and successfully authenticate
        this._disconnectTimeout = setTimeout(this.disconnect.bind(this), SOCKET_DISCONNECT_TIMEOUT_MS);
        // Need to figure out how to deal with this in a distributed redis way
        // also by room
        this._numberOfUsersWhoVoteToSkip = 0;
        this._numberOfUsersWhoFinishedSong = 0;
        this._user = socket.request.user;
        this._socket.emit('send_auth', { required: true });
        // Register Socket Handlers
        this._socket.on('SEND_MESSAGE', this.handleMessageSent.bind(this));
        this._socket.on('skip_track', this.handleSkipTrack.bind(this));
        this._socket.on('disconnect', this.handleDisconnect.bind(this));
        this._socket.on('join', this.handleJoin.bind(this));
    }
    disconnect() {
        this._socket.disconnect(true);
    }
    notAuthorized() {
        // Send a not_auth event to the client
        // to handle ui redirect
        this._socket.emit('not_auth', null);
    }
    handleJoin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            clearTimeout(this._disconnectTimeout);
            if (!request.roomId) {
                this.disconnect();
            }
            if (!this._user.logged_in) {
                this.notAuthorized();
                this.disconnect();
            }
            let userName = this._user.profile.username;
            let profile = this._user.profile;
            let getOrCreatedUser = yield API.getOrCreateUser(userName, profile, LOGIN_PROVIDER_TYPE_DISCORD);
            let { userAddedToRoom, room, nowPlaying, stats } = yield API.addUserToRoom(getOrCreatedUser._id, request.roomId);
            this._socketSession = new SocketSession(this._io, this._socket, userAddedToRoom, room);
            this._dj = new DJ(this._socketSession, this._queueProcessor);
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
            this.sendMessageToRoom(true, userName, "has joined the room");
        });
    }
    handleMessageSent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = data.message;
            let sendMessageReturned = yield API.sendMessageToRoom(this._socketSession.room._id, this._socketSession.user._id, message);
            let broadcastMessage;
            if (sendMessageReturned.isPlay) {
                console.log(sendMessageReturned.queue);
                this._dj.addQueueItem(sendMessageReturned.queueItem, sendMessageReturned.queue);
                broadcastMessage = {
                    serverMessage: true,
                    author: this._socketSession.user.profile.username,
                    message: `queued up ${sendMessageReturned.queueItem.trackName}`,
                    timestamp: moment().format(TIME_FORMAT)
                };
                let topStats = yield API.getTopRoomStats(this._socketSession.room._id, 5);
                this._socketSession.emitToRoom('stats', topStats);
            }
            else {
                broadcastMessage = {
                    serverMessage: false,
                    author: this._socketSession.user.profile.username,
                    message: message,
                    timestamp: moment().format(TIME_FORMAT)
                };
            }
            this._socketSession.emitToRoom('message', broadcastMessage);
        });
    }
    handleSkipTrack(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const numUsersInRoom = this._io.engine.clientsCount;
            this._numberOfUsersWhoVoteToSkip++;
            let readyToSkip = ((this._numberOfUsersWhoVoteToSkip / numUsersInRoom) * 100) > SKIP_VOTE_PERCENT;
            let numUsersRequiredToSkip = Math.ceil((numUsersInRoom * SKIP_VOTE_PERCENT) / 100);
            console.log(`numUsers: ${numUsersInRoom}, number who skipped song: ${this._numberOfUsersWhoVoteToSkip}, so readyToSkip is: ${readyToSkip}. ${numUsersRequiredToSkip} required to skip`);
            let message;
            if (readyToSkip) {
                this._dj.handleNextTrack();
                let topStats = yield API.getTopRoomStats(this._socketSession.room._id, 5);
                this._socketSession.emitToRoom('stats', topStats);
                this._numberOfUsersWhoVoteToSkip = 0;
                message = `voted to skip the current song. Skipping now...`;
            }
            else {
                message = `voted to skip the currently playing song. ${numUsersRequiredToSkip} more votes to skip`;
            }
            this.sendMessageToRoom(true, this._socketSession.user.profile.username, message);
        });
    }
    handleDisconnect(data) {
    }
    sendMessageToRoom(serverMessage = false, author = "GUILD:", message) {
        this._socketSession.emitToRoom('message', { serverMessage: serverMessage, author: author, message: message });
    }
}
module.exports = SocketConnection;
//# sourceMappingURL=SocketConnection.js.map