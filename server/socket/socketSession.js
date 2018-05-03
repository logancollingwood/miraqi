class SocketSession {
    
    constructor(io, socket) {
        this.user = socket.request.user;
        this.room = null;
        this.socket = socket;
        this._io = io;
    }

    setUser(user) {
        this.user = user;
    }

    setRoom(room) {
        this.room = room;
        this.socket.join(room._id);
    }

    getUser() {
        return this.user;
    }

    getRoom() {
        return this.room;
    }

    emitToRoom(key, data) {
        console.log(`emiting action: '${key}' to room: ${this.room._id}`);
        // console.log(data);
        this._io.to(this.room._id).emit(key, data);
    }

    emitToClient(key, data) {
        console.log(`emitting action: '${key}' to user: ${this.user._id}`)
        this._io.emit(key, data);
    }

}

module.exports = SocketSession;