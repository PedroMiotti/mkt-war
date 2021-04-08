import { message } from "antd";
import {SocketContext} from '../socket';
import * as React from "react";
import {
  CREATE_ROOM,
  JOIN_ROOM,
  SET_LOADING,
  SET_CURRENT_USER,
  LEAVE_ROOM,
} from "../types";
import RoomContext from "./user.context";
import roomReducer, { initialState as initialValues } from "./user.reducer";
import {  IRoom, State } from "./user.type";
// import history from 'utils/history';

const RoomState: React.FC = ({ children }) => {
  const initialState: State = {
    ...initialValues,
  };

const socket = React.useContext(SocketContext);

  const [state, dispatch] = React.useReducer(roomReducer, initialState);

  // create room
  const createRoom = (values: { username: string; roomName: string }) => {
    try {
      const { username, roomName } = values;
      const body = {
        username,
        roomName,
      };
      socket.emit("create:room", body);

      socket.on("update:room", (room: IRoom) => {
        dispatch({
          type: CREATE_ROOM,
          payload: room,
        });
        // history.push(`/room/${room._id}`);
      });
      setRoomUser(username); // set username in state
    } catch (error) {
      console.log(error);
    }
  };

  // join room
  const joinRoom = (values: { username: string; roomID: string }) => {
    try {
      const { username, roomID } = values;
      const body = {
        username,
        roomID,
      };
      socket.emit("join:room", body, (error: any) => {
        //callback fun
        if (error) {
          return message.error(error.msg);
        }
      });

      setRoomUser(username); // set username in state

      socket.on("update:room", (room: IRoom) => {
        dispatch({
          type: JOIN_ROOM,
          payload: room,
        });
        // history.push(`/room/${roomID}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // set user in state
  const setRoomUser = (username: string) => {
    dispatch({
      type: SET_CURRENT_USER,
      payload: username,
    });
  };

  // set loading
  const setLoading = () => {
    dispatch({
      type: SET_LOADING,
    });
  };

  //leave room
  const leaveRoom = () => {
    dispatch({
      type: LEAVE_ROOM,
    });
  };

  return (
    <RoomContext.Provider
      value={{
        _id: state._id,
        currentUser: state.currentUser,
        activeUsers: state.activeUsers,
        roomLoaded: state.roomLoaded,
        loading: state.loading,
        createRoom,
        joinRoom,
        setLoading,
        setRoomUser,
        leaveRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomState;
