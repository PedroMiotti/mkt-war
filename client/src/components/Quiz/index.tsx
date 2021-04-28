import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Components
import AnswerButton from "./components/AnswerButton";

// Context
import { useMatchContext } from "context/match/match.context";

// Hooks
import useWindowDimensions from "../../hooks/useWindowDimension";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

const Quiz = () => {
  const {
    _id,
    round,
    roundResult,
    ownerInfo,
    opponentInfo,
    answerQuestion,
  } = useMatchContext();

  const [disableAnswerButtons, setDisableAnswerButtons] = React.useState(false);

  const AnswerQuestion = React.useCallback((answerId: any) => {
    setDisableAnswerButtons(true);
    answerQuestion(
      parseInt(_id),
      round.questionId,
      answerId,
      round.correctAnswer
    );
  }, [ roundResult.ownerSelected, roundResult.opponentSelected]);

  const { width } = useWindowDimensions();


  return (
    <div className="quiz-container">
      <div className="quiz-header-container">
        <div className="quiz-timer-container">{round.roundTime}</div>

        <div className="quiz-players-container">
          <div className="quiz-players-owner">
            <Avatar
              size={width <= 800 ? 40 : 64}
              style={{verticalAlign: "middle", border: "2px solid #fff" }}
              src={"/" + SelectAvatarSrc(ownerInfo.avatar.toString())}
            />
            <div className="quiz-players-owner-info">
              <h3>{ownerInfo.username}</h3>
              <p>{roundResult.ownerScore ? roundResult.ownerScore : '0'}</p>
            </div>
          </div>
          <div className="quiz-players-opponent">
            <Avatar
              size={width <= 800 ? 40 : 64}
              style={{verticalAlign: "middle", border: "2px solid #fff" }}
              src={"/" + SelectAvatarSrc(opponentInfo.avatar.toString())}
            />
            <div className="quiz-players-opponent-info">
              <h3>{opponentInfo.username}</h3>
              <p>{roundResult.opponentScore ? roundResult.opponentScore : '0'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-bottom-container">
        <div className="quiz-question-container">
          <h4>{round.questionText}</h4>
        </div>

        <div className="quiz-answers-container">
          {round.answers.map((answer) => (
            <AnswerButton
              key={answer.id}
              text={answer.text}
              answerId={answer.id}
              onSelect={() => AnswerQuestion(answer.id)}
              isDisabled={disableAnswerButtons}
              ownerSelected={roundResult.ownerSelected}
              opponentSelected={roundResult.opponentSelected}
              correctId={round.correctAnswer}
              roundEnd={round.showCorrectAnswer}
              ownerAvatar={"/" + SelectAvatarSrc(ownerInfo.avatar.toString())}
              opponentAvatar={"/" + SelectAvatarSrc(opponentInfo.avatar.toString())}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
