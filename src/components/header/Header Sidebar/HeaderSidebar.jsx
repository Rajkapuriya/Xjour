import { Collections, Flight, Home } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";

import React from "react";
import { Link } from "react-router-dom";
import "./HeaderSidebar.css";

function HeaderSidebar({ navToggle }) {
  return (
    <div className={`${navToggle ? "nav-toggler" : "headerSidebar"}`}>
      <Link to="/home">
        <div className="headerSidebar__options">
          <Home />
          <h5>Home</h5>
        </div>
      </Link>

      <Link to="/destinations/my-destinations">
        <div className="headerSidebar__options">
          <Flight />
          <h5>Destination</h5>
        </div>
      </Link>

      <Link to="/connect/my-connections">
        <div className="headerSidebar__options">
          <FavoriteIcon />
          <h5>Connect</h5>
        </div>
      </Link>

      <Link to="/memories/images">
        <div className="headerSidebar__options">
          <PersonPinIcon />
          <h5>Memories</h5>
        </div>
      </Link>

      <Link to="/calender">
        <div className="headerSidebar__options">
          <Collections />
          <h5>Calendar</h5>
        </div>
      </Link>
    </div>
  );
}

export default HeaderSidebar;
