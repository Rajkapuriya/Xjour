import React, { useEffect, useState } from "react";
import "./ConnectRequestMessageBox.css";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useStateValue } from "../../../../../../config/context api/StateProvider";
import { useAlert } from "react-alert";
import { groupJoiningRequestAPI } from "../../../../../../config/authentication/AuthenticationApi";
import { Oval } from "react-loader-spinner";
import { UNAUTH_KEY } from "../../../../../../assets/constants/Contants";

function ConnectRequestMessageBox({
  firstName,
  lastName,
  flag,
  image,
  handleClose,
  pk,
}) {
  const [message, setMessage] = useState("");
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const alert = useAlert();
  const [loader, isLoading] = useState(false);

  const sendMessage = () => {
    isLoading(true);

    // console.log(pk, message);
    if (message !== "" && pk !== null) {
      sendJoiningRequest(message, pk);
    } else {
      isLoading(false);
      alert.show("Message is Empty.");
    }
  };

  const sendJoiningRequest = (message) => {
    const params = JSON.stringify({
      ugKey: pk,
      message: message,
    });

    groupJoiningRequestAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        // console.log("Request Sent", val.data);
        handleClose();
        isLoading(false);
        alert.show("Request Sent.");
        setMessage("");

        // addNewMemberToArray();
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  return (
    <>
      {loader ? (
        <div className="modalLoader">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <div className="messageBox">
          <div className="messageBox__closeButton">
            <IconButton className="closeModal" onClick={() => handleClose(pk)}>
              <Close />
            </IconButton>
            <div className="headTitle">
              <h3>Connect Invitation</h3>
            </div>
          </div>
          <div className="messageBox__top">
            <div className="top__image">
              <img className="messageBoxImage" src={image} alt="" />
            </div>
            <div className="top__details">
              <h5>
                {firstName} {lastName}
              </h5>
              <img className="svgImage" src={flag} alt="" />
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
              Send Request
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConnectRequestMessageBox;
