import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import "./DestinationSidebar.css";
import { Link } from "react-router-dom";

function DestinationSidebar() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    // console.log("this is event", event);
    setSelectedIndex(index);
  };
  return (
    <div className="destinationSidebar">
      <div className="destinationSidebar__container">
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "#f8f8f8",
            paddingTop: "12px",
          }}
        >
          <h3 className="sidebarTitle">Destinations</h3>
          <List component="nav" aria-label="main mailbox folders">
            <Link to="/destinations/my-destinations">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemText primary="My Destinations" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/my-activities">
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemText primary="My Activities" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/my-journeys">
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText primary="My Journeys" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/discover">
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText primary="Discover" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/notes">
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemText primary="Notes" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/emergency">
              <ListItemButton
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
              >
                <ListItemText primary="Emergency" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/amenities">
              <ListItemButton
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
              >
                <ListItemText primary="Amenities" />
              </ListItemButton>
            </Link>

            <Link to="/destinations/todo-groups">
              <ListItemButton
                selected={selectedIndex === 7}
                onClick={(event) => handleListItemClick(event, 7)}
              >
                <ListItemText primary="Todo Groups" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </div>
    </div>
  );
}

export default DestinationSidebar;
