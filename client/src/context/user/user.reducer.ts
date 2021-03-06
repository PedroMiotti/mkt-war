import {
  CREATE_USER,
  LOGIN,
  UPDATE_USER,
  LOGOUT,
  DELETE_USER,
  USER_PROFILE,
  ONLINE_PLAYERS,
  SET_LOADING,
  SET_ERROR,
  UPDATE_AVATAR,
  LEADERBOARD
} from "../types";
import { Action, State } from "./user.type";

import { getCookie, deleteCookie } from "../../utils/handleCookie";

let hasToken: string = getCookie("_token");

export const initialState: State = {
  id: "",
  isLoggedIn: hasToken ? true : false,
  socketID: "",
  name: "",
  username: "",
  trophies: "",
  coins: "",
  avatar: "",
  onlinePlayers: [],
  errorMsg: "",
  loading: false,
  leaderboard: [],

  createUser: () => null,
  login: () => null,
  updateUser: () => null,
  logout: () => null,
  deleteUser: () => null,
  userProfile: () => null,
  setLoading: () => null,
  getOnlinePlayers: () => null,
  setUserOnline: () => null,
  updateUserAvatar: () => null,
  getLeaderboard: () => null,

};

//reducer
export default function roomReducer(
  state: State = initialState,
  action: Action
) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_USER:
      return {
        ...state,
        id: payload.id,
        name: payload.name,
        username: payload.username,
      };

    case LOGIN:
      return {
        ...state,
        id: payload.id,
        username: payload.username,
        errorMsg: "",
      };

    case USER_PROFILE:
      return {
        ...state,
        name: payload.name,
        username: payload.username,
        avatar: payload.avatar,
        coins: payload.coins,
        trophies: payload.trophies,
      };

      case UPDATE_AVATAR:
      return {
        ...state,
        avatar: payload.avatarId,
      };

    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT:
      return {
        ...state,
        id: "",
        isLoggedIn:  false,
        socketID: "",
        name: "",
        username: "",
        trophies: "",
        coins: "",
        avatar: "",
        errorMsg: "",
        loading: false,
      };

    case DELETE_USER:
      return {
        ...state,
      };

    case ONLINE_PLAYERS:
      return {
        ...state,
        onlinePlayers: payload.onlinePlayers,
      };

    case LEADERBOARD:
      return {
        ...state,
        leaderboard: payload.leaderboard,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_ERROR:
      return {
        ...state,
        loading: false,
        errorMsg: payload.message,
      };

    default:
      return state;
  }
}
