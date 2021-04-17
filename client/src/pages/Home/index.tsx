import React from "react";
import "./style.css";

import { useUserContext } from "../../context/user/user.context";
import { useMatchContext } from "../../context/match/match.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

// Components
import InfoBox from "../../components/Containers/InfoBox";
import ComunityButton from "../../components/comunityButton";
import AvatarContainer from "../../components/Containers/Avatar";
import PlayButton from "../../components/PlayButton";
import MatchInvite from "../../components/MatchInviteModal";
import OnlinePlayersModal from '../../components/OnlinePlayersModal';
// Assets
import CoinIcon from "../../assets/icons/dollar.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import AvatarIcon from "../../assets/icons/hacker.svg";

const Home = () => {
  const { username, coins, trophies, userProfile, logout } = useUserContext();
  const { createMatch} = useMatchContext();

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    userProfile(userId.key.toString());
  }, []);
  
  const playWithFriend = () => {
    createMatch(userId.key.toString(), "1");
  };

  return (
    <div className="MainPage-Containter">
      <OnlinePlayersModal />
     <MatchInvite />
      <div className="MainPage-header">
        <InfoBox text={coins} icon={CoinIcon} />
        <InfoBox text={trophies} icon={TrophyIcon} />
        <ComunityButton />
        <button onClick={() => logout(userId.key.toString())}>logout</button>
      </div>

      <AvatarContainer avatarSrc={AvatarIcon} username={username} />

      <div className="MainPage-Buttons">
        <div className="MainPage-buttons-Friend">
          <PlayButton text="Jogar com amigo" />
          <button onClick={playWithFriend}>play friend</button> 
        </div>
        <PlayButton text="Jogar aleatorio" />
      </div>
    </div>
  );
};

export default Home;
