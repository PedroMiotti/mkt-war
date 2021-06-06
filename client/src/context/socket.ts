import React from 'react';
import socketio from "socket.io-client";

//http://localhost:3001
// , { path: "/api-v1/socket.io" }
export const socket: SocketIOClient.Socket = socketio.connect("/api-v1", { path: "/socket" });
export const SocketContext = React.createContext(socket);
