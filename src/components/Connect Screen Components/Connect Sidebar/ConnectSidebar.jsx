import React, { useState } from "react";
import "./ConnectSidebar.css";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

function ConnectSidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    // console.log("this is event", event);
    setSelectedIndex(index);
  };

  return (
    <div className="connectSidebar">
      <div className="connectSidebar__container">
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "#f8f8f8",
            paddingTop: "12px",
          }}
        >
          <h3 className="sidebarTitle">Connect</h3>
          <List component="nav" aria-label="main mailbox folders">
            <Link to="/connect/my-connections">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemText primary="My Connections" />
              </ListItemButton>
            </Link>

            <Link to="/connect/discover">
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemText primary="Discover" />
              </ListItemButton>
            </Link>

            <Link to="/connect/messages">
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText primary="Messages" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </div>
    </div>
  );
}

export default ConnectSidebar;
