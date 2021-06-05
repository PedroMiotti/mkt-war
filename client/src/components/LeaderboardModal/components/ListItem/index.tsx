import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Assets
import AvatarIcon from "assets/icons/hacker.svg";
import TrophyIcon from "assets/icons/trophy.svg";

//Utils
import SelectAvatarSrc from 'utils/chooseAvatar';

interface IListItemProps {
  setPlayer: any;
  Pkey: number;
  avatar: string;
  username: string;
  trophies: number;
  id: number;
  inviteButton: () => void;
}

const ListItem: React.FC<IListItemProps> = ({
  Pkey,
  avatar,
  username,
  trophies,
  id,
  setPlayer,
  inviteButton
}) => {
  return (
      <div className="listitem-container">
        <div className="listitem-key">{Pkey}</div>

        <div className="listitem-info">
          <div className="listitem-avatar-username">
            <Avatar
              style={{verticalAlign: "middle", border: "1px solid #fff" }}
              src={SelectAvatarSrc(avatar)}
              size="large"
            />
            <div>
            <h4>{username.toUpperCase()}</h4>
              <div className="listitem-trophies">
                <img
                  src={TrophyIcon}
                  className="listitem-trophy-icon"
                  alt="user avatar icon"
                />
                <p>{trophies}</p>
            </div>
            </div>
          </div>
          <button onClick={() => { setPlayer(id); inviteButton()}} className="listitem-invitebutton">Desafiar</button>
        </div>
      </div>
  );
};

export default ListItem;
