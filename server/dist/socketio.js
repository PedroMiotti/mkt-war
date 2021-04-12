"use strict";
// Socket IO
const ioServer = require("socket.io");
const SocketEvents = require("./constants/SocketEvents");
const MatchService = require("./services/match.service");
module.exports = function createConnection(http) {
    const options = {
        cors: true,
        origins: ["*"],
    };
    const io = ioServer(http, options);
    io.on(SocketEvents.CLIENT_CONNECT, (socket) => {
        // Socket events goes here
        console.log('connected ' + socket.id);
        socket.on(SocketEvents.CLIENT_INVITE_PLAYER, ({ matchId, ownerId, opponent_id }) => MatchService.SendInvite(matchId, ownerId, opponent_id, io));
        socket.on(SocketEvents.CLIENT_CONFIRM_INVITE, ({ matchId, userId }) => MatchService.JoinMatch(matchId, userId, io));
    });
    return io;
};
//# sourceMappingURL=socketio.js.map