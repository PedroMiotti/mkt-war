import React from 'react';
import socketio from "socket.io-client";

// export const socket: SocketIOClient.Socket = socketio.connect();
let _socket: SocketIOClient.Socket;
if(process.env.NODE_ENV === "development"){
    _socket = socketio.connect("http://localhost:3001");
}else{
    _socket = socketio.connect();
}

export const socket = _socket;
export const SocketContext = React.createContext(socket);


// "proxy": "/api-v1",
