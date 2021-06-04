import * as React from "react";

// Ant Design
import { notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { SocketContext } from "../socket";
import { instance as axios } from "../api";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";
import { deleteCookie } from "../../utils/handleCookie";
import history from "../../utils/history";

// Constantss
import SocketEvents from "../../constants/SocketEvents";


import {
  CREATE_USER,
  LOGIN,
  LOGOUT,
  USER_PROFILE,
  ONLINE_PLAYERS,
  SET_ERROR,
  UPDATE_AVATAR
} from "../types";

import UserContext from "./user.context";
import userReducer, { initialState as initialValues } from "./user.reducer";
import { State } from "./user.type";

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

          history.push("/");
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

          history.push("/");
        })
        .catch((e) => {
          dispatch({
            type: SET_ERROR,
            payload: { message: e.response.data },
          });

          // !Error:  WTF - displaying the one in the match state 
          notification.error({
            message : e.response.data,
            description : "Tente novamente !",
            icon : <LoadingOutlined style={{ color: "#161616" }} />,
            className : "antd-notification-error",      
            placement : "bottomLeft",
            bottom : 50,
            duration : 4.5,
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

  // Set user as online status
  const setUserOnline = () => {
    let user_id: IToken = getUserIdByToken();
    socket.emit(SocketEvents.CLIENT_UPDATE_STATUS, { userId: user_id.key.toString() });
  };

  const updateUserAvatar = async (avatarId: string) => {
    try {
      let user_id: IToken = getUserIdByToken();

      await axios
        .put(baseUrl + `/avatar/${user_id.key}/${avatarId}`)
        .then(() => {
          dispatch({
            type: UPDATE_AVATAR,
            payload: { avatarId },
          });
        })

    } catch (e) {
      dispatch({
        type: SET_ERROR,
        payload: { message: "Erro ao atualizar o avatar !" },
      });
    }
  }

  const updateUser = () => {};

  const deleteUser = () => {};

  const setLoading = () => {};

  const getOnlinePlayers = async () => {
    try{
      await axios.get(baseUrl + '/online')
      .then((users) => {
          dispatch({
            type: ONLINE_PLAYERS,
            payload: { onlinePlayers: users.data }
          });
      })

    }
    catch(e){
      dispatch({
        type: SET_ERROR,
        payload: { message: e.response.data },
      });
    }


  };

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
        onlinePlayers: state.onlinePlayers,
        loading: state.loading,
        errorMsg: state.errorMsg,
        createUser,
        login,
        updateUser,
        logout,
        deleteUser,
        userProfile,
        setLoading,
        getOnlinePlayers,
        setUserOnline,
        updateUserAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
