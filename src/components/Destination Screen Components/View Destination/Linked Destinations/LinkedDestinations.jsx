import React from "react";
import MiniCards from "../../My Activities/Mini Cards/MiniCards";
import "./LinkedDestinations.css";

function LinkedDestinations({ data, index, getDestinationData }) {
  return (
    <div className="linkedDestinations">
      <h3>Linked Destinations</h3>
      <div className="connectionsCards">
        {data.map((v, i) => (
          <MiniCards
            data={v}
            index={i}
            getDestinationData={getDestinationData}
          />
        ))}
      </div>
    </div>
  );
}

export default LinkedDestinations;
