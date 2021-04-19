import React from 'react';
import './style.css';


interface IRoundCounterProps{
  currentRound: number;
  totalRounds: number;
  hideScreen: boolean;
}

const RoundCounter: React.FC<IRoundCounterProps> = ({currentRound, totalRounds, hideScreen}) => {
  return(
    <div className="round-counter-container">
      <h1> Round {currentRound}</h1>
      <h3> {currentRound} de {totalRounds}</h3>

    </div>
  )
}

export default RoundCounter;
