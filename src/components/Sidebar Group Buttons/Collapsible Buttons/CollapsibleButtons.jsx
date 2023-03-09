import {
  Celebration,
  Close,
  Collections,
  LocalAirport,
  Message,
} from "@mui/icons-material";
import React, { useState } from "react";
import "./CollapsibleButtons.css";
import AddActivity from "../Add Activity Component/AddActivity";
import AddConnection from "../Add Connection Component/AddConnection";
import AddDestination from "../Add Destination Component/AddDestination";
import AddMedia from "../Add Media Component/AddMedia";

function CollapsibleButtons({
  handleTriggerClose,
  getImage,
  getActivities,
  getConnection,
  getDestinationData,
}) {
  const [mediaComponent, setMediaComponent] = useState(false);
  const [destinationComponent, setDestinationComponent] = useState(false);
  const [connectionComponent, setConnectionComponent] = useState(false);
  const [activityComponent, setActivityComponent] = useState(false);

  const mediaComponentActive = (e) => {
    // console.log("button Clicked", e);
    setMediaComponent(!mediaComponent);
    // console.log(mediaComponent);
  };
  const destinationComponentActive = (e) => {
    // console.log("button Clicked", e);
    setDestinationComponent(!destinationComponent);
    // console.log(destinationComponent);
  };
  const connectionComponentActive = (e) => {
    // console.log("button Clicked", e);
    setConnectionComponent(!connectionComponent);
    // console.log(connectionComponent);
  };
  const activityComponentActive = (e) => {
    // console.log("button Clicked", e);
    setActivityComponent(!activityComponent);
    // console.log(activityComponent);
  };

  return (
    // <div>
    <div className="addMenuOptions">
      {!mediaComponent &&
      !destinationComponent &&
      !connectionComponent &&
      !activityComponent ? (
        <div className="addMenuOptions__svg">
          <div
            className="addMenuOptions__svgIcon"
            onClick={mediaComponentActive}
          >
            <Collections />
            <p>Add Media</p>
          </div>

          <div
            className="addMenuOptions__svgIcon"
            onClick={destinationComponentActive}
          >
            <LocalAirport />
            <p>Add Destination</p>
          </div>
          <div
            className="addMenuOptions__svgIcon"
            onClick={connectionComponentActive}
          >
            <Message />
            <p>Add Connection</p>
          </div>
          <div
            className="addMenuOptions__svgIcon"
            onClick={activityComponentActive}
          >
            <Celebration />
            <p>Add Activity</p>
          </div>
          <div className="addMenuOptions__svgIcon">
            <Close onClick={handleTriggerClose} style={{ color: "#22b0ea" }} />
          </div>
        </div>
      ) : (
        <div className="addMenuOptions__component">
          {mediaComponent && (
            <div className="addMediaDiv">
              <AddMedia
                getImage={getImage}
                mediaComponentActive={mediaComponentActive}
              />
            </div>
          )}
          {destinationComponent && (
            <div>
              <AddDestination
                getDestinationData={getDestinationData}
                destinationComponentActive={destinationComponentActive}
              />
            </div>
          )}
          {connectionComponent && (
            <div>
              <AddConnection
                getConnection={getConnection}
                connectionComponentActive={connectionComponentActive}
              />
            </div>
          )}
          {activityComponent && (
            <div>
              <AddActivity
                getActivities={getActivities}
                activityComponentActive={activityComponentActive}
              />
            </div>
          )}
        </div>
      )}
    </div>
    // </div>
  );
}

export default CollapsibleButtons;
