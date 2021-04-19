import {
  CREATE_MATCH,
  JOIN_MATCH,
  SET_LOADING,
  MATCH_READY,
  SET_OPPONENT_READY,
  SET_READY,
  HANDLE_INVITE,
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
  matchLoaded: false,
  loading: false,

  createMatch: () => null,
  acceptBattleInvite: () => null,

  setUserReady: () => null,

  setLoading: () => null,
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
        matchLoaded: true,
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
        userReady: true ,
      };

    case SET_OPPONENT_READY:
      return {
        ...state,
        opponentReady: true ,
      };

    case HANDLE_INVITE:
      return {
        ...state,
        receivedInvite: true,
        invite: { matchId: payload.matchId, ownerInfo: payload.ownerInfo },
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}
