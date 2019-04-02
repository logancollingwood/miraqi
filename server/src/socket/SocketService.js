const DataBase = require('../db/db.js');
const { SocketAuth } = require('../auth/MerakiAuth.js');
const SocketConnection = require('./SocketConnection');

const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;

async function initializeMiraqiSocket(io, sessionStore, queueProcessor) {
    SocketAuth(io, sessionStore);
    io.on('connection', async (socket) => {
        console.log(`creating socket with socketId:${socket.id}`)
        let socketConnection = new SocketConnection(io, socket, queueProcessor);        
    })
}

module.exports = initializeMiraqiSocket;