import React from 'react'
import Config from "../Config";
import io from "socket.io-client";

const socket = io.connect(Config.SOCKET_API_HOST);
const SocketContext = React.createContext(socket);

export default SocketContext;