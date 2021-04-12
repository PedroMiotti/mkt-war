"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendInvite = exports.JoinMatch = exports.CreateMatch = void 0;
const MatchModel = require("../models/match.model");
const UserModel = require("../models/user.model");
const UserService = require("./user.service");
const SocketEvents = require("../constants/SocketEvents");
const CreateMatch = async (ownerId) => {
    if (!ownerId)
        return {
            errorCode: 4,
            data: "Usuário não encontrado !",
        };
    let match_id = await MatchModel.CreateMatch(ownerId);
    if (!match_id)
        return {
            errorCode: 5,
            data: "Erro interno. Missing match_id",
        };
    return match_id;
};
exports.CreateMatch = CreateMatch;
const JoinMatch = async (matchId, userId, socket) => {
    let matchPlayers;
    let ownerId;
    socket.join(matchId);
    let getMatchInfo = await MatchModel.GetMatchById(matchId);
    ownerId = getMatchInfo.owner_id;
    let ownerInfo = await UserModel.profile(userId);
    let opponentInfo = await UserModel.profile(userId);
    matchPlayers.owner = ownerInfo;
    matchPlayers.opponent = opponentInfo;
    socket.to(matchId).emit(SocketEvents.SERVER_PLAYER_JOINED, matchPlayers);
};
exports.JoinMatch = JoinMatch;
const SendInvite = async (matchId, opponentId, ownerId, socket) => {
    if (!opponentId)
        return {
            errorCode: 4,
            data: "Selecione um oponente !",
        };
    console.log('send');
    let opponent_socketId = await UserService.GetUserSocketIdById(opponentId);
    if (typeof opponent_socketId !== "string")
        return opponent_socketId;
    socket.to(opponent_socketId).emit(SocketEvents.SERVER_SEND_INVITE, { matchId, ownerId });
};
exports.SendInvite = SendInvite;
//# sourceMappingURL=match.service.js.map