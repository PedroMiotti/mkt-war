import React from "react";
import "./style.css";

import ListItem from "../ListItem";

import { IPlayer } from '../../../../context/user/user.type'


interface IListViewProps{
  players: IPlayer[]
}


const ListView: React.FC<IListViewProps>= ({ players }) => {
  return (
    <div className="listview-container">
      <div className="listview-header"></div>

      <div className="listview-children">
          {players.map((players, i) => (
              <ListItem
                key={players.player_id}
                Pkey={4 + i}
                avatar={players.player_avatar}
                username={players.player_username}
                trophies={players.player_trophies}
                id={players.player_id}
              />
          ))}
      </div>
    </div>
  );
};

export default ListView;
