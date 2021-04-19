import { message } from "antd";
import * as React from "react";

import {
  CREATE_MATCH,
  JOIN_MATCH,
  SET_LOADING,
  MATCH_READY,
  HANDLE_INVITE,
  SET_OPPONENT_READY,
  SET_READY,
} from "../types";

import MatchContext from "./match.context";
import matchReducer, { initialState as initialValues } from "./match.reducer";
import { IRoom, State } from "./match.type";

import { SocketContext } from "../socket";
import { useUserContext } from "../user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";
import history from "utils/history";

import { instance as axios } from "../api";

const MatchState: React.FC = ({ children }) => {
  const initialState: State = {
    ...initialValues,
  };

  const socket = React.useContext(SocketContext);
  const { id } = useUserContext();

  const [state, dispatch] = React.useReducer(matchReducer, initialState);

  const baseUrl: string = "/api/v1/match";

  React.useEffect(() => {
    socket.on("playerready:match", (data: any) => {
      let userId: IToken = getUserIdByToken();
      if (data.userId.toString() !== userId.key.toString()) {
        dispatch({
          type: SET_OPPONENT_READY,
        });
      }
    });

    socket.on("send:invite", (data: any) => {
      dispatch({
        type: HANDLE_INVITE,
        payload: {
          matchId: data.matchId,
          ownerInfo: data.ownerInvite,
        },
      });
    });

    socket.on("playerjoined:match", (data: any) => {
      let ownerData;
      let opponentData;

      let userId: IToken = getUserIdByToken();

      if (userId.key.toString() === data.owner.id.toString()) {
        ownerData = data.owner;
        opponentData = data.opponent;
      } else {
        ownerData = data.opponent;
        opponentData = data.owner;
      }

      dispatch({
        type: MATCH_READY,
        payload: {
          ownerInfo: ownerData,
          opponentInfo: opponentData,
        },
      });
    });

    return () => {
      socket.off("send:invite");
      socket.off("playerjoined:match");
      socket.off("playerready:match");
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
          socket.emit("join:match", { matchId: parseInt(matchId), userId });

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

  const setUserReady = (matchId: string) => {
    let userId: IToken = getUserIdByToken();

    socket.emit("userready:match", {
      matchId: parseInt(matchId),
      userId: userId.key.toString(),
    });

    dispatch({
      type: SET_READY,
    });
  };

  return (
    <MatchContext.Provider
      value={{
        _id: state._id,
        ownerId: state.ownerId,
        ownerInfo: state.ownerInfo,
        opponentInfo: state.opponentInfo,
        userReady: state.userReady,
        opponentReady: state.opponentReady,
        receivedInvite: state.receivedInvite,
        invite: state.invite,
        matchLoaded: state.matchLoaded,
        loading: state.loading,
        createMatch,
        acceptBattleInvite,
        setLoading,
        setUserReady,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export default MatchState;
