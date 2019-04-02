class SocketSession {
    constructor(io, socket, user, room) {
        this.user = user;
        this.room = room;
        this.socket = socket;
        this._io = io;
    }
    getUser() {
        return this.user;
    }
    getRoom() {
        return this.room;
    }
    emitToRoom(key, data) {
        console.log(`emiting action: '${key}' to room: ${this.room._id}`);
        this._io.to(this.room._id).emit(key, data);
    }
    emitToClient(key, data) {
        console.log(`emitting action: '${key}' to user: ${this.user._id}`);
        this.socket.emit(key, data);
    }
    joinRoom(room) {
        this.socket.join(room._id);
        console.log(`socket joined room: ${room._id}`);
    }
}
module.exports = SocketSession;
//# sourceMappingURL=socketSession.js.map