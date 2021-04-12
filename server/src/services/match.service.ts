"use strict";

import MatchModel = require('../models/match.model');

import UserModel = require('../models/user.model');
import UserService = require('./user.service');

import SocketEvents = require('../constants/SocketEvents');

interface IErrorResponse{
 errorCode: number;
 data: string;
}

export const CreateMatch = async (ownerId: number): Promise<number | IErrorResponse> => {

  if(!ownerId)
      return {
        errorCode: 4,
        data: "Usuário não encontrado !",
      };

  let match_id = await MatchModel.CreateMatch(ownerId);

  if(!match_id)
      return {
        errorCode: 5,
        data: "Erro interno. Missing match_id",
      };

  return match_id;

}

export const JoinMatch = async (matchId: number, userId:number, socket: any) => {
  let matchPlayers: { owner: UserModel, opponent: UserModel };
  let ownerId: number;

  socket.join(matchId);

  let getMatchInfo: MatchModel = await MatchModel.GetMatchById(matchId)

  ownerId = getMatchInfo.owner_id;

  let ownerInfo: UserModel = await UserModel.profile(userId)

  let opponentInfo: UserModel = await UserModel.profile(userId)

  matchPlayers.owner = ownerInfo;
  matchPlayers.opponent = opponentInfo;

  socket.to(matchId).emit(SocketEvents.SERVER_PLAYER_JOINED, matchPlayers);
  

}


export const SendInvite = async (matchId: number, opponentId: number, ownerId: number, socket: any) => {

  if(!opponentId)
      return {
        errorCode: 4,
        data: "Selecione um oponente !",
      };


  console.log('send');
  
  let opponent_socketId: string | IErrorResponse = await UserService.GetUserSocketIdById(opponentId)

  if(typeof opponent_socketId !== "string")
    return opponent_socketId;

  socket.to(opponent_socketId).emit(SocketEvents.SERVER_SEND_INVITE, { matchId, ownerId });


}
