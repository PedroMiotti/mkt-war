import React from 'react';
import './style.css';


interface IAnswerButtonProps{
  text: string;
  isCorrect: boolean;
  answerId: number;
}

const AnswerButton: React.FC<IAnswerButtonProps> = ({text, isCorrect, answerId}) => {
  return(
    <a className="answer-button-container">
      {text}      

    </a>
  )
}

export default AnswerButton;
