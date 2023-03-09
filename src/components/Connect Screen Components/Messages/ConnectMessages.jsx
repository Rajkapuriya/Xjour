import React, { useEffect, useRef, useState } from "react";
import "./ConnectMessages.css";
import { Box, Tab, Tabs } from "@mui/material";
// import { Box } from "@mui/system";
import MessagesPeople from "./Messages People/MessagesPeople";
import MessagesGroups from "./Messages Groups/MessagesGroups";
import { useStateValue } from "../../../config/context api/StateProvider";

function ConnectMessages() {
  const [{ reducerDefaultPictures }, dispatch] = useStateValue();

  const [isMessageSection, setIsMessageSection] = useState(false);
  const [value, setValue] = useState(1);
  const [userImageDetails, setUserImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [userGroupDetails, setUserGroupDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });

  const peopleWrapper = useRef(null);
  const grpWrapper = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsMessageSection(!isMessageSection);
  };

  useEffect(() => {
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

      setUserImageDetails({
        ...userImageDetails,
        base64: reducerDefaultPictures[5].base64Value,
        base64DocumentID: reducerDefaultPictures[5].documentID,
      });
      setUserGroupDetails({
        ...userGroupDetails,
        base64: reducerDefaultPictures[1].base64Value,
        base64DocumentID: reducerDefaultPictures[1].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  return (
    <div className="messages">
      <h3 className="messages__heading">Messages</h3>
      <div className="messages__containerTop">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab className="tabButton" value={1} label="People" />
            <Tab className="tabButton" value={2} label="Groups" />
          </Tabs>
        </Box>
      </div>

      <div className="messages__containerMain">
        {!isMessageSection ? (
          <>
            <MessagesPeople
              userImageDetails={userImageDetails}
              contentWrapper={peopleWrapper}
            />
          </>
        ) : (
          <>
            <MessagesGroups
              userImageDetails={userImageDetails}
              userGroupDetails={userGroupDetails}
              contentWrapper={grpWrapper}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ConnectMessages;
