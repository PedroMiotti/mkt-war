export interface IUser {
  username: string;
  socketID: string;
  _id: string;
}

export interface IPlayer {
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

export interface IAnswer {
  id: number;
  text: string;
}

export interface IRound {
  questionId: string;
  questionText: string;
  showCorrectAnswer: boolean;
  answers: IAnswer[];
  correctAnswer: number;
  roundTime: string;
}

export interface IGame {
  currentRound: number;
  totalRound: number;
  showRoundScreen: boolean;
}

export interface IRoundResult {
  ownerSelected: number;
  opponentSelected: number;
  ownerScore: number;
  opponentScore: number;
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
  matchStarted: boolean;
  game: IGame;
  round: IRound;
  roundResult: IRoundResult;
  loading: boolean;
  createMatch: (ownerId: string, opponentId: string) => void;
  acceptBattleInvite: (
    userId: string,
    matchId: string,
    ownerId: string
  ) => void;
  setUserReady: (matchId: string) => void;
  answerQuestion: (
    matchId: number,
    questionId: string,
    answerId: number,
    correctAnswer: number
  ) => void;
  setLoading: (roomID: string) => void;
}

export interface Action {
  payload?: any;
  type: string;
}
