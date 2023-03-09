import { Avatar } from "@mui/material";
import React, { useState } from "react";
import "./UsersComment.css";

function UsersComment({ userImageDetails, userGroupDetails }) {
  const data = [
    {
      id: "01",
      base64: userImageDetails.base64,
      userName: "Aimee Nat",
      comment:
        "As we moved over the border, I saw this site and I couldn't helpmyself. I had to capture this moment",
    },
    {
      id: "02",
      base64: userImageDetails.base64,
      userName: "Micheal Saylor",
      comment: "I had to capture this moment",
    },
    {
      id: "03",
      base64: userImageDetails.base64,
      userName: "Mark Will",
      comment:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae vero debitis facere perspiciatis aperiam dolorum, laudantium quidem",
    },
    {
      id: "04",
      base64: userImageDetails.base64,
      userName: "Hannah Oscar",
      comment: "Amsterdam",
    },
    {
      id: "05",
      base64: userImageDetails.base64,
      userName: "Jack Saylor",
      comment: "New york",
    },
  ];

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 2) + "..." : str;
  };
  return (
    <>
      {data.map((v, i) => (
        <div className="usersComment">
          <div className="imageSection">
            <Avatar src={v.userPhoto} />
          </div>
          <div className="textSection">
            <h5>{v.userName}</h5>
            <p>{truncate(v.comment, 50)}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default UsersComment;
