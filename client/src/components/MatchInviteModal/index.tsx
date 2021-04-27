import React, { useState } from "react";
import "./style.css";

import { Modal, Avatar } from "antd";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

// Assets
import AvatarIcon from "../../assets/icons/hacker.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";

// Context
import { useMatchContext } from "../../context/match/match.context";
import { useUserContext } from "../../context/user/user.context";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

const MatchInvite = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { acceptBattleInvite, receivedInvite, invite } = useMatchContext();

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    if (receivedInvite) setIsModalVisible(true);
  }, [receivedInvite]);

  const handleAccept = () => {
    setIsModalVisible(false);
    acceptBattleInvite(
      userId.key.toString(),
      invite.matchId.toString(),
      invite.ownerInfo.id.toString()
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        footer={null}
        title="Convite de batalha"
        centered
        visible={isModalVisible}
        closable={false}
      >
        <div className="matchInvite-challenger-info">
          <div className="matchInvite-challenger-avatar">
            <Avatar
              size={64}
              style={{ verticalAlign: "middle", border: "2px solid #fff" }}
              src={SelectAvatarSrc(invite.ownerInfo.avatar.toString())}
            />
          </div>

          <div className="matchInvite-challenger-description">
            <h2>{invite.ownerInfo.username.toUpperCase()}</h2>
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
          <button className="matchInvite-deny">RECUSAR</button>
          <button onClick={handleAccept} className="matchInvite-accept">
            ACEITAR
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MatchInvite;
