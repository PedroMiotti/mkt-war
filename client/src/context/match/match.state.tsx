import { message } from "antd";
import { SocketContext } from "../socket";
import * as React from "react";

import {
  CREATE_MATCH,
  JOIN_MATCH,
  SET_LOADING,
  MATCH_READY,
  HANDLE_INVITE,
} from "../types";

import MatchContext from "./match.context";
import matchReducer, { initialState as initialValues } from "./match.reducer";
import { IRoom, State } from "./match.type";

import history from "utils/history";

import { instance as axios } from "../api";

const MatchState: React.FC = ({ children }) => {
  const initialState: State = {
    ...initialValues,
  };

  const socket = React.useContext(SocketContext);

  const [state, dispatch] = React.useReducer(matchReducer, initialState);

  const baseUrl: string = "/api/v1/match";

  React.useEffect(() => {
    socket.on("send:invite", (data: any) => {
      dispatch({
        type: HANDLE_INVITE,
        payload: {
          matchId: data.matchId,
          ownerInfo: data.ownerInvite
        },
      });

    });

    socket.on("playerjoined:match", (data: any) => {
      dispatch({
        type: MATCH_READY,
        payload: {
          ownerInfo: data.owner,
          opponentInfo: data.opponent
        },
      });
    });

    return () => {
      socket.off("send:invite");
      socket.off("playerjoined:match");
    };
  }, []);

  // create match
  const createMatch = async (ownerId: string, opponentId: string) => {
    try {
      await axios
        .post(baseUrl + `/create`, { ownerId }, { withCredentials: true })
        .then((matchId) => {
          socket.emit("invite:match", {
            matchId: matchId.data,
            opponentId,
            ownerId,
          });

          socket.emit("join:match", { matchId: matchId.data, ownerId });

          dispatch({
            type: CREATE_MATCH,
            payload: { _id: matchId.data, ownerId, opponentId: 0 },
          });

          history.push(`/lobby/${matchId.data}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // join match
  const acceptBattleInvite = async (
    userId: string,
    matchId: string,
    ownerId: string
  ) => {
    try {
      await axios
        .put(baseUrl + `/join/${userId}/${matchId}`, { withCredentials: true })
        .then(() => {
          socket.emit("join:match", { matchId, userId });

          dispatch({
            type: JOIN_MATCH,
            payload: { _id: matchId, ownerId, opponentId: userId },
          });

          history.push(`/lobby/${matchId}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // set loading
  const setLoading = () => {
    dispatch({
      type: SET_LOADING,
    });
  };

  return (
    <MatchContext.Provider
      value={{
        _id: state._id,
        ownerId: state.ownerId,
        ownerInfo: state.ownerInfo,
        opponentInfo: state.opponentInfo,
        receivedInvite: state.receivedInvite,
        invite: state.invite,
        matchLoaded: state.matchLoaded,
        loading: state.loading,
        createMatch,
        acceptBattleInvite,
        setLoading,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export default MatchState;
