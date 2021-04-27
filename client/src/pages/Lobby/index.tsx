import React from "react";
import "./style.css";

//Assets
import BackIcon from "assets/icons/back.svg";
import CheckIcon from "assets/icons/check.svg";
import TrophyIcon from "assets/icons/trophy.svg";
import TimerAnimation from "assets/animations/timer.json";
import SwordsAnimation from "assets/animations/swords.json";
import FirtRoundCountdownAnimation from 'assets/animations/firstRoundCountdown.json';

// Context
import { useMatchContext } from "context/match/match.context";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

import { Avatar } from "antd";

import Lottie from "react-lottie";

import { useParams } from "react-router-dom";

const Lobby = () => {
  const {
    ownerInfo,
    opponentInfo,
    setUserReady,
    opponentReady,
    matchStarted,
  } = useMatchContext();

  const { matchId } = useParams<{ matchId: string }>();

  const [opponentAccepted, setOpponentAccepted] = React.useState(false);
  const [userReady_, setUserReady_] = React.useState(false);
  const [opponentReady_, setOpponentReady_] = React.useState(false);
  const [opponentInformation, setOpponentInformation] = React.useState({
    username: "",
    name: "",
    avatar: 0,
    trophies: 0,
  });

  // Setting opponent information
  React.useEffect(() => {
    if (opponentInfo.id !== 0) {
      setOpponentAccepted(true);

      setOpponentInformation({
        username: opponentInfo.username,
        name: opponentInfo.name,
        trophies: opponentInfo.trophies,
        avatar: opponentInfo.avatar,
      });
    }
  }, [opponentInfo]);

  // Check if opponent is ready
  React.useEffect(() => {
    if (opponentReady) {
      setOpponentReady_(true);
    }
  }, [opponentReady]);

  const setReady = () => {
    setUserReady_(true);
    setUserReady(matchId);
  };

  const timerAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: TimerAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const SwordsAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: SwordsAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const FirstRoundCountdownAnimationOptions = {
    loop: false,
    autoplay: true,
    animationData: FirtRoundCountdownAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <img
          src={BackIcon}
          className="BackButton-icon"
          alt="back button icon"
        />
      </div>

      <div className="lobby-players-section">
        <div className="lobby-owner-section">
          <div className="lobby-owner-avatar">
            <Avatar
              size={100}
              style={{ verticalAlign: "middle", border: "2px solid #fff" }}
              src={"/" + SelectAvatarSrc(ownerInfo.avatar.toString())}
            />

            {userReady_ &&
            <div className="lobby-check-owner-container">
              <img src={CheckIcon} className="Lobby-check-icon" alt="user avatar" />
            </div>
          }
          </div>

          <div className="lobby-owner-info">
            <h2>{ownerInfo.name.toUpperCase()}</h2>
            <h4>@{ownerInfo.username}</h4>
            <div className="lobby-trophy-section">
              <img
                src={TrophyIcon}
                className="Lobby-trophy-icon"
                alt="user avatar icon"
              />
              <p>{ownerInfo.trophies}</p>
            </div>
            <button className="lobby-ready-button" onClick={setReady} disabled={userReady_}>
              Pronto
            </button>
          </div>

          

        </div>

        <div className="lobby-divider">
          <hr className="lobby-divider-line" />
          <div className="lobby-divider-icon-container">
            {!opponentAccepted && (
              <Lottie
                options={timerAnimationOptions}
                style={{
                  height: 150,
                  marginLeft: 5,
                }}
              />
            )}
            {opponentAccepted && !matchStarted && (
              <Lottie
                options={SwordsAnimationOptions}
                style={{
                  height: 110,
                  marginLeft: 5,
                }}
              />
            )}
            {opponentAccepted && matchStarted && (
              <Lottie
                options={FirstRoundCountdownAnimationOptions}
                style={{
                  height: 110,
                  marginLeft: -1,
                }}
              />
            )}
          </div>
        </div>
        {!opponentAccepted && (
          <h1 className="lobby-waiting">Esperando adversário...</h1>
        )}
        {opponentAccepted && (
          <div className="lobby-opponent-section">
            <div className="lobby-opponent-info">
              <h2>{opponentInformation.name.toUpperCase()}</h2>
              <h4>@{opponentInformation.username}</h4>
              <div className="lobby-trophy-section">
                <img
                  src={TrophyIcon}
                  className="Lobby-trophy-icon"
                  alt="user avatar icon"
                />
                <p>{opponentInformation.trophies}</p>
              </div>
            </div>
            <div className="lobby-opponent-avatar">
              <Avatar
                size={100}
                style={{ verticalAlign: "middle", border: "2px solid #fff" }}
                src={"/" + SelectAvatarSrc(opponentInformation.avatar.toString())}
              />
              {opponentReady_ &&
                <div className="lobby-check-opponent-container">
                  <img src={CheckIcon} className="Lobby-check-icon" alt="user avatar" />
                </div>
              }
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
