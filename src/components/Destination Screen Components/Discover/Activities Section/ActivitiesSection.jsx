import { Search } from "@mui/icons-material";
import React from "react";
import MyActivityCards from "../../My Activities/MyActivity Cards/MyActivityCards";
import "./ActivitiesSection.css";

function ActivitiesSection({ userImageDetails, userGroupDetails }) {
  const data = [
    {
      id: "01",
      name: "Berlin Wall Museum",
      base64: userGroupDetails.base64,
      city: "Portofino",
      countrySvg: userImageDetails.base64,
      tag1: "Tradition  Nature  Beauty",
      tag2: "Coastal  Historical",
    },
    {
      id: "02",
      name: "Ziplining",
      base64: userGroupDetails.base64,
      city: "Genoa",
      countrySvg: userImageDetails.base64,
      tag1: "Tradition  Nature  Beauty",
      tag2: "Coastal  Historical",
    },
  ];
  return (
    <div className="activitiesSection">
      <div className="activitiesSection__search">
        <p>Search Activities</p>
        <div className="inputDiv">
          <input placeholder="Berlin, Germany" />
          <Search />
        </div>
      </div>

      <div>
        {data.map((v, i) => (
          <MyActivityCards data={v} key={v + i} />
        ))}
      </div>
    </div>
  );
}

export default ActivitiesSection;
