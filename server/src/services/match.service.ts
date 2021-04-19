"use strict";

import MatchModel = require("../models/match.model");

import UserModel = require("../models/user.model");
import UserService = require("./user.service");

import SocketEvents = require("../constants/SocketEvents");

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

export const SetUserReady = async (matchId: number, userId: number, io: any) => {

  let _match: MatchModel = await MatchModel.GetMatchById(matchId);

  let ownerId = _match.owner_id;

  if(userId.toString() === ownerId.toString()){
    await MatchModel.SetUserReady(userId, matchId, true);
  }
  else{
    await MatchModel.SetUserReady(userId, matchId, false);
  }

  io.to(matchId).emit(SocketEvents.SERVER_PLAYER_READY, { userId });

  if(_match.owner_ready || _match.opponent_ready){
    //start match

  }


}

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

  let opponent_socketId: string | IErrorResponse = await UserService.GetUserSocketIdById(opponentId);

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
