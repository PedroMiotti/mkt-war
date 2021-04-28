import React from "react";
import "./style.css";

import { Avatar } from "antd";

interface IAnswerButtonProps {
  text: string;
  answerId: number;
  onSelect: () => void;
  isDisabled: boolean;
  roundEnd: boolean;

  ownerSelected: number;
  opponentSelected: number;
  correctId: number;
  ownerAvatar: string;
  opponentAvatar: string;
}

const AnswerButton: React.FC<IAnswerButtonProps> = ({
  text,
  answerId,
  onSelect,
  isDisabled,
  ownerSelected,
  opponentSelected,
  correctId,
  roundEnd,
  ownerAvatar,
  opponentAvatar
}) => {
  const [showAnswer, setShowAnswer] = React.useState(roundEnd);
  const [selected, setSelected] = React.useState(false);
  const [correctAnswer, setCorrectAnswer] = React.useState(false);
  const [ownerSelectedAnswer, setOwnerSelectedAnswer] = React.useState(false);
  const [opponentSelectedAnswer, setOpponentSelectedAnswer] = React.useState(false);

  React.useEffect(() => {
    if (answerId === correctId)
      setCorrectAnswer(true);

    if (ownerSelected === answerId)
      setOwnerSelectedAnswer(true);

    if (opponentSelected === answerId)
      setOpponentSelectedAnswer(true);

    console.log(roundEnd)

    return (() => {
      setCorrectAnswer(false);
      setOwnerSelectedAnswer(false);
      setOpponentSelectedAnswer(false);
    })

  }, [roundEnd]);

  const onAnswerSelected = () => {
    setSelected(true);
  }

  return (
    <div className="answer-button-container">
      <button
        className={
          roundEnd && correctAnswer
            ?
            "answer-button answer-correct"
            :
            roundEnd && !correctAnswer
              ?
              "answer-button answer-wrong"
              :
              !roundEnd && !selected ?
                "answer-button "
                :
                "answer-button answer-button-selected"
        }
        onClick={() => { onSelect(); onAnswerSelected() }}
        disabled={isDisabled}
      >
        {text}
      </button>

      {ownerSelectedAnswer && roundEnd && (
        <div className="answer-owner-avatar">
          <Avatar
            size={40}
            style={{ verticalAlign: "middle", border: "2px solid #fff" }}
            src={ownerAvatar}
          />
        </div>
      )}

      {opponentSelectedAnswer && roundEnd  && (
        <div className="answer-opponent-avatar">
          <Avatar
            size={40}
            style={{ verticalAlign: "middle", border: "2px solid #fff" }}
            src={opponentAvatar}
          />
        </div>
      )}
    </div>
  );
};

export default AnswerButton;
