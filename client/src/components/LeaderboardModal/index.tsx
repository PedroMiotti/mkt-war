import React from "react";
import "./style.css";

import { Modal, Avatar, Drawer } from "antd";

import ListView from "./components/ListView";

import { useUserContext } from "context/user/user.context";
import { IPlayer } from "context/user/user.type";

// Utils
import { getUserIdByToken, IToken } from "utils/getUserIdByToken";
import SelectAvatarSrc from "utils/chooseAvatar";

// Assets
import TrophyIcon from "assets/icons/trophy.svg";
import firstBadge from 'assets/icons/1_badge.svg'
import secondBadge from 'assets/icons/2_badge.svg'
import thirdBadge from 'assets/icons/3_badge.svg'

interface ILeaderboardModalProps {
  openModal: boolean;
  closeModal: (e: any) => void;
}

const OnlinePlayersModal: React.FC<ILeaderboardModalProps> = ({ openModal, closeModal }) => {
  const { leaderboard, getLeaderboard } = useUserContext();

  const [isvisible, setIsVisible] = React.useState(openModal);
  const [podium, setPodium] = React.useState<IPlayer[]>([]);
  const [leaderboardListRest, setLeaderboardListRest] = React.useState<IPlayer[]>([]);

  let userId: IToken = getUserIdByToken(); // TODO -> Mark the user if its self

  React.useEffect(() => {
    if (openModal) 
      setIsVisible(true);
    else 
      setIsVisible(false);
  }, [openModal]);

  React.useEffect(() => {
    getLeaderboard();
  }, []);

  React.useEffect(() => {
    if (leaderboard) {
      setPodium(leaderboard.slice(0, 3));
      setLeaderboardListRest(leaderboard.slice(3));
    }
  }, [leaderboard]);

  return (
    <>
      <Modal
        title="Leaderboard"
        footer={null}
        closable={false}
        visible={openModal ? true : false}
        onCancel={closeModal}
      >
        <div className="leaderboard-top3">
          <div className="leaderboard-top3-card-container">
            <Avatar
              style={{ verticalAlign: "middle", border: "1px solid #fff" }}
              src={SelectAvatarSrc(podium.length > 1 ? podium[1].player_avatar.toString() : "-")}
              size="large"
            />
            <h4>{podium.length > 1 ? podium[1].player_username.toUpperCase() : "-"}</h4>

            <div className="leaderboard-top3-card-trophies">
              <img
                src={TrophyIcon}
                className="leaderboard-top3-card-trophy-icon"
                alt="Trophy Icon"
              />
              <p>{podium.length > 1 ? podium[1].player_trophies : "-"}</p>
            </div>
            <img
                src={secondBadge}
                className="leaderboard-top3-card-badge"
                alt="Trophy Icon"
              />
          </div>
          <div className="leaderboard-top3-card-container">
            <Avatar
              style={{ verticalAlign: "middle", border: "1px solid #fff" }}
              src={SelectAvatarSrc(podium.length > 1 ? podium[0].player_avatar.toString() : "-")}
              size={64}
            />
            <h4>{podium.length > 1 ? podium[0].player_username.toUpperCase() : "-"}</h4>
            <div className="leaderboard-top3-card-trophies">
              <img
                src={TrophyIcon}
                className="leaderboard-top3-card-trophy-icon"
                alt="Trophy Icon"
              />
              <p>{podium.length > 1 ? podium[0].player_trophies : "-"}</p>
            </div>
            <img
                src={firstBadge}
                className="leaderboard-top3-card-badge"
                alt="Trophy Icon"
              />
          </div>
          <div className="leaderboard-top3-card-container">
            <Avatar
              style={{ verticalAlign: "middle", border: "1px solid #fff" }}
              src={SelectAvatarSrc(podium.length > 1 ? podium[2].player_avatar.toString() : "-")}
              size="large"
            />
            <h4>{podium.length > 1 ? podium[2].player_username.toUpperCase() : "-"}</h4>
            <div className="leaderboard-top3-card-trophies">
              <img
                src={TrophyIcon}
                className="leaderboard-top3-card-trophy-icon"
                alt="Trophy Icon"
              />
              <p>{podium.length > 1 ? podium[2].player_trophies : "-"}</p>
            </div>
            <img
                src={thirdBadge}
                className="leaderboard-top3-card-badge"
                alt="Trophy Icon"
              />
          </div>
        </div>

        <div className="leaderboard-listview">
          <ListView players={leaderboardListRest} />
        </div>
      </Modal>
    </>
  );
};

export default OnlinePlayersModal;
