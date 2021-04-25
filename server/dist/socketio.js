"use strict";
// Socket IO
const ioServer = require("socket.io");
const SocketEvents = require("./constants/SocketEvents");
const MatchService = require("./services/match.service");
const UserService = require("./services/user.service");
module.exports = function createConnection(http) {
    const options = {
        cors: true,
        origins: ["*"],
    };
    const io = ioServer(http, options);
    io.on(SocketEvents.CLIENT_CONNECT, (socket) => {
        console.log("connected " + socket.id);
        socket.on(SocketEvents.CLIENT_UPDATE_STATUS, ({ userId }) => UserService.UserConnected(userId, socket.id));
        socket.on(SocketEvents.CLIENT_INVITE_PLAYER, ({ matchId, opponentId, ownerId }) => MatchService.SendInvite(matchId, opponentId, ownerId, io));
        socket.on(SocketEvents.CLIENT_JOIN_MATCH, ({ matchId, userId }) => MatchService.JoinRoom(matchId, userId, socket, io));
        socket.on(SocketEvents.CLIENT_USER_READY, ({ matchId, userId }) => MatchService.SetUserReady(matchId, userId, io, socket));
        socket.on(SocketEvents.CLIENT_ANSWER_QUESTION, ({ matchId, userId, questionId, answerId, correctAnswer }) => MatchService.AnswerQuestion(userId, matchId, questionId, answerId, correctAnswer));
        socket.on(SocketEvents.CLIENT_DISCONNECT, () => MatchService.DisconnectUserFromMatch(socket.id, io, socket));
    });
    return io;
};
//# sourceMappingURL=socketio.js.map