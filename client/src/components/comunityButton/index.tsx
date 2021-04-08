import React from 'react';
import './style.css';

//Assets
import ComunityIcon from '../../assets/icons/teamwork.svg';

const ComunityButton = () => {
  return(
    <div className="ComunityButton-Container">
      <img src={ComunityIcon} className="ComunityButton-icon" alt="comunity button icon"/>

    </div>
  )

}


export default ComunityButton;
