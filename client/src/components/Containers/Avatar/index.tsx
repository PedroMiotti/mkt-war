import React from "react";
import "./style.css";

interface IAvatarProps {
  username: string;
  avatarSrc: string;
}

const Avatar: React.FC<IAvatarProps> = ({ username, avatarSrc }) => {
  return (
    <div className="Avatar-Container">

      <div className="Avatar-Image-Container">
        <img src={avatarSrc} className="Avatar-image" alt="user avatar" />
      </div>

      <h1 className="Avatar-Username">{username.toUpperCase()}</h1>
    </div>
  );
};

export default Avatar;
