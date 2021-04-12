// Socket IO
import ioServer = require('socket.io');

import SocketEvents = require('./constants/SocketEvents');

import MatchService = require('./services/match.service');


export = function createConnection(http: any){
  const options:{cors: boolean, origins: string[]} = {
   cors:true,
   origins:["*"],
  }

  const io = ioServer(http, options);

  io.on(SocketEvents.CLIENT_CONNECT, (socket: ioServer.Socket) => {

    // Socket events goes here
    console.log('connected ' + socket.id);

    socket.on(SocketEvents.CLIENT_INVITE_PLAYER, ({ matchId, ownerId, opponent_id }) =>  MatchService.SendInvite(matchId, ownerId, opponent_id, io))
    
    socket.on(SocketEvents.CLIENT_CONFIRM_INVITE, ({matchId, userId}) => MatchService.JoinMatch(matchId, userId, io));
  });



  return io;

}
