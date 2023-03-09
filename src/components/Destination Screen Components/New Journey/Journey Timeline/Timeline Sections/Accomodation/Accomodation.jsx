import React from "react";
import TransportBar from "../Transport/Transport Bar/TransportBar";
import "./Accomodation.css";

function Accomodation() {
  return (
    <div className="accomodation">
       {/* <div className="accomodation__barSection"> */}
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
      {/* </div> */}
      <div className="accomodation__detailSection"></div>
    </div>
  );
}

export default Accomodation;
