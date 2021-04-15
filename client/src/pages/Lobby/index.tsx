import React from "react";
import "./style.css";

//Assets
import BackIcon from "../../assets/icons/back.svg";
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import TimerAnimation from "../../assets/animations/timer.json";

// Context
import { useMatchContext } from "../../context/match/match.context";

import { Avatar } from "antd";

import Lottie from "react-lottie";

const Lobby = () => {
  const { ownerInfo, opponentInfo } = useMatchContext();

  const timerAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: TimerAnimation,
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
            <h2>Pedro Miotti</h2>
            <h4>@pedrinhoTsunami</h4>
            <div className="lobby-trophy-section">
              <img
                src={TrophyIcon}
                className="Lobby-trophy-icon"
                alt="user avatar icon"
              />
              <p>200</p>
            </div>
          </div>
        </div>

        <div className="lobby-divider">
          <hr className="lobby-divider-line" />
          <div className="lobby-divider-icon-container">
            <Lottie
              options={timerAnimationOptions}
              style={{
                height: 150,
                marginLeft: 5,
              }}
            />
          </div>
        </div>
        {Object.keys(opponentInfo).length === 0 && <h1>Esperando adversário...</h1>}
        {opponentInfo && (
          <div className="lobby-opponent-section">
            <div className="lobby-opponent-info">
              <h2>{opponentInfo.name}</h2>
              <h4>@{opponentInfo.username}</h4>
              <div className="lobby-trophy-section">
                <img
                  src={TrophyIcon}
                  className="Lobby-trophy-icon"
                  alt="user avatar icon"
                />
                <p>{opponentInfo.trophies}</p>
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
