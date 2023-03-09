import React, { useState } from "react";
import "./MemoriesSidebar.css";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

function MemoriesSidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    // console.log("this is event", event);
    setSelectedIndex(index);
  };
  return (
    <div className="memoriesSidebar">
      <div className="memoriesSidebar__container">
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "#f8f8f8",
            paddingTop: "12px",
          }}
        >
          <h3 className="sidebarTitle">Memories</h3>
          <List component="nav" aria-label="main mailbox folders">
            <Link to="/memories/images">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemText primary="Images" />
              </ListItemButton>
            </Link>

            <Link to="/memories/videos">
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemText primary="Videos" />
              </ListItemButton>
            </Link>

            <Link to="/memories/postcards">
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText primary="Postcards" />
              </ListItemButton>
            </Link>

            <Link to="/memories/documents">
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText primary="Documents" />
              </ListItemButton>
            </Link>
            <Link to="/memories/destination">
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemText primary="Destinations" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </div>
    </div>
  );
}

export default MemoriesSidebar;
