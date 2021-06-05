import React from "react";
import "./style.css";

// Context
import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from "../../utils/getUserIdByToken";
import SelectAvatarSrc from 'utils/chooseAvatar';


// Components
import InfoBox from "../../components/Containers/InfoBox";
import AvatarContainer from "../../components/Containers/Avatar";
import PlayButton from "../../components/PlayButton";
import MatchInviteModal from "../../components/MatchInviteModal";
import OnlinePlayersModal from "../../components/OnlinePlayersModal";
import ChooseAvatarDrawer from "../../components/ChooseAvatarDrawer";
import LeaderboardModal from '../../components/LeaderboardModal';

// Assets
import CoinIcon from "../../assets/icons/dollar.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import ComunityIcon from '../../assets/icons/teamwork.svg';
import PodiumIcon from '../../assets/icons/podium.svg';


const Home = () => {
  const {
    username,
    coins,
    trophies,
    avatar,
    userProfile,
    logout,
    setUserOnline,
    getOnlinePlayers,
  } = useUserContext();

  const [onlinePlayersModalVisible, setOnlinePlayersModalVisible] = React.useState(false);
  const [chooseAvatarsDrawerVisible, setChooseAvatarsDrawerVisible] = React.useState(false);
  const [leaderboardModalVisible, setLeaderboardModalVisible] = React.useState(false);


  const [ userAvatar, setUserAvatar] = React.useState(SelectAvatarSrc(avatar));

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {
    userProfile(userId.key.toString());
    setUserOnline();

  }, []);

  React.useEffect(() => {
    if(avatar)
      setUserAvatar(SelectAvatarSrc(avatar))

  }, [avatar]);

  const playWithFriend = () => {
    getOnlinePlayers();
    setOnlinePlayersModalVisible(true);
  };



  return (
    <div className="MainPage-Containter">
      
      <MatchInviteModal />

      {onlinePlayersModalVisible && 
        <OnlinePlayersModal openModal={onlinePlayersModalVisible} closeModal={() => setOnlinePlayersModalVisible(false)}/>
      }
      <ChooseAvatarDrawer openDrawer={chooseAvatarsDrawerVisible} closeDrawer={() => setChooseAvatarsDrawerVisible(false)}/>
      {leaderboardModalVisible &&
        <LeaderboardModal openModal={leaderboardModalVisible} closeModal={() => setLeaderboardModalVisible(false)}/>
      }

      <div className="MainPage-header">
        <div className="MainPage-header-infobox">
          <div style={{marginRight: "20px"}}>
            <InfoBox text={coins} icon={CoinIcon}  />
          </div>
          <InfoBox text={trophies} icon={TrophyIcon} />
        </div>

        <div className="mainPage-comunity-button-Container">
          <img src={ComunityIcon} className="mainPage-ComunityButton-icon" alt="comunity button icon" />
        </div>

        <div className="mainPage-podium-button-Container" onClick={(e) => {e.stopPropagation(); setLeaderboardModalVisible(true)}}>
          <img src={PodiumIcon} className="mainPage-podiumButton-icon" alt="comunity button icon" />
        </div>

        <img src={LogoutIcon} onClick={() => logout(userId.key.toString())} className="mainPage-logout-button" alt="logout icon" />
      </div>

      <AvatarContainer avatarSrc={userAvatar} username={username} openDrawer={() => setChooseAvatarsDrawerVisible(true)}/>

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
