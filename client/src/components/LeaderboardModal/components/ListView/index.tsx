import React from "react";
import "./style.css";

import ListItem from "../ListItem";


interface IListViewProps{
  setPlayer: any;
  playersList: any[];
  inviteButton: () => void;
}


const ListView: React.FC<IListViewProps>= ({setPlayer, playersList, inviteButton}) => {

  const [playerId, setPlayerId] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playerChoosen = e.target.value;
    setPlayer(playerChoosen);
  };

  React.useEffect(() => {

    setPlayer(playerId)

  }, [playerId])
  

  return (
    <div className="listview-container">
      <div className="listview-header"></div>

      <div className="listview-children">
          {playersList.map((players, i) => (
              <ListItem
                key={players.player_id}
                Pkey={i +1}
                avatar={players.player_avatar}
                username={players.player_username}
                trophies={players.player_trophies}
                id={players.player_id}
                inviteButton={inviteButton}
                setPlayer={setPlayerId}
              />
          ))}
      </div>
    </div>
  );
};

export default ListView;
