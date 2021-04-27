import React from "react";
import "./style.css";

// Context
import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";

// Components
import InfoBox from "../../components/Containers/InfoBox";
import AvatarContainer from "../../components/Containers/Avatar";
import PlayButton from "../../components/PlayButton";
import MatchInvite from "../../components/MatchInviteModal";
import OnlinePlayersModal from "../../components/OnlinePlayersModal";

// Assets
import CoinIcon from "../../assets/icons/dollar.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import AvatarIcon from "../../assets/avatar/1.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import ComunityIcon from '../../assets/icons/teamwork.svg';
import PodiumIcon from '../../assets/icons/podium.svg';

const Home = () => {
  const {
    username,
    coins,
    trophies,
    userProfile,
    logout,
    setUserOnline,
    getOnlinePlayers,
  } = useUserContext();

  const [
    onlinePlayersModalVisible,
    setOnlinePlayersModalVisible,
  ] = React.useState(false);

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    userProfile(userId.key.toString());
    setUserOnline();
  }, []);

  const playWithFriend = () => {
    setOnlinePlayersModalVisible(true);
    getOnlinePlayers();
  };

  return (
    <div className="MainPage-Containter">
      {onlinePlayersModalVisible && (
        <OnlinePlayersModal
          close={() => setOnlinePlayersModalVisible(!onlinePlayersModalVisible)}
        />
      )}
      <MatchInvite />

      <div className="MainPage-header">
        <div className="MainPage-header-infobox">
          <InfoBox text={coins} icon={CoinIcon} />
          <InfoBox text={trophies} icon={TrophyIcon} />
        </div>

        <div className="mainPage-comunity-button-Container">
          <img src={ComunityIcon} className="mainPage-ComunityButton-icon" alt="comunity button icon" />
        </div>

        <div className="mainPage-podium-button-Container">
          <img src={PodiumIcon} className="mainPage-podiumButton-icon" alt="comunity button icon" />
        </div>

        <img src={LogoutIcon} onClick={() => logout(userId.key.toString())} className="mainPage-logout-button" alt="logout icon" />
      </div>

      <AvatarContainer avatarSrc={AvatarIcon} username={username} />

      <div className="MainPage-Buttons">
        <div className="MainPage-buttons-Friend">
          <PlayButton text="Jogar com amigo" clickAction={() => playWithFriend()}/>
        </div>
        <PlayButton text="Jogar aleatorio" clickAction={() => playWithFriend()}/>
      </div>
    </div>
  );
};

export default Home;
