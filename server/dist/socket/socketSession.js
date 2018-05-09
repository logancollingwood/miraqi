"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketSession = function () {
    function SocketSession(io, socket) {
        _classCallCheck(this, SocketSession);

        this.user = socket.request.user;
        this.room = null;
        this.socket = socket;
        this._io = io;
    }

    _createClass(SocketSession, [{
        key: "getUser",
        value: function getUser() {
            return this.user;
        }
    }, {
        key: "getRoom",
        value: function getRoom() {
            return this.room;
        }
    }, {
        key: "emitToRoom",
        value: function emitToRoom(key, data) {
            console.log("emiting action: '" + key + "' to room: " + this.room._id);
            // console.log(data);
            this._io.to(this.room._id).emit(key, data);
        }
    }, {
        key: "emitToClient",
        value: function emitToClient(key, data) {
            console.log("emitting action: '" + key + "' to user: " + this.user._id);
            this._io.emit(key, data);
        }
    }, {
        key: "joinRoom",
        value: function joinRoom(room) {
            this.socket.join(room._id);
            console.log("socket joined room: " + room._id);
        }
    }]);

    return SocketSession;
}();

module.exports = SocketSession;