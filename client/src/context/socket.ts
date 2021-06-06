import React from 'react';
import socketio from "socket.io-client";

//http://localhost:3001
export const socket: SocketIOClient.Socket = socketio.connect("http://111.11.111.111/api-v1");
export const SocketContext = React.createContext(socket);
