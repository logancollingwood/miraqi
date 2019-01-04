var SocketSession = /** @class */ (function () {
    function SocketSession(io, socket) {
        this.user = socket.request.user;
        this.room = null;
        this.socket = socket;
        this._io = io;
    }
    SocketSession.prototype.getUser = function () {
        return this.user;
    };
    SocketSession.prototype.getRoom = function () {
        return this.room;
    };
    SocketSession.prototype.emitToRoom = function (key, data) {
        console.log("emiting action: '" + key + "' to room: " + this.room._id);
        // console.log(data);
        this._io.to(this.room._id).emit(key, data);
    };
    SocketSession.prototype.emitToClient = function (key, data) {
        console.log("emitting action: '" + key + "' to user: " + this.user._id);
        this.socket.emit(key, data);
    };
    SocketSession.prototype.joinRoom = function (room) {
        this.socket.join(room._id);
        console.log("socket joined room: " + room._id);
    };
    return SocketSession;
}());
module.exports = SocketSession;
//# sourceMappingURL=socketSession.js.map