import React, { useState } from "react";
import SearchDestinationBox from "../../../../View Destination/Search Destination Section/Search Destination Box/SearchDestinationBox";
import "./Route.css";

function Route() {


  const [destinations, setDestinations] = useState([
    {
      route: 1,
      place: "Zurich",
      arrivalDate: "10/2/2021",
      departureDate: "4/3/2021",
    },
    {
      route: 2,
      place: "Paris",
      arrivalDate: "5/3/2021",
      departureDate: "15/3/2021",
    },
    {
      route: 3,
      place: "Prague",
      arrivalDate: "16/3/2021",
      departureDate: "25/3/2021",
    },
    {
      route: 4,
      place: "Munich",
      arrivalDate: "26/3/2021",
      departureDate: "4/4/2021",
    },
    {
      route: 4,
      place: "Munich",
      arrivalDate: "26/3/2021",
      departureDate: "4/4/2021",
    },
  ]);
  const addComponent = () => {
    
  };

  return (
    <div className="route">
      {/* <SearchDestinationBox />
      <SearchDestinationBox />
      <SearchDestinationBox />
      <SearchDestinationBox /> */}

      {destinations.map((v, i) => (
        <SearchDestinationBox
          route={v.route}
          // place={v.place}
          arrivalDate={v.arrivalDate}
          departureDate={v.departureDate}
        />
      ))}

      <div className="addDestinationButton">
        <button className="primaryButtonActive" onClick={addComponent}>
          Add Destination
        </button>
      </div>
    </div>
  );
}

export default Route;
