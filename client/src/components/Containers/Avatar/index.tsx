import React from "react";
import "./style.css";

// Assets 
import EditIcon from 'assets/icons/edit.svg';

interface IAvatarProps {
  username: string;
  avatarSrc: string;
  openDrawer: () => void;
}

const Avatar: React.FC<IAvatarProps> = ({ username, avatarSrc, openDrawer }) => {
  return (
    <div className="Avatar-Container" onClick={openDrawer}>

      <div className="Avatar-edit-container">
        <img src={EditIcon} className="Avatar-edit-icon" alt="user avatar"  />
      </div>

      <div className="Avatar-Image-Container">
        <img src={avatarSrc} className="Avatar-image" alt="user avatar" />
      </div>

      <h1 className="Avatar-Username">{username.toUpperCase()}</h1>
    </div>
  );
};

export default Avatar;
