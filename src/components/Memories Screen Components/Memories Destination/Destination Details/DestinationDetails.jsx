import { Close, LocationOn, Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import "./DestinationDetails.css";
import { useStateValue } from "../../../../config/context api/StateProvider";
import { useHistory, useParams } from "react-router-dom";
import MiniMap from "../../../OLMap React/MiniMap";

function DestinationDetails({ data, index, coord }) {
  const [{ userToken }, dispatch] = useStateValue();
  const history = useHistory();
  const { tracID } = useParams();

  const getSelectedDestination = () => {
    dispatch({
      type: "SELECTED_MEMORIES_DESTINATION",
      reducerSelectedMemoryDestination: data,
    });
    history.push(`/memories/destination/:${data.tracID}`);
  };
  return (
    <div className="destinationDetails" onClick={getSelectedDestination}>
      <div className="destinationDetails__left">
        <div className="leftTop">
          <LocationOn />
          <h5>{data.msg}</h5>
        </div>
        <div className="leftStart leftDuration">
          <p>Start:</p>
          <h5>{data.startTime}</h5>
        </div>
        <div className="leftEnd leftDuration">
          <p>End:</p>
          <h5>{data.endTime}</h5>
        </div>
        <div className="mid__speed">
          <h5>{data.tmpStmp}</h5>
        </div>
        <div className="mid__speed">
          <h5>Move Speed:</h5>
          <p>{data.avgMpS}</p>
        </div>
      </div>
      <div className="destinationDetails__mid">
        {coord.length >= 1 && <MiniMap coord={coord} />}
      </div>
      <div className="destinationDetails__right">
        <div className="rightIconButtons">
          <IconButton>
            <Close />
          </IconButton>
        </div>
        <div className="rightIconButtons">
          <IconButton>
            <Share />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
