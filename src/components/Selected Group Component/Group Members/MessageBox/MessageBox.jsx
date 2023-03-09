import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { groupJoiningRequestAPI } from "../../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../../config/context api/StateProvider";
import "./MessageBox.css";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../../assets/constants/Contants";

function MessageBox({ handleClose, data, index }) {
  const [message, setMessage] = useState("");
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const alert = useAlert();

  // console.log("messageBox data", data, index);
  const sendMessage = () => {
    setMessage("");
    // console.log(data.key, message);
    if (message !== null && data.key !== null) {
      sendJoiningRequest(message, data.key);
    }
  };

  const sendJoiningRequest = (message) => {
    const params = JSON.stringify({
      ugKey: data.key,
      message: message,
    });

    groupJoiningRequestAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        // console.log(val.data);
        handleClose();
        alert.show("Request Sent.");
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  return (
    <div className="messageBox">
      <div className="messageBox__closeButton">
        <IconButton className="closeModal" onClick={() => handleClose()}>
          <Close />
        </IconButton>
        <div className="headTitle">
          <h3>Group Invitation</h3>
        </div>
      </div>
      <div className="messageBox__top">
        <div className="top__image">
          <img className="messageBoxImage" alt="" src={data.base64} />
        </div>
        <div className="top__details">
          <h5>{data.name}</h5>
          <img className="svgImage" alt="" src={data.countrySvg} />
        </div>
      </div>
      <div className="messageBox__bottom">
        <div className="inputDiv">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type Your Message Here..."
          />
        </div>
        <button className="primaryButtonActive" onClick={sendMessage}>
          Join Group
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
