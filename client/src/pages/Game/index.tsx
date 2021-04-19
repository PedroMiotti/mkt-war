import React from 'react';
import './style.css';

// Components
import Quiz from '../../components/Quiz';
import RoundCounter from '../../components/Quiz/components/RoundCounter';


// <RoundCounter currentRound={1} totalRounds={5} hideScreen={false} />
const Game = () => {
  return(
    <div className="game-container">
       <Quiz />
    </div>
  )
}

export default Game;
