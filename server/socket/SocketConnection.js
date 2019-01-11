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
    constructor(io, socket) {
        this._io = io;
        this._socket = socket;

        // Set a timeout to disconnect unless we receive the JOIN event and successfully authenticate
        this._disconnectTimeout = setTimeout(this.disconnect.bind(this), SOCKET_DISCONNECT_TIMEOUT_MS);

        // Need to figure out how to deal with this in a distributed redis way
        // also by room
        this._numberOfUsersWhoVoteToSkip = 0;
        this._numberOfUsersWhoFinishedSong = 0;


        this._user = socket.request.user;

        // Register Socket Handlers
        socket.on('SEND_MESSAGE', this.handleMessageSent.bind(this));
        socket.on('skip_track', this.handleSkipTrack.bind(this));
        socket.on('next_track', this.handleNextTrack.bind(this));
        socket.on('disconnect',  this.handleDisconnect.bind(this));
        socket.on('join', this.handleJoin.bind(this));
    }

    disconnect() {
        this.notAuthorized();
        this._socket.disconnect(true);
    }

    notAuthorized() {
        // Send a not_auth event to the client
        // to handle ui redirect
        this._socket.emit('not_auth', null);
    }

    async handleJoin(request) {
        clearTimeout(this._disconnectTimeout);
        if(!request.roomId) {
            this.disconnect();
        }
        if (!this._user.logged_in) {
            this.notAuthorized();
            this.disconnect();
        }
        let userName = this._user.profile.username;
        let profile = this._user.profile;
        let getOrCreatedUser = await API.getOrCreateUser(userName, profile, LOGIN_PROVIDER_TYPE_DISCORD);
        let {userAddedToRoom, room, nowPlaying, stats} = await API.addUserToRoom(getOrCreatedUser._id, request.roomId);
      
        this._socketSession = new SocketSession(this._io, this._socket, userAddedToRoom, room);
        this._dj = new DJ(this._socketSession);

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
    }

    async handleMessageSent(data) {
        const message = data.message;
        let sendMessageReturned = await API.sendMessageToRoom(this._socketSession.room._id, this._socketSession.user._id, message)
        let broadcastMessage;
        if (sendMessageReturned.isPlay) {
            console.log(sendMessageReturned.queue);
            this._dj.addQueueItem(sendMessageReturned.queueItem, sendMessageReturned.queue);
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

    handleSkipTrack(request) {
            const numUsersInRoom = this._io.engine.clientsCount;
            this._numberOfUsersWhoVoteToSkip++;
            let readyToSkip =  ((this._numberOfUsersWhoVoteToSkip / numUsersInRoom) * 100) > SKIP_VOTE_PERCENT;
            let numUsersRequiredToSkip = Math.ceil((numUsersInRoom * SKIP_VOTE_PERCENT) / 100);
            console.log(`numUsers: ${numUsersInRoom}, number who skipped song: ${this._numberOfUsersWhoVoteToSkip}, so readyToSkip is: ${readyToSkip}. ${numUsersRequiredToSkip} required to skip`);
            let message;
            if (readyToSkip) {
                this._dj.handleNextTrack()
                API.getTopRoomStats(this._socketSession.room._id, 5)
                    .then(topStats => {
                        this._socketSession.emitToRoom('stats', topStats);
                    })
                this._numberOfUsersWhoVoteToSkip = 0;
                message = `voted to skip the current song. Skipping now...`
            } else {
                message = `voted to skip the currently playing song. ${numUsersRequiredToSkip} more votes to skip`
            }
            this.sendMessageToRoom(true, this._socketSession.user.profile.username, message);
    }

    handleNextTrack(request) {
        const numUsersInRoom = this._io.engine.clientsCount;
        this._numberOfUsersWhoFinishedSong++;
        let readyToRemoveFromQueueAndPlay = numberOfUsersWhoFinishedSong == numUsersInRoom;
        console.log(`numUsers: ${numUsersInRoom}, number who finished song: ${this._numberOfUsersWhoFinishedSong}, so readyToPlay is: ${readyToRemoveFromQueueAndPlay}`);
        if (readyToRemoveFromQueueAndPlay) {
            dj.handleNextTrack()
            API.getTopRoomStats(socketSession.room._id, 5)
                .then(topStats => {
                    socketSession.emitToRoom('stats', topStats);
                })
            numberOfUsersWhoFinishedSong = 0;
        }
    }

    handleDisconnect(data) {

    }

    sendMessageToRoom(serverMessage = false, author = "GUILD:", message) {
        this._socketSession.emitToRoom('message', {serverMessage: serverMessage, author: author, message: message});
    }

}

module.exports = SocketConnection;