var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DataBase = require('../db/db.js');
const { SocketAuth } = require('../auth/MerakiAuth.js');
const SocketConnection = require('./SocketConnection');
const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;
function initializeMiraqiSocket(io, sessionStore, queueProcessor) {
    return __awaiter(this, void 0, void 0, function* () {
        SocketAuth(io, sessionStore);
        io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`creating socket with socketId:${socket.id}`);
            let socketConnection = new SocketConnection(io, socket, queueProcessor);
        }));
    });
}
module.exports = initializeMiraqiSocket;
//# sourceMappingURL=SocketService.js.map