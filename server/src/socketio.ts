"use strict";

// Socket IO
import ioServer = require("socket.io");

import SocketEvents = require("./constants/SocketEvents");

import MatchService = require("./services/match.service");
import UserService = require("./services/user.service");

export = function createConnection(http: any) {
  const options: { cors: boolean; origins: string[] } = {
    cors: true,
    origins: ["*"],
  };

  const io = ioServer(http, options);

  io.on(SocketEvents.CLIENT_CONNECT, (socket: ioServer.Socket) => {
    
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
