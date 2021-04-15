import React, { useState } from "react";
import "./style.css";

import { Modal, Avatar } from "antd";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";

// Context
import { useMatchContext } from "../../context/match/match.context";
import { useUserContext } from "../../context/user/user.context";

const MatchInvite = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { acceptBattleInvite , receivedInvite, invite } = useMatchContext();
  const { id } = useUserContext();

  React.useEffect(() => {

    if(receivedInvite)
      setIsModalVisible(true);

  }, [receivedInvite])

  const handleAccept = () => {
    setIsModalVisible(false);
    acceptBattleInvite(id, invite.matchId.toString(), invite.ownerInfo.id.toString());
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
            <h2>{invite.ownerInfo.username}</h2>
            <div className="matchInvite-trophy-section">
              <img
                src={TrophyIcon}
                className="Lobby-trophy-icon"
                alt="user avatar icon"
              />
              <h2>{invite.ownerInfo.trophies}</h2>
            </div>
          </div>

        </div>

        <div className="matchInvite-buttons">
          <button  className="matchInvite-deny">RECUSAR</button>
          <button onClick={handleAccept} className="matchInvite-accept">ACEITAR</button>
        </div>
      </Modal>
    </>
  );
};

export default MatchInvite;
