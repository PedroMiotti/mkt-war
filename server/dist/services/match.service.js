"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendInvite = exports.JoinRoom = exports.JoinMatch = exports.CreateMatch = void 0;
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
const JoinMatch = async (userId, matchId) => {
    await MatchModel.JoinMatch(matchId, userId);
};
exports.JoinMatch = JoinMatch;
const JoinRoom = async (matchId, userId, socket, io) => {
    let ownerId;
    let owner;
    let opponent;
    let matchPlayers = {
        owner: {
            id: 0,
            name: "",
            username: "",
            trophies: 0,
            avatar: 0,
            coins: 0,
        },
        opponent: {
            id: 0,
            name: "",
            username: "",
            trophies: 0,
            avatar: 0,
            coins: 0,
        },
    };
    socket.join(matchId);
    let getMatchInfo = await MatchModel.GetMatchById(matchId);
    ownerId = getMatchInfo.owner_id;
    let ownerInfo = await UserModel.profile(ownerId);
    matchPlayers.owner = ownerInfo;
    if (getMatchInfo.opponent_id) {
        let opponentInfo = await UserModel.profile(getMatchInfo.opponent_id);
        matchPlayers.opponent = opponentInfo;
    }
    io.to(matchId).emit(SocketEvents.SERVER_PLAYER_JOINED, matchPlayers);
};
exports.JoinRoom = JoinRoom;
const SendInvite = async (matchId, opponentId, ownerId, io) => {
    let ownerInvite = { id: 0, username: "", trophies: 0, avatar: 0 };
    let opponent_socketId = await UserService.GetUserSocketIdById(opponentId);
    let ownerInfo = await UserModel.profile(ownerId);
    ownerInvite.id = ownerInfo.id;
    ownerInvite.username = ownerInfo.username;
    ownerInvite.trophies = ownerInfo.trophies;
    ownerInvite.avatar = ownerInfo.avatar;
    io.to(opponent_socketId).emit(SocketEvents.SERVER_SEND_INVITE, {
        matchId,
        ownerInvite,
    });
};
exports.SendInvite = SendInvite;
//# sourceMappingURL=match.service.js.map