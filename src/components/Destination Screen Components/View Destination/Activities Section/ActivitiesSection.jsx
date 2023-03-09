import React from "react";
import MiniCards from "../../My Activities/Mini Cards/MiniCards";
import "./ActivitiesSection.css";

function ActivitiesSection() {
  return (
    <div className="activitiesSection">
      <h3>Activities</h3>
      <div className="connectionsCards">
        {/* {data.map((v, i) => (
          <MiniCards
            key={i}
            title={v.title}
            city={v.city}
            country={v.country}
            image={v.image}
          />
        ))} */}
      </div>
    </div>
  );
}

export default ActivitiesSection;
