import React, { useEffect, useState } from "react";
import "./AddActivity.css";
import { Oval } from "react-loader-spinner";

import MiniActivitiesCard from "../../Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import { useStateValue } from "../../../config/context api/StateProvider";
import { Close } from "@mui/icons-material";

function AddActivity({ activityComponentActive, getActivities }) {
  const [{ userToken, reducerMyActivities }, dispatch] = useStateValue();
  const [activitiesArrayData, setActivitiesArrayData] = useState([]);
  const [loader, isLoading] = useState(true);

  useEffect(() => {
    // console.log("reducerMyActivities", reducerMyActivities);
    if (reducerMyActivities) {
      if (reducerMyActivities.length > 0) {
        setActivitiesArrayData(reducerMyActivities);
        isLoading(false);
        // console.log("reducerMyActivities", reducerMyActivities);
      }
    } else {
      isLoading(false);
      setActivitiesArrayData([]);
      // console.log("reducerMyActivities", reducerMyActivities);
    }
  }, [reducerMyActivities]);

  return (
    <div className="addActivity">
      <div className="addMenu__closeButton">
        <Close onClick={activityComponentActive} style={{ color: "#22b0ea" }} />
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
              <h5>No Activities</h5>
            </div>
          ) : (
            <>
              {activitiesArrayData?.map((v, i) => (
                <MiniActivitiesCard
                  key={v + i}
                  data={v}
                  index={i}
                  handleClick={getActivities}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AddActivity;
