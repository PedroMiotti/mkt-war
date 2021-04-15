import React, { useState } from "react";
import "./style.css";

import { Modal, Avatar } from "antd";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";

// Context
import { useMatchContext } from "../../context/match/match.context";
import { useUserContext } from "../../context/user/user.context";

interface IMatchInviteProps {
  ownerInfo: {
    id: number;
    username: string;
    trophies: number;
    avatar: number;
  };
  matchId: string;
}

const MatchInvite: React.FC<IMatchInviteProps> = ({ ownerInfo, matchId }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const { acceptBattleInvite } = useMatchContext();
  const { id } = useUserContext();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAccept = () => {
    setIsModalVisible(false);
    acceptBattleInvite(id, matchId.toString(), ownerInfo.id.toString());
    console.log('clicked');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        footer={null}
        title="BATTLE   INVITE"
        centered
        visible={isModalVisible}
        onCancel={handleCancel}
        closable={false}
      >
        <div className="matchInvite-challenger-info">
          <div className="matchInvite-challenger-avatar">
            <Avatar
              shape="square"
              size={64}
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
            />
          </div>

          <div className="matchInvite-challenger-description">
            <h2>{ownerInfo.username}</h2>
            <div className="matchInvite-trophy-section">
              <img
                src={TrophyIcon}
                className="Lobby-trophy-icon"
                alt="user avatar icon"
              />
              <h2>{ownerInfo.trophies}</h2>
            </div>
          </div>

        </div>

        <div className="matchInvite-buttons">
          <button onClick={handleAccept} className="matchInvite-deny">RECUSAR</button>
          <button className="matchInvite-accept">ACEITAR</button>
        </div>
      </Modal>
    </>
  );
};

export default MatchInvite;
