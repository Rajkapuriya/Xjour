import React from "react";
import { Route } from "react-router";
import ConnectDiscover from "../../components/Connect Screen Components/Discover/ConnectDiscover";
import ConnectMessages from "../../components/Connect Screen Components/Messages/ConnectMessages";
import MyConnections from "../../components/Connect Screen Components/My Connections/MyConnections";
import "./Connect.css";

function Connect() {
  return (
    <div className="connect">
      <Route path="/connect/discover">
        <ConnectDiscover />
      </Route>

      <Route path="/connect/messages">
        <ConnectMessages />
      </Route>

      <Route path="/connect/my-connections">
        <MyConnections />
      </Route>
    </div>
  );
}

export default Connect;
