import {
  CREATE_MATCH,
  JOIN_MATCH,
  SET_LOADING,
  MATCH_READY,
  SET_OPPONENT_READY,
  SET_READY,
  SET_GAME,
  START_MATCH,
  SET_ROUND,
  ROUND_RESULT,
  ROUND_COUNTDOWN,
  START_QUESTION,
  HANDLE_INVITE,
  MATCH_RESULT,
  MATCH_END
} from "../types";
import { Action, State } from "./match.type";

export const initialState: State = {
  _id: "",
  ownerId: "",
  ownerInfo: {
    id: 0,
    username: "",
    trophies: 0,
    name: "",
    coins: 0,
    avatar: 0,
  },
  opponentInfo: {
    id: 0,
    username: "",
    trophies: 0,
    name: "",
    coins: 0,
    avatar: 0,
  },
  userReady: false,
  opponentReady: false,
  receivedInvite: false,
  invite: {
    matchId: "",
    ownerInfo: {
      id: 0,
      username: "",
      trophies: 0,
      avatar: 0,
    },
  },
  game: {
    currentRound: 1,
    totalRound: 5,
    showRoundScreen: false,
  },
  round: {
    questionId: "",
    questionText: "",
    showCorrectAnswer: false,
    answers: [],
    correctAnswer: 0,
    roundTime: "",
  },
  roundResult: {
    ownerSelected: 0,
    opponentSelected: 0,
    ownerScore: 0,
    opponentScore: 0,
  },
  matchResult: {
    owner:{    
      score: 0,
      winned: false,
      coins: 0,
      trophies: 0,
    },
    opponent: {
      score: 0,
      winned: false,
      coins: 0,
      trophies: 0,
    },
  },
  matchStarted: false,
  loading: false,
  createMatch: () => null,
  acceptBattleInvite: () => null,
  setUserReady: () => null,
  answerQuestion: () => null,
  setLoading: () => null,
  matchEnded: () => null,
  denyBattleInvite: () => null,
};

//reducer
export default function matchReducer(
  state: State = initialState,
  action: Action
) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_MATCH:
    case JOIN_MATCH:
      return {
        ...state,
        _id: payload._id,
        ownerId: payload.ownerId,
        opponentId: payload.opponentId,
      };

    case MATCH_READY:
      return {
        ...state,
        ownerInfo: payload.ownerInfo,
        opponentInfo: payload.opponentInfo,
      };

    case SET_READY:
      return {
        ...state,
        userReady: true,
      };

    case SET_OPPONENT_READY:
      return {
        ...state,
        opponentReady: true,
      };

    case HANDLE_INVITE:
      return {
        ...state,
        receivedInvite: true,
        invite: { matchId: payload.matchId, ownerInfo: payload.ownerInfo },
        loading: false,
      };

    case SET_GAME:
      return {
        ...state,
        game: {
          currentRound: payload.currentRound,
          totalRound: payload.totalRound,
          showRoundScreen: true,
        },
      };

    case START_QUESTION:
      return {
        ...state,
        game: {
          ...state.game,
          showRoundScreen: false,
        },
      };

    case SET_ROUND:
      return {
        ...state,
        round: {
          questionId: payload.questionId,
          questionText: payload.questionText,
          showCorrectAnswer: false,
          answers: payload.answers,
          correctAnswer: payload.correctAnswer,
          roundTime: "",
        },
      };

    case ROUND_COUNTDOWN:
      return {
        ...state,
        round: {
          ...state.round,
          roundTime: payload.roundTime,
        },
      };

    case START_MATCH:
      return {
        ...state,
        matchStarted: true,
      };

    case ROUND_RESULT:
      return {
        ...state,
        roundResult: {
          ownerSelected: payload.ownerSelected,
          opponentSelected: payload.opponentSelected,
          ownerScore: payload.ownerScore,
          opponentScore: payload.opponentScore,
        },
        round: {
          ...state.round,
          showCorrectAnswer: true,
        },
      };

    case MATCH_RESULT:
      return {
        ...state,
        matchResult: {
          owner: payload.owner,
          opponent: payload.opponent,
        },
      };

    case MATCH_END:
      return {
        ...state,
        _id: "",
        ownerId: "",
        ownerInfo: {
          id: 0,
          username: "",
          trophies: 0,
          name: "",
          coins: 0,
          avatar: 0,
        },
        opponentInfo: {
          id: 0,
          username: "",
          trophies: 0,
          name: "",
          coins: 0,
          avatar: 0,
        },
        userReady: false,
        opponentReady: false,
        receivedInvite: false,
        invite: {
          matchId: "",
          ownerInfo: {
            id: 0,
            username: "",
            trophies: 0,
            avatar: 0,
          },
        },
        game: {
          currentRound: 1,
          totalRound: 5,
          showRoundScreen: false,
        },
        round: {
          questionId: "",
          questionText: "",
          showCorrectAnswer: false,
          answers: [],
          correctAnswer: 0,
          roundTime: "",
        },
        roundResult: {
          ownerSelected: 0,
          opponentSelected: 0,
          ownerScore: 0,
          opponentScore: 0,
        },
        matchResult: {
          owner:{    
            score: 0,
            winned: false,
            coins: 0,
            trophies: 0,
          },
          opponent: {
            score: 0,
            winned: false,
            coins: 0,
            trophies: 0,
          },
        },

      }

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}
