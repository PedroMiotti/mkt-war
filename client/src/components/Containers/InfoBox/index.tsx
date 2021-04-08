import React from 'react';
import './style.css';

interface IInfoBoxProps{
  icon: any,
  text: string
}


const InfoBox: React.FC<IInfoBoxProps> = ({icon, text}) => {
  return(
    <div className="InfoBox-Container">
      <img src={icon} className="InfoBox-icon" alt="info box icon" />
      <h3>{text}</h3>

    </div>
  )

}


export default InfoBox;
