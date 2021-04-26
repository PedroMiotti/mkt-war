import { message } from "antd";
import * as React from "react";

import {
  CREATE_MATCH,
  JOIN_MATCH,
  SET_LOADING,
  MATCH_READY,
  HANDLE_INVITE,
  SET_OPPONENT_READY,
  SET_GAME,
  START_MATCH,
  START_QUESTION,
  ROUND_COUNTDOWN,
  ROUND_RESULT,
  SET_ROUND,
  SET_READY,
  MATCH_RESULT,
} from "../types";

import MatchContext from "./match.context";
import matchReducer, { initialState as initialValues } from "./match.reducer";
import { IRoom, State } from "./match.type";

import { SocketContext } from "../socket";
import { useUserContext } from "../user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";
import history from "utils/history";

import SocketEvents from "../../constants/SocketEvents";

import { instance as axios } from "../api";

const MatchState: React.FC = ({ children }) => {
  const initialState: State = {
    ...initialValues,
  };

  const socket = React.useContext(SocketContext);

  const [state, dispatch] = React.useReducer(matchReducer, initialState);

  const baseUrl: string = "/api/v1/match";

  React.useEffect(() => {
    // Player left match
    socket.on(SocketEvents.SERVER_PLAYER_LEFT, (data: any) => {
      // Show player left modal
      history.push(`/home`);
    });
    
    // Match end
    socket.on(SocketEvents.SERVER_MATCH_END, (data: any) => {
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
        type: MATCH_RESULT,
        payload:{
          owner: ownerData,
          opponent: opponentData
        }
      });

      history.push(`/result`);
    });

    // Start Match (show countdown to the start of the first round)
    socket.on(SocketEvents.SERVER_MATCH_START, () => {
      dispatch({
        type: START_MATCH,
      });
    });

    // Start Round
    socket.on(SocketEvents.SERVER_MATCH_START_ROUND, (data: any) => {
      const { currentRound, totalRound } = data;

      dispatch({
        type: SET_GAME,
        payload: { currentRound, totalRound },
      });

      history.push(`/game`);
    });

    // Start question
    socket.on(SocketEvents.SERVER_MATCH_START_QUESTION, (data: any) => {

      dispatch({
        type: SET_ROUND,
        payload: {
          questionId: data.id,
          questionText: data.title,
          answers: [
            { id: data.answer1.id, text: data.answer1.text },
            { id: data.answer2.id, text: data.answer2.text },
            { id: data.answer3.id, text: data.answer3.text },
            { id: data.answer4.id, text: data.answer4.text },
          ],
          correctAnswer: data.correctAnswer
        },
      });

      dispatch({
        type: START_QUESTION,
      });

    });

    // Round countdown
    socket.on(SocketEvents.SERVER_MATCH_COUNTDOWN, (data: any) => {
      dispatch({
        type: ROUND_COUNTDOWN,
        payload: {roundTime: data.seconds}
      });

    })

    // Round end
    socket.on(SocketEvents.SERVER_MATCH_END_ROUND, (data: any) => {
      let ownerSelected;
      let opponentSelected;
      let ownerScore;
      let opponentScore;

      let userId: IToken = getUserIdByToken();

      if (userId.key.toString() === data.owner.id.toString()) {
        ownerSelected = data.owner.answer;
        opponentSelected = data.opponent.answer;
        ownerScore = data.owner.score;
        opponentScore = data.opponent.score;
      } else {
        ownerSelected = data.opponent.answer;
        opponentSelected = data.owner.answer;
        ownerScore = data.opponent.score;
        opponentScore = data.owner.score;
      }

      dispatch({
        type: ROUND_RESULT,
        payload: {
          ownerSelected,
          opponentSelected,
          ownerScore,
          opponentScore,
        }
      });

    })

    // Set opponent ready
    socket.on(SocketEvents.SERVER_PLAYER_READY, (data: any) => {
      let userId: IToken = getUserIdByToken();
      if (data.userId.toString() !== userId.key.toString()) {
        dispatch({
          type: SET_OPPONENT_READY,
        });
      }
    });

    // Receive game invite
    socket.on(SocketEvents.SERVER_SEND_INVITE, (data: any) => {
      dispatch({
        type: HANDLE_INVITE,
        payload: {
          matchId: data.matchId,
          ownerInfo: data.ownerInvite,
        },
      });
    });

    // Player joinend
    socket.on(SocketEvents.SERVER_PLAYER_JOINED, (data: any) => {
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
      socket.off(SocketEvents.SERVER_SEND_INVITE);
      socket.off(SocketEvents.SERVER_PLAYER_JOINED);
      socket.off(SocketEvents.SERVER_PLAYER_READY);

      socket.off(SocketEvents.SERVER_MATCH_COUNTDOWN);
      socket.off(SocketEvents.SERVER_MATCH_START_QUESTION);
      socket.off(SocketEvents.SERVER_MATCH_START_ROUND);
      socket.off(SocketEvents.SERVER_MATCH_START);
      socket.off(SocketEvents.SERVER_MATCH_END);
      socket.off(SocketEvents.SERVER_PLAYER_LEFT);
      
    };
  }, []);

  // create match
  const createMatch = async (ownerId: string, opponentId: string) => {
    try {
      await axios
        .post(baseUrl + `/create`, { ownerId }, { withCredentials: true })
        .then((matchId) => {
          socket.emit(SocketEvents.CLIENT_INVITE_PLAYER, {
            matchId: matchId.data,
            opponentId,
            ownerId,
          });

          socket.emit(SocketEvents.CLIENT_JOIN_MATCH, {
            matchId: matchId.data,
            ownerId,
          });

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
          socket.emit(SocketEvents.CLIENT_JOIN_MATCH, {
            matchId: parseInt(matchId),
            userId,
          });

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

  // Set user Ready
  const setUserReady = (matchId: string) => {
    let userId: IToken = getUserIdByToken();

    socket.emit(SocketEvents.CLIENT_USER_READY, {
      matchId: parseInt(matchId),
      userId: userId.key.toString(),
    });

    dispatch({
      type: SET_READY,
    });
  };
  
  // Answer qustion
  const answerQuestion = (matchId: number, questionId: string, answerId: number, correctAnswer: number) => {
    let user_id: IToken = getUserIdByToken();

    socket.emit(SocketEvents.CLIENT_ANSWER_QUESTION, {matchId: matchId, userId: user_id.key, questionId, answerId, correctAnswer});


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
        game: state.game,
        round: state.round,
        roundResult: state.roundResult,
        matchResult: state.matchResult,
        matchStarted: state.matchStarted,
        loading: state.loading,
        createMatch,
        acceptBattleInvite,
        setLoading,
        answerQuestion,
        setUserReady,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export default MatchState;
