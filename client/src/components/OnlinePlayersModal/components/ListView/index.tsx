import React from "react";
import "./style.css";

// import ListItem from "../ListItem";

// <ListItem
//   key={players.id}
//   Pkey={players.key}
//   avatar={players.avatar}
//   username={players.username}
//   trophies={players.trophies}
//   id={players.id}
// />

const data = [
  {
    key: 1,
    id: 1,
    username: "PedrinhoTsunami",
    trophies: 10,
    avatar: 1,
  },
  {
    key: 2,
    id: 2,
    username: "LilAgo",
    trophies: 2,
    avatar: 1,
  },
  {
    key: 3,
    id: 3,
    username: "CactusBral",
    trophies: 66,
    avatar: 1,
  },
];

interface IListViewProps{
  setPlayer: any;
  playersList: any[];
}


const ListView: React.FC<IListViewProps>= ({setPlayer, playersList}) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playerChoosen = e.target.value;
    setPlayer(playerChoosen);
  };

  return (
    <div className="listview-container">
      <div className="listview-header"></div>

      <div className="listview-children">
        <select onChange={handleChange}>
          {playersList.map((players) => (
            <option key={players.player_id} value={players.player_id}>
              {players.player_username}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListView;
