import React from 'react';
import './style.css';

import { Avatar } from "antd";

// Assets
import TrophyAnimation from "../../assets/animations/trophy-win2.json";
import GoldTrophyIcon from '../../assets/icons/gold-cup.svg'
import SilverTrophyIcon from '../../assets/icons/silver-cup.svg'
import EmptyPodiumIcon from '../../assets/icons/empty-podium.svg'
import CoinIcon from "../../assets/icons/dollar.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

// Hooks
import useWindowDimensions from "../../hooks/useWindowDimension";

// Context
import { useMatchContext } from "../../context/match/match.context";

// Components
import InfoBox from "../../components/Containers/InfoBox";

const ResultPage = () => {
    const {
        ownerInfo,
        opponentInfo,
        matchResult,
        matchEnded
    } = useMatchContext();

    const { width } = useWindowDimensions();

    const [winned, setWinned] = React.useState(matchResult.owner.winned);
    const [lost, setlost] = React.useState(!matchResult.owner.winned && matchResult.opponent.winned);
    const [tied, setTied] = React.useState(!matchResult.owner.winned && !matchResult.opponent.winned);

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
                        <div className="result-player-owner-info">
                            <Avatar
                                size={width <= 900 ? 64 : 100}
                                style={{border: "4px solid #fff", verticalAlign: "middle", marginBottom: "10px" }}
                                src={"/" + SelectAvatarSrc(ownerInfo.avatar.toString())}
                                />
                            <h1>{ownerInfo ? ownerInfo.username.toUpperCase() : ''}</h1>
                            <p>{matchResult ? matchResult.owner.score : 0}</p>
                        </div>

                        <div className="result-earnings-container">
                            <div className="result-earnings-throphies">
                                <img src={TrophyIcon} className="earnings-icon" alt="trophies icon" />
                                <h3>{tied ? "0" : winned ? "+10" : "-4"}</h3>
                            </div>

                            <div className="result-earnings-coins">
                                <img src={CoinIcon} className="earnings-icon" alt="coins icon" />
                                <h3>{tied ? "0" : winned ? "+50" : "-10"}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="result-player-opponent">
                        <Avatar
                            size={width <= 900 ? 64 : 100}
                            style={{ border: "4px solid #fff", verticalAlign: "middle", marginBottom: "10px" }}
                            src={"/" + SelectAvatarSrc(opponentInfo.avatar.toString())}
                        />
                        <h1>{opponentInfo ? opponentInfo.username.toUpperCase() : ''}</h1>
                        <p>{matchResult ? matchResult.opponent.score : 0}</p>
                    </div>
                </div>
            </div>

            


            <div className="result-sair-container">
                <button onClick={matchEnded} className="result-sair">Sair</button>
            </div>
        </div>
    )
}


export default ResultPage;