import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Assets
import TrophyIcon from "assets/icons/trophy.svg";

//Utils
import SelectAvatarSrc from "utils/chooseAvatar";

interface IListItemProps {
  Pkey: number;
  avatar: number;
  username: string;
  trophies: number;
  id: number;
}

const ListItem: React.FC<IListItemProps> = ({
  Pkey,
  id,
  avatar,
  username,
  trophies,
}) => {
  return (
    <div className="listitem-container">
      <div className="listitem-key">{Pkey}</div>

      <div className="listitem-info">
        <div className="listitem-avatar-username">
          <Avatar
            style={{ verticalAlign: "middle", border: "1px solid #fff" }}
            src={SelectAvatarSrc(avatar.toString())}
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
      </div>
    </div>
  );
};

export default ListItem;
