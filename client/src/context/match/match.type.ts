export interface IUser {
  username: string;
  socketID: string;
  _id: string;
}

export interface IPlayer{
  id: number;
  username: string;
  trophies: number;
  name: string;
  coins: number;
  avatar: number;
}

export interface IRoom {
  _id: string;
  roomName: string;
  activeUsers: IUser[];
}

export interface State {
  _id: string;
  ownerId: string;
  ownerInfo: IPlayer;
  opponentInfo: IPlayer;
  userReady: boolean;
  opponentReady: boolean;
  receivedInvite: boolean;
  invite: {
    matchId: string;
    ownerInfo: {
      id: number;
      username: string;
      trophies: number;
      avatar: number;
    };
  };
  matchLoaded: boolean;
  loading: boolean;

  createMatch: (ownerId: string, opponentId: string) => void;
  acceptBattleInvite: (
    userId: string,
    matchId: string,
    ownerId: string
  ) => void;

  setUserReady: (matchId: string) => void;

  setLoading: (roomID: string) => void;
}

export interface Action {
  payload?: any;
  type: string;
}
