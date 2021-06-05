import React from "react";
import ReactDOM from "react-dom";
import "./assets/style/index.css";
import './assets/style/antd.css';

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

// Context
import { SocketContext, socket } from "./context/socket";
import UserState from "./context/user/user.state";
import MatchState from './context/match/match.state'

import Routes from "./router";
import history from "./utils/history";

import { Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <SocketContext.Provider value={socket}>
        <UserState>
          <MatchState>
            <Routes />
          </MatchState>
        </UserState>
      </SocketContext.Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
