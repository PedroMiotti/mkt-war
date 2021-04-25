"use strict";

import MatchModel = require("../models/match.model");

import UserModel = require("../models/user.model");
import UserService = require("./user.service");

import QuizQuestions = require("../assets/questions");
import SocketEvents = require("../constants/SocketEvents");
import MatchStatus = require('../constants/MatchStatus');

import Time = require("../utils/Time");

interface IErrorResponse {
  errorCode: number;
  data: string;
}

interface IPlayerInfo {
  id: number;
  name: string;
  username: string;
  trophies: number;
  avatar: number;
  coins: number;
}

export const CreateMatch = async (
  ownerId: number
): Promise<number | IErrorResponse> => {
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

export const JoinMatch = async (
  userId: number,
  matchId: number
): Promise<void> => {
  await MatchModel.JoinMatch(matchId, userId);
};

export const JoinRoom = async (
  matchId: number,
  userId: number,
  socket: any,
  io: any
) => {
  let ownerId: number;
  let owner: UserModel;
  let opponent: UserModel;

  let matchPlayers: { owner: IPlayerInfo; opponent: IPlayerInfo } = {
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

  let getMatchInfo: MatchModel = await MatchModel.GetMatchById(matchId);

  ownerId = getMatchInfo.owner_id;

  let ownerInfo: UserModel = await UserModel.profile(ownerId);

  matchPlayers.owner = ownerInfo;

  if (getMatchInfo.opponent_id) {
    let opponentInfo: UserModel = await UserModel.profile(
      getMatchInfo.opponent_id
    );

    matchPlayers.opponent = opponentInfo;
  }

  io.to(matchId).emit(SocketEvents.SERVER_PLAYER_JOINED, matchPlayers);
};

export const SetUserReady = async (
  matchId: number,
  userId: number,
  io: any,
  socket: any
) => {
  let _match: MatchModel = await MatchModel.GetMatchById(matchId);

  let ownerId = _match.owner_id;

  if (userId.toString() === ownerId.toString()) {
    await MatchModel.SetUserReady(userId, matchId, true);
  } else {
    await MatchModel.SetUserReady(userId, matchId, false);
  }

  io.to(matchId).emit(SocketEvents.SERVER_PLAYER_READY, { userId });

  if (_match.owner_ready || _match.opponent_ready) {
    StartMatch(matchId, io, socket);
  }
};

export const AnswerQuestion = async (
  userId: number,
  matchId: number,
  questionId: string,
  answerId: number,
  correctAnswer: number
) => {
  let _match: MatchModel = await MatchModel.GetMatchById(matchId);

  const isMatchOwner: boolean = _match.owner_id == userId;

  const playerOldScore = isMatchOwner
    ? _match.owner_score
    : _match.opponent_score;

  const rightAnswerScore: number = correctAnswer == answerId ? 10 : 0;

  const score = playerOldScore + rightAnswerScore;

  await MatchModel.PlayerAnswerQuestion(isMatchOwner, matchId, score, answerId);
};

export const StartMatch = async (matchId: number, io: any, socket: any) => {
  io.to(matchId).emit(SocketEvents.SERVER_MATCH_START);
  await MatchModel.UpdateMatchStatus(matchId, 3);
  await Time.waitMS(MatchModel.TIME_BEFORE_START_FIRST_ROUND);

  PlayNextRound(matchId, io, socket);
};

export const PlayNextRound = async (matchId: number, io: any, socket: any) => {
  let _match: MatchModel = await MatchModel.GetMatchById(matchId);

  if (_match.round === MatchModel.TOTAL_ROUNDS) {
    EndMatch(matchId, io, socket);
    return;
  }

  // get question
  // TODO --> Create a better logic for the question retrival
  const question = QuizQuestions.questions[0];

  const round = _match.round + 1;

  await MatchModel.UpdateMatchRound(matchId, 3, round, 0, 0, question.id.toString()
  );

  io.to(matchId).emit(SocketEvents.SERVER_MATCH_START_ROUND, {
    currentRound: round,
    totalRound: MatchModel.TOTAL_ROUNDS,
  });

  await Time.waitMS(MatchModel.TIME_BEFORE_SEND_QUESTION);

  io.to(matchId).emit(SocketEvents.SERVER_MATCH_START_QUESTION, {
    id: question.id,
    title: question.text,
    answer1: question.answers[0],
    answer2: question.answers[1],
    answer3: question.answers[2],
    answer4: question.answers[3],
    correctAnswer: question.correct,
  });

  await Time.waitMS(MatchModel.TIME_BEFORE_COUNTDOWN);

  let userDisconnected = false;

  _match = await MatchModel.GetMatchById(matchId);

  await Time.countdownFrom(
    MatchModel.ROUND_COUNTDOWN_TIME,
    async (counted, stopCounting) => {
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
    }
  );

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
    correctAnswer: question.correct,
  });

  await Time.waitMS(MatchModel.TIME_BEFORE_NEW_ROUND);

  if (userDisconnected) {
    EndMatch(matchId, io, socket)
    return;
  }

  PlayNextRound(matchId, io, socket);
};

export const SendInvite = async (
  matchId: number,
  opponentId: number,
  ownerId: number,
  io: any
) => {
  let ownerInvite: {
    id: number;
    username: string;
    trophies: number;
    avatar: number;
  } = { id: 0, username: "", trophies: 0, avatar: 0 };

  let opponent_socketId:
    | string
    | IErrorResponse = await UserService.GetUserSocketIdById(opponentId);

  let ownerInfo: UserModel = await UserModel.profile(ownerId);

  ownerInvite.id = ownerInfo.id;
  ownerInvite.username = ownerInfo.username;
  ownerInvite.trophies = ownerInfo.trophies;
  ownerInvite.avatar = ownerInfo.avatar;

  io.to(opponent_socketId).emit(SocketEvents.SERVER_SEND_INVITE, {
    matchId,
    ownerInvite,
  });
};

export const EndMatch = async (matchId: number, io: any, socket: any) => {
  const match: MatchModel = await MatchModel.GetMatchById(matchId);

  const isTied = match.owner_score == match.opponent_score;
  const ownerHasWinned = match.owner_score > match.opponent_score;
  const someoneScored = match.owner_score > 0 || match.opponent_score > 0;

  const ownerInfo = await UserModel.GetPlayerInfoOnEndMatch(match.owner_id);
  const opponentInfo = await UserModel.GetPlayerInfoOnEndMatch(match.opponent_id);

  let ownerMaxTrophies: number = ownerInfo.max_trophies;
  let ownerTotalWins: number = ownerInfo.total_wins;
  let ownerTotalLosses: number = ownerInfo.total_losses;
  let ownerTotalTies: number = ownerInfo.total_ties;
  let ownerTotalGames: number = ownerInfo.total_games;
  let ownerTrophies: number = ownerInfo.trophies;
  let ownerCoins: number = ownerInfo.coins;

  let opponentMaxTrophies: number = opponentInfo.max_trophies;
  let opponentTotalWins: number = opponentInfo.total_wins;
  let opponentTotalLosses: number = opponentInfo.total_losses;
  let opponentTotalTies: number = opponentInfo.total_ties;
  let opponentTotalGames: number = opponentInfo.total_games;
  let opponentTrophies: number = opponentInfo.trophies;
  let opponentCoins: number = opponentInfo.coins;

  if (!match.owner_disconnected) {


    if (someoneScored) {
      ownerTotalGames = ownerInfo.total_games + 1;

      if (isTied) {
        ownerTotalTies = ownerInfo.total_ties + 1;
      } else {
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
      } else {
        opponentTotalWins = opponentInfo.total_wins + (!ownerHasWinned ? 1 : 0);
        opponentTrophies = !ownerHasWinned
          ? opponentInfo.trophies + UserModel.TROPHIES_MATCH_WINNED
          : opponentInfo.trophies <= 4 ? 0 : opponentInfo.trophies - UserModel.TROPHIES_MATCH_LOST ;

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

  await UserModel.UpdatePlayerOnEndMatch(match.owner_id, ownerTrophies, ownerCoins, ownerTotalWins, ownerTotalLosses,
    ownerTotalTies, ownerMaxTrophies, ownerTotalGames);

  await UserModel.UpdatePlayerOnEndMatch(match.opponent_id, opponentTrophies, opponentCoins, opponentTotalWins, opponentTotalLosses,
    opponentTotalTies, opponentMaxTrophies, opponentTotalGames);


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

export const DisconnectUserFromMatch = async (
  socketId: string,
  io: any,
  socket: any
) => {
  const user_id = await UserModel.GetUserIdBySocketId(socketId);

  if (user_id) {
    const match = await MatchModel.GetMatchByPlayerId(parseInt(user_id));

    if (match) {
      const isMatchOwner = user_id === match.owner_id.toString();

      if (match.match_status.toString() === MatchStatus.LOBBY) {
        if (isMatchOwner) {
          await MatchModel.DeleteMatch(match.match_id);
        } else {
          await MatchModel.UpdateMatchOpponent(match.match_id);
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
