import { Server } from "socket.io";
import { Store } from "express-session";
import { Queue } from "bull";
import QueueProcessor from './../worker/QueueProcessor';

const DataBase = require("../db/db.js");
const { SocketAuth } = require("../auth/MerakiAuth.js");
const SocketConnection = require("./SocketConnection");

const SOCKET_DISCONNECT_TIMEOUT_MS = 5000;

export default async function initializeMiraqiSocket(io: Server, sessionStore: Store, queueProcessor: QueueProcessor) {
  SocketAuth(io, sessionStore);
  io.on("connection", async socket => {
    console.log(`creating socket with socketId:${socket.id}`);
    let socketConnection = new SocketConnection(io, socket, queueProcessor);
  });
}