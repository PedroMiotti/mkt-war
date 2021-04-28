import React from 'react';
import './style.css';

import { Avatar } from "antd";

import Lottie from "react-lottie";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyAnimation from "../../assets/animations/trophy-win2.json";
import GoldTrophyIcon from '../../assets/icons/gold-cup.svg'
import SilverTrophyIcon from '../../assets/icons/silver-cup.svg'
import EmptyPodiumIcon from '../../assets/icons/empty-podium.svg'

// Utils
import history from "utils/history";


// Hooks
import useWindowDimensions from "../../hooks/useWindowDimension";

// Context
import { useMatchContext } from "../../context/match/match.context";

const ResultPage = () => {
    const {
        ownerInfo,
        opponentInfo,
        matchResult,
    } = useMatchContext();

    const { width } = useWindowDimensions();

    const [winned, setWinned] = React.useState(matchResult.owner.winned);
    const [lost, setlost] = React.useState(!matchResult.owner.winned && matchResult.opponent.winned);
    const [tied, setTied] = React.useState(!matchResult.owner.winned && !matchResult.opponent.winned);

    const trophyWinAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: TrophyAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const returnHome = () => {
        history.push('/home')
    }


    return (
        <div className="result-container">
            <div className="result-card-info">
                <div className="result-top-info">

                    {winned &&
                        <>
                            <img src={GoldTrophyIcon} className="result-icon" alt="gold cup icon" />
                            <h1>Você ganhou !</h1>
                        </>
                    }

                    {lost &&
                        <>
                            <img src={SilverTrophyIcon} className="result-icon" alt="silver cup icon" />
                            <h1>Você perdeu !</h1>
                        </>
                    }

                    {tied &&
                        <>
                            <img src={EmptyPodiumIcon} className="result-icon" alt="empty podium icon" />
                            <h1>Empate !</h1>
                        </>
                    }


                </div>
                <div className='result-players'>
                    <div className="result-player-owner">
                        <Avatar
                            size={width <= 900 ? 64 : 100}
                            style={{ backgroundColor: "#fff", verticalAlign: "middle", marginBottom: "10px" }}
                            src={AvatarIcon}
                        />
                        <h1>{ownerInfo ? ownerInfo.username : ''}</h1>
                        <p>{matchResult ? matchResult.owner.score : 0}</p>
                    </div>
                    <div className="result-player-opponent">
                        <Avatar
                            size={width <= 900 ? 64 : 100}
                            style={{ backgroundColor: "#fff", verticalAlign: "middle", marginBottom: "10px" }}
                            src={AvatarIcon}
                        />
                        <h1>{opponentInfo ? opponentInfo.username : ''}</h1>
                        <p>{matchResult ? matchResult.opponent.score : 0}</p>
                    </div>
                </div>
            </div>

            <div className="result-sair-container">
                <button onClick={returnHome} className="result-sair">Sair</button>
            </div>
        </div>
    )
}


export default ResultPage;