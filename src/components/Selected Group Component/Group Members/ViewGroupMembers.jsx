import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import GroupMemberSection from "../Group Member Section/GroupMemberSection";
import PendingSection from "./Pending Section/PendingSection";
import "./ViewGroupMembers.css";

function ViewGroupMembers() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsConnectSection(!isConnectSection);
  };

  const [isConnectSection, setIsConnectSection] = React.useState(false);
  return (
    <div className="viewGroupMembers">
      {/* <h3>View Group Members</h3> */}
      {/* <MyConnections /> */}

      <h3 className="myConnections__heading">Group Connections</h3>
      <div className="myConnections__containerTop">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab className="tabButton" value={1} label="Group Members" />
            <Tab className="tabButton" value={2} label="Pending Members" />
          </Tabs>
        </Box>
      </div>

      <div className="myConnections__containerMain">
        {!isConnectSection ? <GroupMemberSection /> : <PendingSection />}
      </div>
    </div>
  );
}

export default ViewGroupMembers;
