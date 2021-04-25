import React from "react";
import "./style.css";

interface IAnswerButtonProps {
  text: string;
  answerId: number;
  onSelect: () => void;
  isDisabled: boolean;
  roundEnd: boolean;

  ownerSelected: number;
  opponentSelected: number;
  correctId: number;
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
}) => {
  const [showAnswer, setShowAnswer] = React.useState(roundEnd);
  const [correctAnswer, setCorrectAnswer] = React.useState(false);
  const [ownerSelectedAnswer, setOwnerSelectedAnswer] = React.useState(false);
  const [opponentSelectedAnswer, setOpponentSelectedAnswer] = React.useState(false);

  React.useEffect(() => {
    if (answerId === correctId) 
      setCorrectAnswer(true);

    if(ownerSelected === answerId)
      setOwnerSelectedAnswer(true);

    if(opponentSelected === answerId)
      setOpponentSelectedAnswer(true);

    return(() => {
      setCorrectAnswer(false);
      setOwnerSelectedAnswer(false);
      setOpponentSelectedAnswer(false);
    })

  }, [roundEnd]);

  return (
    <div>
    <button
      className={
        !roundEnd
          ? "answer-button-container"
          : roundEnd && correctAnswer
          ? "answer-button-container answer-correct"
          : "answer-button-container answer-wrong"
      }
      onClick={onSelect}
      disabled={isDisabled}
    >
      {text}
    </button>
    {ownerSelectedAnswer && (<p> owner </p>)}
    {opponentSelectedAnswer && (<p> opponent </p>)}
    </div>
  );
};

export default AnswerButton;
