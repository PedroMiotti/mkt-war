import React from 'react';
import './style.css';

// Assets
import PlayIcon from '../../assets/icons/play-button.svg';

interface IPlayButtonProps{
  text: string
}

const PlayButton: React.FC<IPlayButtonProps> = ({ text }) => {
  return (
    <div className="PlayButton-Container">
<div className="PlayButton-Icon-Container">
      <img src={PlayIcon} className="PlayButton-Icon" alt="play icon" />
</div>
      <h2>{text}</h2>


    </div>

  )

}


export default PlayButton;
