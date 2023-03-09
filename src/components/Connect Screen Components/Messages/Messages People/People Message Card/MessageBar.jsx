import { Avatar } from "@mui/material";
import React from "react";
import "./MessageBar.css";

function MessageBar({ image, name, message }) {
  return (
    <div className="messageBar">
      <div className="messageBar__container">
        <div className="messageBar__containerAvatar">
          <Avatar src={image} alt={image} />
        </div>
        <div className="messageBar__containerBody">
          <h5>{name}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageBar;
