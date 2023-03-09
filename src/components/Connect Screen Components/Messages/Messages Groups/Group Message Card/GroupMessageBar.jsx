import { Avatar } from "@mui/material";
import React from "react";
import "./GroupMessageBar.css";

function GroupMessageBar({
  groupImage,
  groupTitle,
  groupSlogan,
  userImage,
  userName,
  userImageDetails,
}) {
  const userData = [
    {
      id: "01",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image: userImageDetails.base64,
      name: "Eve Gardner",
    },
    {
      id: "02",
      occupation: "Advisor",
      currentLocation: "Frankfurt, Germany",
      image: userImageDetails.base64,
      name: "Frank Sampson",
    },
    {
      id: "03",
      occupation: "Tour Guider",
      currentLocation: "Paris, France",
      image: userImageDetails.base64,
      name: "Steven Chong",
    },
    {
      id: "04",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image: userImageDetails.base64,
      name: "Majota Kambule",
    },
    {
      id: "01",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image: userImageDetails.base64,
      name: "Eve Gardner",
    },
    {
      id: "02",
      occupation: "Advisor",
      currentLocation: "Frankfurt, Germany",
      image: userImageDetails.base64,
      name: "Frank Sampson",
    },
    {
      id: "03",
      occupation: "Tour Guider",
      currentLocation: "Paris, France",
      image: userImageDetails.base64,
      name: "Steven Chong",
    },
    {
      id: "04",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image: userImageDetails.base64,
      name: "Majota Kambule",
    },
    {
      id: "01",
      occupation: "Designer",
      currentLocation: "Berlin, Germany",
      image: userImageDetails.base64,
      name: "Eve Gardner",
    },
    {
      id: "02",
      occupation: "Advisor",
      currentLocation: "Frankfurt, Germany",
      image: userImageDetails.base64,
      name: "Frank Sampson",
    },
  ];
  return (
    <div className="groupMessageBar">
      <div className="groupMessageBar__container">
        <div className="groupMessageBar__containerAvatar">
          {userData.map((v, i) => (
            <Avatar src={v.image} alt />
          ))}
        </div>
        <div className="groupMessageBar__containerBody">
          <div className="groupMessageBar__containerBodyLeft">
            <img src={groupImage} alt="" />
          </div>

          <div className="groupMessageBar__containerBodyRight">
            <h5>{groupTitle}</h5>
            <p>{groupSlogan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupMessageBar;
