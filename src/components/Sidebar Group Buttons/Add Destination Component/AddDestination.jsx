import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useStateValue } from "../../../config/context api/StateProvider";
import MiniDestinationCard from "../../Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";
import "./AddDestination.css";

function AddDestination({ destinationComponentActive, getDestinationData }) {
  const [{ userToken, reducerMyDestinations }, dispatch] = useStateValue();
  const [activitiesArrayData, setActivitiesArrayData] = useState([]);
  const [loader, isLoading] = useState(true);

  useEffect(() => {
    // console.log("reducerMyDestinations", reducerMyDestinations);
    if (reducerMyDestinations) {
      if (reducerMyDestinations.length > 0) {
        setActivitiesArrayData(reducerMyDestinations);
        isLoading(false);
        // console.log("reducerMyDestinations", reducerMyDestinations);
      }
    } else {
      isLoading(false);
      setActivitiesArrayData([]);
      // console.log("reducerMyDestinations", reducerMyDestinations);
    }
  }, [reducerMyDestinations]);

  return (
    <div className="addDestination">
      <div className="addMenu__closeButton">
        <Close
          onClick={destinationComponentActive}
          style={{ color: "#22b0ea" }}
        />
        <h3>Close</h3>
      </div>
      {loader ? (
        <div className="collapisible__loader">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <>
          {activitiesArrayData?.length <= 0 ? (
            <div className="collapsibleItem__text">
              <h5>No Destination</h5>
            </div>
          ) : (
            <>
              {activitiesArrayData?.map((v, i) => (
                <MiniDestinationCard
                  key={v + i}
                  data={v}
                  index={i}
                  handleClick={getDestinationData}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AddDestination;
