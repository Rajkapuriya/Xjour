import { Search } from "@mui/icons-material";
import React from "react";
import MyDestinationCards from "../../My Destinations/MyDestination Cards/MyDestinationCards";
import "./DestinationsSection.css";

function DestinationsSection({ userImageDetails, userGroupDetails }) {
  const data = [
    {
      id: "01",
      base64: userGroupDetails.base64,
      name: "Portofino",
      countrySvg: userImageDetails.base64,
      tag1: "Tradition  Nature  Beauty",
      tag2: "Coastal  Historical",
    },
    {
      id: "02",
      base64: userGroupDetails.base64,
      name: "Genoa",
      countrySvg: userImageDetails.base64,
      tag1: "Tradition  Nature  Beauty",
      tag2: "Coastal  Historical",
    },
    
  ];
  return (
    <div className="destinationsSection">
      <div className="destinationsSection__search">
        <p>Search Destinations</p>
        <div className="inputDiv">
          <input placeholder="Berlin, Germany" />
          <Search />
        </div>
      </div>

      <div>
        {data.map((v, i) => (
          <MyDestinationCards key={v + i} data={v} index={i} />
        ))}
      </div>
    </div>
  );
}

export default DestinationsSection;
