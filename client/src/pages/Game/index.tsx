import React from "react";
import "./style.css";

// Components
import Quiz from "../../components/Quiz";
import RoundCounter from "../../components/Quiz/components/RoundCounter";


// Context
import { useMatchContext } from "../../context/match/match.context";

const Game = () => {
  const { game } = useMatchContext();

  const [ showRoundScreen, setShowRoundScreen ] = React.useState(false);
  const [ showGameScreen, setShowGameScreen ] = React.useState(false);

  React.useEffect(() => {

    if(game.showRoundScreen === true){
      setShowGameScreen(false);
      setShowRoundScreen(true);
    }
    else{
      setShowRoundScreen(false);
      setShowGameScreen(true);
    }

    console.log(game);

  }, [game])

  return (
    <div className="game-container">
    {showRoundScreen && <RoundCounter currentRound={game.currentRound} totalRounds={game.totalRound}  />}

    {showGameScreen && <Quiz />}
    </div>
  );
};

export default Game;
