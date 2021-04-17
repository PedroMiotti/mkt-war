import React from "react";
import "./style.css";

import { Modal } from "antd";

import ListView from "./components/ListView";
import ListItem from "./components/ListItem";

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

const OnlinePlayersModal = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  return (
    <>
      <Modal
        title="ONLINE PLAYERS"
        footer={null}
        closable={false}
        visible={isModalVisible}
      >
        <ListView
          children={data.map((players) => (
            <ListItem
              key={players.id}
              Pkey={players.key}
              avatar={players.avatar}
              username={players.username}
              trophies={players.trophies}
              id={players.id}
            />
          ))}
        />

        <button className="onlineplayers-invitebutton"> DESAFIAR </button>
      </Modal>
    </>
  );
};

export default OnlinePlayersModal;
