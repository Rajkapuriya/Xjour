import { ArrowDownward, ArrowUpwardSharp } from "@mui/icons-material";
import React, { useRef } from "react";
import "./MessagesPeople.css";
import MessageBar from "./People Message Card/MessageBar";

function MessagesPeople({ userImageDetails, contentWrapper }) {
  const data = [
    {
      id: "01",
      image: userImageDetails.base64,
      name: "Eve Gardner",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "02",
      image: userImageDetails.base64,
      name: "Frank Sampson",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "03",
      image: userImageDetails.base64,
      name: "Steven Chong",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "04",
      image: userImageDetails.base64,
      name: "Majota Kambule",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "01",
      image: userImageDetails.base64,
      name: "Eve Gardner",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "02",
      image: userImageDetails.base64,
      name: "Frank Sampson",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "03",
      image: userImageDetails.base64,
      name: "Steven Chong",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
    {
      id: "04",
      image: userImageDetails.base64,
      name: "Majota Kambule",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur consequuntur, explicabo ullam magni totam repellendus, perspiciatis",
    },
  ];
  return (
    <div className="messagesPeople" ref={contentWrapper}>
      <div className="messagesPeople__cards">
        {data.map((v, i) => (
          <MessageBar name={v.name} image={v.image} message={v.message} />
        ))}
      </div>
      {/* <div>
        <button className="primaryButton">New Chat</button>
      </div> */}
    </div>
  );
}

export default MessagesPeople;
