"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MatchModel = require("../models/match.model");
const UserModel = require("../models/user.model");
const UserService = require("./user.service");
const SocketEvents = require("../constants/SocketEvents");
const MatchStatus = require("../constants/MatchStatus");
const Time = require("../utils/Time");
const QuestionUtil = require("../utils/QuestionUtil");
exports.CreateMatch = async (ownerId) => {
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
exports.JoinMatch = async (userId, matchId) => {
    await MatchModel.JoinMatch(matchId, userId);
};
exports.JoinRoom = async (matchId, userId, socket, io) => {
    let ownerId;
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
exports.SetUserReady = async (matchId, userId, io, socket) => {
    let _match = await MatchModel.GetMatchById(matchId);
    let ownerId = _match.owner_id;
    if (userId.toString() === ownerId.toString()) {
        await MatchModel.SetUserReady(userId, matchId, true);
    }
    else {
        await MatchModel.SetUserReady(userId, matchId, false);
    }
    io.to(matchId).emit(SocketEvents.SERVER_PLAYER_READY, { userId });
    if (_match.owner_ready || _match.opponent_ready) {
        exports.StartMatch(matchId, io, socket);
    }
};
exports.AnswerQuestion = async (userId, matchId, questionId, answerId, correctAnswer) => {
    let _match = await MatchModel.GetMatchById(matchId);
    const isMatchOwner = _match.owner_id == userId;
    const playerOldScore = isMatchOwner
        ? _match.owner_score
        : _match.opponent_score;
    const rightAnswerScore = correctAnswer == answerId ? 10 : 0;
    const score = playerOldScore + rightAnswerScore;
    await MatchModel.PlayerAnswerQuestion(isMatchOwner, matchId, score, answerId);
};
exports.StartMatch = async (matchId, io, socket) => {
    io.to(matchId).emit(SocketEvents.SERVER_MATCH_START);
    await MatchModel.UpdateMatchStatus(matchId, 3);
    await Time.waitMS(MatchModel.TIME_BEFORE_START_FIRST_ROUND);
    exports.PlayNextRound(matchId, io, socket);
};
exports.PlayNextRound = async (matchId, io, socket) => {
    let _match = await MatchModel.GetMatchById(matchId);
    if (_match.round === MatchModel.TOTAL_ROUNDS) {
        exports.EndMatch(matchId, io, socket);
        return;
    }
    const randomQuestion = QuestionUtil.GetRandomQuestion(_match.last_question);
    const round = _match.round + 1;
    await MatchModel.UpdateMatchRound(matchId, 3, round, 0, 0, (!_match.last_question ? randomQuestion.id.toString() : `${_match.last_question},${randomQuestion.id.toString()}`));
    io.to(matchId).emit(SocketEvents.SERVER_MATCH_START_ROUND, {
        currentRound: round,
        totalRound: MatchModel.TOTAL_ROUNDS,
    });
    await Time.waitMS(MatchModel.TIME_BEFORE_SEND_QUESTION);
    io.to(matchId).emit(SocketEvents.SERVER_MATCH_START_QUESTION, {
        id: randomQuestion.id,
        title: randomQuestion.text,
        answer1: randomQuestion.answers[0],
        answer2: randomQuestion.answers[1],
        answer3: randomQuestion.answers[2],
        answer4: randomQuestion.answers[3],
        correctAnswer: randomQuestion.correct,
    });
    await Time.waitMS(MatchModel.TIME_BEFORE_COUNTDOWN);
    let userDisconnected = false;
    _match = await MatchModel.GetMatchById(matchId);
    await Time.countdownFrom(MatchModel.ROUND_COUNTDOWN_TIME, async (counted, stopCounting) => {
        io.to(matchId).emit(SocketEvents.SERVER_MATCH_COUNTDOWN, {
            seconds: counted,
        });
        if (_match.owner_disconnected == 0 || _match.opponent_disconnected == 0) {
            userDisconnected = true;
            return;
        }
        if (_match.owner_last_answer && _match.opponent_last_answer) {
            stopCounting();
        }
    });
    _match = await MatchModel.GetMatchById(matchId);
    io.to(matchId).emit(SocketEvents.SERVER_MATCH_END_ROUND, {
        owner: {
            id: _match.owner_id,
            answer: _match.owner_last_answer,
            score: _match.owner_score,
        },
        opponent: {
            id: _match.opponent_id,
            answer: _match.opponent_last_answer,
            score: _match.opponent_score,
        },
        correctAnswer: randomQuestion.correct,
    });
    await Time.waitMS(MatchModel.TIME_BEFORE_NEW_ROUND);
    if (userDisconnected) {
        exports.EndMatch(matchId, io, socket);
        return;
    }
    exports.PlayNextRound(matchId, io, socket);
};
exports.SendInvite = async (matchId, opponentId, ownerId, io) => {
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
exports.DenyInvite = async (matchId, ownerId, io) => {
    let owner_socketId = await UserService.GetUserSocketIdById(ownerId);
    MatchModel.DeleteMatch(matchId);
    io.to(owner_socketId).emit(SocketEvents.SERVER_PLAYER_DENIED_INVITE, { matchId });
};
exports.EndMatch = async (matchId, io, socket) => {
    const match = await MatchModel.GetMatchById(matchId);
    const isTied = match.owner_score == match.opponent_score;
    const ownerHasWinned = match.owner_score > match.opponent_score;
    const someoneScored = match.owner_score > 0 || match.opponent_score > 0;
    const ownerInfo = await UserModel.GetPlayerInfoOnEndMatch(match.owner_id);
    const opponentInfo = await UserModel.GetPlayerInfoOnEndMatch(match.opponent_id);
    let ownerMaxTrophies = ownerInfo.max_trophies;
    let ownerTotalWins = ownerInfo.total_wins;
    let ownerTotalLosses = ownerInfo.total_losses;
    let ownerTotalTies = ownerInfo.total_ties;
    let ownerTotalGames = ownerInfo.total_games;
    let ownerTrophies = ownerInfo.trophies;
    let ownerCoins = ownerInfo.coins;
    let opponentMaxTrophies = opponentInfo.max_trophies;
    let opponentTotalWins = opponentInfo.total_wins;
    let opponentTotalLosses = opponentInfo.total_losses;
    let opponentTotalTies = opponentInfo.total_ties;
    let opponentTotalGames = opponentInfo.total_games;
    let opponentTrophies = opponentInfo.trophies;
    let opponentCoins = opponentInfo.coins;
    if (!match.owner_disconnected) {
        if (someoneScored) {
            ownerTotalGames = ownerInfo.total_games + 1;
            if (isTied) {
                ownerTotalTies = ownerInfo.total_ties + 1;
            }
            else {
                ownerTotalWins = ownerInfo.total_wins + (ownerHasWinned ? 1 : 0);
                ownerTrophies = ownerHasWinned
                    ? ownerInfo.trophies + UserModel.TROPHIES_MATCH_WINNED
                    : ownerInfo.trophies <= 4 ? 0 : ownerInfo.trophies - UserModel.TROPHIES_MATCH_LOST;
                ownerCoins = ownerHasWinned
                    ? ownerInfo.coins + UserModel.COINS_MATCH_WINNED
                    : ownerInfo.coins <= 10 ? 0 : ownerInfo.coins - UserModel.COINS_MATCH_LOST;
                ownerMaxTrophies = ownerTrophies > ownerInfo.trophies ? ownerTrophies : ownerInfo.trophies;
                if (!match.opponent_disconnected)
                    ownerTotalLosses = ownerInfo.total_losses + (!ownerHasWinned ? 1 : 0);
            }
        }
    }
    else {
        ownerTotalLosses = ownerInfo.total_losses + 1;
    }
    if (!match.opponent_disconnected) {
        if (someoneScored) {
            opponentTotalGames = opponentInfo.total_games + 1;
            if (isTied) {
                opponentTotalTies = opponentInfo.total_ties + 1;
            }
            else {
                opponentTotalWins = opponentInfo.total_wins + (!ownerHasWinned ? 1 : 0);
                opponentTrophies = !ownerHasWinned
                    ? opponentInfo.trophies + UserModel.TROPHIES_MATCH_WINNED
                    : opponentInfo.trophies <= 4 ? 0 : opponentInfo.trophies - UserModel.TROPHIES_MATCH_LOST;
                opponentCoins = !ownerHasWinned
                    ? opponentInfo.coins + UserModel.COINS_MATCH_WINNED
                    : opponentInfo.coins <= 10 ? 0 : opponentInfo.coins - UserModel.COINS_MATCH_LOST;
                opponentMaxTrophies = opponentTrophies > opponentInfo.trophies ? opponentTrophies : opponentInfo.trophies;
                if (!match.owner_disconnected)
                    opponentTotalLosses = opponentInfo.total_losses + (!ownerHasWinned ? 1 : 0);
            }
        }
    }
    else {
        opponentTotalLosses = opponentInfo.total_losses + 1;
    }
    if (someoneScored && !isTied) {
        if (!match.owner_disconnected && !match.opponent_disconnected) {
            // Update match winner
            console.log("Update match winner");
        }
    }
    await UserModel.UpdatePlayerOnEndMatch(match.owner_id, ownerTrophies, ownerCoins, ownerTotalWins, ownerTotalLosses, ownerTotalTies, ownerMaxTrophies, ownerTotalGames);
    await UserModel.UpdatePlayerOnEndMatch(match.opponent_id, opponentTrophies, opponentCoins, opponentTotalWins, opponentTotalLosses, opponentTotalTies, opponentMaxTrophies, opponentTotalGames);
    if (match.match_status.toString() != MatchStatus.DISCONNECTED) {
        await MatchModel.UpdateMatchStatus(matchId, 5);
    }
    io.to(matchId).emit(SocketEvents.SERVER_MATCH_END, {
        owner: {
            id: match.owner_id,
            score: match.owner_score,
            winned: someoneScored && !isTied && ownerHasWinned,
            coins: ownerCoins,
            trophies: ownerTrophies
        },
        opponent: {
            id: match.opponent_id,
            score: match.opponent_score,
            winned: someoneScored && !isTied && !ownerHasWinned,
            coins: opponentCoins,
            trophies: opponentTrophies
        },
    });
    socket.leave(matchId);
};
exports.DisconnectUserFromMatch = async (socketId, io, socket) => {
    const user_id = await UserModel.GetUserIdBySocketId(socketId);
    if (user_id) {
        const match = await MatchModel.GetMatchByPlayerId(parseInt(user_id));
        if (match) {
            const isMatchOwner = user_id === match.owner_id.toString();
            if (match.match_status.toString() === MatchStatus.LOBBY) {
                if (isMatchOwner) {
                    await MatchModel.DeleteMatch(match.match_id);
                }
                else {
                    await MatchModel.DeleteMatch(match.match_id);
                }
                io.to(match.match_id).emit(SocketEvents.SERVER_PLAYER_LEFT, {
                    isMatchOwner,
                    userId: isMatchOwner ? match.owner_id : match.opponent_id,
                });
            }
            if (match.match_status.toString() === MatchStatus.PLAYING) {
                await MatchModel.PlayerLeftMatch(isMatchOwner, match.match_id);
            }
            socket.leave(match.match_id);
        }
    }
};
//# sourceMappingURL=match.service.js.map