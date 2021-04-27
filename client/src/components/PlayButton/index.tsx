import React from 'react';
import './style.css';

interface IPlayButtonProps {
  text: string;
  clickAction: () => void;
}

const PlayButton: React.FC<IPlayButtonProps> = ({ text, clickAction }) => {
  return (
    <button className="PlayButton-Container" onClick={clickAction}>
      <h2>{text}</h2>
    </button>

  )

}


export default PlayButton;
