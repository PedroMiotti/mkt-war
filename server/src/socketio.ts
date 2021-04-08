// Socket IO
// const socketio = require('socket.io');
import ioServer = require('socket.io');


export = function createConnection(http: any){
  const options:{cors: boolean, origins: string[]} = {
   cors:true,
   origins:["*"],
  }

  const io = ioServer(http, options);

  io.on('connect', (socket: ioServer.Socket) => {

    // Socket events goes here
    console.log('connected' + socket.id);
  });

  return io;

}
