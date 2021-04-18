import React from "react";
import "./style.css";

import { Modal } from "antd";

import ListView from "./components/ListView";

import { useMatchContext } from "../../context/match/match.context";
import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

interface IOnlinePlayerModalProps{
  close: () => void;
}

const OnlinePlayersModal: React.FC<IOnlinePlayerModalProps> = ({close}) => {
  const { createMatch } = useMatchContext();
  const { onlinePlayers } = useUserContext();

    const [ playerId, setPlayerId ] = React.useState('');

  let userId: IToken = getUserIdByToken();

  const challengePlayer = () => {
    console.log(playerId);
    createMatch(userId.key.toString(), playerId);
    close();
  }


  return (
    <>
      <Modal
        title="ONLINE PLAYERS"
        footer={null}
        closable={false}
        visible={true}
      >
        <ListView setPlayer={setPlayerId} playersList={onlinePlayers}/>

        <button onClick={challengePlayer} className="onlineplayers-invitebutton"> DESAFIAR </button>
      </Modal>
    </>
  );
};

export default OnlinePlayersModal;
