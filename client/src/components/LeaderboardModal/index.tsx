import React from "react";
import "./style.css";

import { Modal } from "antd";

import ListView from "./components/ListView";

import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

interface ILeaderboardModalProps {
  openModal: boolean;
  closeModal: () => void;
}

const OnlinePlayersModal: React.FC<ILeaderboardModalProps> = ({ openModal, closeModal }) => {
  const { leaderboard, getLeaderboard } = useUserContext();

  const [isvisible, setIsVisible] = React.useState(openModal);

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    if (openModal)
      setIsVisible(true)
    else
      setIsVisible(false);

  }, [openModal])

  React.useEffect(() => {

    getLeaderboard();

  }, [])

  return (
    <>
      <Modal
        title="Leaderboard"
        footer={null}
        closable={false}
        visible={isvisible}
        onCancel={closeModal}
      >
        <div className="leaderboard-top3">
            
        </div>

        <div className="leaderboard-listview">
            <ListView players={leaderboard} />
        </div>
      </Modal>
    </>
  );
};

export default OnlinePlayersModal;
