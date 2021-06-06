import React from 'react';
import socketio from "socket.io-client";

//http://localhost:3001
export const socket: SocketIOClient.Socket = socketio.connect('/api');
export const SocketContext = React.createContext(socket);
