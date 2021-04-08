import React from "react";
import "./style.css";

import { useUserContext } from "../../context/user/user.context";

// Utils
import { getUserIdByToken, IToken } from '../../utils/getUserIdByToken'

// Components
import InfoBox from "../../components/Containers/InfoBox";
import ComunityButton from "../../components/comunityButton";
import AvatarContainer from "../../components/Containers/Avatar";
import PlayButton from "../../components/PlayButton";
// Assets
import CoinIcon from "../../assets/icons/dollar.svg";
import TrophyIcon from "../../assets/icons/trophy.svg";
import AvatarIcon from "../../assets/icons/hacker.svg";

const Home = () => {
  const { username, coins, trophies, userProfile } = useUserContext();

  let userId: IToken = getUserIdByToken();

  React.useEffect(() => {

    userProfile(userId.key.toString());

  }, []);

  return (
    <div className="MainPage-Containter">
      <div className="MainPage-header">
        <InfoBox text={coins} icon={CoinIcon} />
        <InfoBox text={trophies} icon={TrophyIcon} />
        <ComunityButton />
      </div>

      <AvatarContainer avatarSrc={AvatarIcon} username={username}/>

      <div className="MainPage-Buttons">
        <div className="MainPage-buttons-Friend">
          <PlayButton text="Jogar com amigo" />
        </div>
        <PlayButton text="Jogar aleatorio" />
      </div>
    </div>
  );
};

export default Home;
