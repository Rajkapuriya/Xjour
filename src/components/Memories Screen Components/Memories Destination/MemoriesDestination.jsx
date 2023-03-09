import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../../config/context api/StateProvider";
import DestinationDetails from "./Destination Details/DestinationDetails";
import "./MemoriesDestination.css";

import { Oval } from "react-loader-spinner";

function MemoriesDestination() {
  const [loader, isLoading] = useState(true);
  const [{ reducerAllMemoriesDestination }, dispatch] = useStateValue();
  const [destinationArray, setDestinationArray] = useState([]);

  const memDestWrapper = useRef(null);

  // const scrollDest = (scrollOffset) => {

  useEffect(() => {
    if (reducerAllMemoriesDestination) {
      if (reducerAllMemoriesDestination.length > 0) {
        setDestinationArray(reducerAllMemoriesDestination);
        isLoading(false);
      } else {
        isLoading(false);
        setDestinationArray([]);
      }
    }
  }, [reducerAllMemoriesDestination]);

  return (
    <div className="memoriesDestination" ref={memDestWrapper}>
      <h3>Memory Destinations</h3>

      {loader ? (
        <div className="myDestination__loader">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <>
          {destinationArray.length <= 0 ? (
            <div className="myDestinations__empty">
              <h5>No Destinations</h5>
            </div>
          ) : (
            <>
              <div className="myDestinations__map">
                {[...destinationArray].reverse().map((v, i) => (
                  <DestinationDetails
                    data={v}
                    key={v + i}
                    index={i}
                    coord={[v.longitude, v.latitude]}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MemoriesDestination;
