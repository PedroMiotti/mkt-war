import React, { useState } from "react";
import "./style.css";

import { Modal, Avatar } from "antd";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

// Assets
import TrophyIcon from "../../assets/icons/trophy.svg";

// Context
import { useMatchContext } from "../../context/match/match.context";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

interface IModalInviteProps{
  closeModal: () => void;
  openModal: boolean;
}

const MatchInvite: React.FC<IModalInviteProps> = ({ openModal, closeModal }) => {
  const { acceptBattleInvite, invite, denyBattleInvite } = useMatchContext();

  let userId: IToken = getUserIdByToken();

  const handleAccept = () => {
    closeModal();
    acceptBattleInvite(
      userId.key.toString(),
      invite.matchId.toString(),
      invite.ownerInfo.id.toString()
    );
  };

  const handleDeny = () => {
    closeModal();
    denyBattleInvite(
      invite.matchId.toString(),
      invite.ownerInfo.id.toString()
    );
  };


  return (
    <>
      <Modal
        footer={null}
        title="Convite de batalha"
        centered
        visible={openModal}
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
          <button onClick={handleDeny} className="matchInvite-deny">RECUSAR</button>
          <button onClick={handleAccept} className="matchInvite-accept">
            ACEITAR
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MatchInvite;
