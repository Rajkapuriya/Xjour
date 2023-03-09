import React, { useState } from "react";
import StreetMap from "../../../../../Street Map/StreetMap";
import TransportBar from "./Transport Bar/TransportBar";
import "./Transport.css";


function Transport() {
  const [data, setData] = useState([
    { number: 0, place: "Home base", arrive: "", depart: "10/15/2021" },
    { number: 1, place: "Zurich", arrive: "10/11/2021", depart: "10/15/2021" },
    {
      number: 2,
      place: "Stuttgardt",
      arrive: "10/11/2021",
      depart: "10/19/2021",
    },
    {
      number: 3,
      place: "Nuremberg",
      arrive: "10/19/2021",
      depart: "10/23/2021",
    },
    { number: 4, place: "Prague", arrive: "10/23/2021", depart: "10/28/2021" },
  ]);
  return (
    <div className="transport">
      <div className="transport__barSection">
        <div>
          {/* <div className="barSection__header">
          <div></div>
          <div></div>
          <h5>Arrive</h5>
          <h5>Depart</h5>
        </div> */}
          {/* {data.map((v, i) => ( */}
          <TransportBar
          // number={v.number}
          // place={v.place}
          // arrive={v.arrive}
          // depart={v.depart}
          />
          {/* ))} */}
        </div>
        <div className="transport__detailSection"></div>
      </div>
      <div className="transport__mapSection">

        <StreetMap />
      </div>
    </div>
  );
}

export default Transport;
