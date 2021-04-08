"use strict";
// Socket IO
// const socketio = require('socket.io');
const ioServer = require("socket.io");
module.exports = function createConnection(http) {
    const options = {
        cors: true,
        origins: ["*"],
    };
    const io = ioServer(http, options);
    io.on('connect', (socket) => {
        // Socket events goes here
        console.log('connected' + socket.id);
    });
    return io;
};
//# sourceMappingURL=socketio.js.map