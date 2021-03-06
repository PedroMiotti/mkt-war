import React from "react";
import "./style.css";

import { Modal } from "antd";

import ListView from "./components/ListView";

import { useMatchContext } from "../../context/match/match.context";
import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

interface IOnlinePlayerModalProps {
  openModal: boolean;
  closeModal: () => void;
}

const OnlinePlayersModal: React.FC<IOnlinePlayerModalProps> = ({ openModal, closeModal }) => {
  const { createMatch } = useMatchContext();
  const { onlinePlayers } = useUserContext();

  const [playerId, setPlayerId] = React.useState("");

  const [isvisible, setIsVisible] = React.useState(openModal);

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    if (openModal)
      setIsVisible(true)
    else
      setIsVisible(false);

  }, [openModal])

  React.useEffect(() => {
    if(playerId){
      createMatch(userId.key.toString(), playerId);
      closeModal();
    }

  }, [playerId])

  const challengePlayer = () => {
    setPlayerId(playerId)
  };
  

  return (
    <>
      <Modal
        title="Desafie um amigo "
        footer={null}
        closable={false}
        visible={isvisible}
        onCancel={closeModal}
      >
        <ListView setPlayer={setPlayerId} playersList={onlinePlayers.filter((player) => player.player_id != userId.key)} inviteButton={challengePlayer} />
      </Modal>
    </>
  );
};

export default OnlinePlayersModal;
