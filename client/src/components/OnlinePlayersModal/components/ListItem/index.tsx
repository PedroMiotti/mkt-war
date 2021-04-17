import React from "react";
import "./style.css";

import { Avatar } from "antd";

// Assets
import AvatarIcon from "../../../../assets/icons/hacker.svg";
import TrophyIcon from "../../../../assets/icons/trophy.svg";

interface IListItemProps {
  Pkey: number;
  avatar: number;
  username: string;
  trophies: number;
  id: number;
}

const ListItem: React.FC<IListItemProps> = ({
  Pkey,
  avatar,
  username,
  trophies,
  id,
}) => {
  return (
      <button className="listitem-container">
        <div className="listitem-key">{Pkey}</div>

        <div className="listitem-info">
          <div className="listitem-avatar-username">
            <Avatar
              style={{ backgroundColor: "#fff", verticalAlign: "middle" }}
              src={AvatarIcon}
              shape="square"
              size="large"
            />
            <h4>{username}</h4>
          </div>

          <div className="listitem-trophies">
            <img
              src={TrophyIcon}
              className="Lobby-trophy-icon"
              alt="user avatar icon"
            />
            <h4>{trophies}</h4>
          </div>
        </div>
      </button>
  );
};

export default ListItem;
