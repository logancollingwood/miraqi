class SocketSession {
    
    constructor(user, room, socket, io) {
        console.log(`Initializing socket session for socket id: ${socket.id}`);
        this.user = user;
        this.room = room;
        this.socket = socket;
        this.io = io;
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
        this.io.to(this.room._id).emit(key, data);
    }

}

module.exports = SocketSession;