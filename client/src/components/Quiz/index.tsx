import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";

// Components
import AnswerButton from "./components/AnswerButton";

// Context
import { useMatchContext } from "../../context/match/match.context";

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


  return (
    <div className="quiz-container">
      <div className="quiz-header-container">
        <div className="quiz-timer-container">{round.roundTime}</div>

        <div className="quiz-players-container">
          <div className="quiz-players-owner">
            <Avatar
              size={64}
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
            <div className="quiz-players-owner-info">
              <h3>{ownerInfo.username}</h3>
              <p>{roundResult.ownerScore? roundResult.ownerScore : '0'}</p>
            </div>
          </div>
          <div className="quiz-players-opponent">
            <Avatar
              size={64}
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
            <div className="quiz-players-opponent-info">
              <h3>{opponentInfo.username}</h3>
              <p>{roundResult.opponentScore? roundResult.opponentScore : '0'}</p>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
