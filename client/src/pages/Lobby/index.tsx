import React from "react";
import "./style.css";

//Assets
import BackIcon from "../../assets/icons/back.svg";
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import TimerAnimation from "../../assets/animations/timer.json";
import SwordsAnimation from "../../assets/animations/swords.json";

// Context
import { useMatchContext } from "../../context/match/match.context";

import { Avatar } from "antd";

import Lottie from "react-lottie";

const Lobby = () => {
  const { ownerInfo, opponentInfo } = useMatchContext();

  const [opponentAccepted, setOpponentAccepted] = React.useState(false);
  const [opponentInformation, setOpponentInformation] = React.useState({
    username: "",
    name: "",
    avatar: 0,
    trophies: 0,
  });

  React.useEffect(() => {
    if(opponentInfo.id !== 0){
      setOpponentAccepted(true);

      setOpponentInformation({
        username: opponentInfo.username,
        name: opponentInfo.name,
        trophies: opponentInfo.trophies,
        avatar: opponentInfo.avatar,
      });

    }

  }, [opponentInfo]);

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
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
          </div>

          <div className="lobby-owner-info">
            <h2>{ownerInfo.name}</h2>
            <h4>@{ownerInfo.username}</h4>
            <div className="lobby-trophy-section">
              <img
                src={TrophyIcon}
                className="Lobby-trophy-icon"
                alt="user avatar icon"
              />
              <p>{ownerInfo.trophies}</p>
            </div>
          </div>
        </div>

        <div className="lobby-divider">
          <hr className="lobby-divider-line" />
          <div className="lobby-divider-icon-container">
          {!opponentAccepted &&
            <Lottie
              options={timerAnimationOptions}
              style={{
                height: 150,
                marginLeft: 5,
              }}
            />
          }
          {opponentAccepted &&
            <Lottie
              options={SwordsAnimationOptions}
              style={{
                height: 110,
                marginLeft: 5,
              }}
            />
          }
          </div>
        </div>
        {!opponentAccepted && <h1 className="lobby-waiting">Esperando adversário...</h1>}
        {opponentAccepted && (
          <div className="lobby-opponent-section">
            <div className="lobby-opponent-info">
              <h2>{opponentInformation.name}</h2>
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
                style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
                src={AvatarIcon}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
