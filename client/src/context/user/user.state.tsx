import * as React from "react";

import { message } from "antd";

import { SocketContext } from "../socket";
import { instance as axios } from "../api";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";
import { getCookie, deleteCookie } from "../../utils/handleCookie";
import history from "../../utils/history";

import {
  CREATE_USER,
  LOGIN,
  UPDATE_USER,
  LOGOUT,
  DELETE_USER,
  USER_PROFILE,
  SET_LOADING,
  SET_ERROR,
} from "../types";

import UserContext from "./user.context";
import userReducer, { initialState as initialValues } from "./user.reducer";
import { IUser, State } from "./user.type";

const UserState: React.FC = ({ children }) => {
  const initialState: State = {
    ...initialValues,
  };

  const socket = React.useContext(SocketContext);

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  const baseUrl = "/api/v1/user";

  // Create User
  const createUser = async (values: {
    username: string;
    name: string;
    password: string;
  }) => {
    try {
      const { username, name, password } = values;

      await axios
        .post(
          baseUrl + "/register",
          { username, name, password },
          { withCredentials: true }
        )
        .then((res) => {
          let user_id: IToken = getUserIdByToken();

          dispatch({
            type: CREATE_USER,
            payload: { username, name, id: user_id.key.toString() },
          });

          history.push("/home");
        })
        .catch((e) => {
          dispatch({
            type: SET_ERROR,
            payload: { message: e.response.data },
          });
        });
    } catch (e) {
      dispatch({
        type: SET_ERROR,
        payload: { message: e.response.data },
      });
    }
  };

  // User login
  const login = async (values: { username: string; password: string }) => {
    try {
      const { username, password } = values;

      await axios
        .post(
          baseUrl + "/login",
          { username, password },
          { withCredentials: true }
        )
        .then((res) => {
          let user_id: IToken = getUserIdByToken();

          dispatch({
            type: LOGIN,
            payload: { username, id: user_id.key.toString() },
          });

          socket.emit("online:player", { userId: user_id.key.toString() });

          history.push("/home");
        })
        .catch((e) => {
          dispatch({
            type: SET_ERROR,
            payload: { message: e.response.data },
          });
        });
    } catch (e) {
      dispatch({
        type: SET_ERROR,
        payload: { message: e.response.data },
      });
    }
  };

  // Get user information
  const userProfile = async (id: string) => {
    try {
      await axios
        .get(baseUrl + `/profile/${id}`)
        .then((res) => {
          const { name, username, avatar, coins, trophies } = res.data;

          dispatch({
            type: USER_PROFILE,
            payload: { name, username, avatar, coins, trophies },
          });
        })
        .catch((e) => {
          dispatch({
            type: SET_ERROR,
            payload: { message: e.response.data },
          });
        });
    } catch (e) {
      dispatch({
        type: SET_ERROR,
        payload: { message: e.response.data },
      });
    }
  };

  // Logout
  const logout = async (userId: string) => {

    try {
      await axios
        .delete(baseUrl + `/logout/${userId}`)
        .then(() => {

          deleteCookie("_token");

          history.push("/login");

          dispatch({
            type: LOGOUT,
          });
        })

        .catch((e) => {
          dispatch({
            type: SET_ERROR,
            payload: { message: e.response.data },
          });
        });
    } catch (e) {
      dispatch({
        type: SET_ERROR,
        payload: { message: e.response.data },
      });
    }
  };

  const updateUser = () => {};

  const deleteUser = () => {};

  const setLoading = () => {};

  return (
    <UserContext.Provider
      value={{
        id: state.id,
        isLoggedIn: state.isLoggedIn,
        socketID: state.socketID,
        username: state.username,
        name: state.name,
        trophies: state.trophies,
        coins: state.coins,
        avatar: state.avatar,
        loading: state.loading,
        errorMsg: state.errorMsg,
        createUser,
        login,
        updateUser,
        logout,
        deleteUser,
        userProfile,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
