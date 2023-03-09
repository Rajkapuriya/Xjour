import { ChevronLeft } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Oval } from "react-loader-spinner";

import { retrieveTrackValueAPI } from "../../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../../config/context api/StateProvider";
import OLMapReact from "../../../OLMap React/OLMapReact";
import "./SelectedMemoryDestination.css";
import { UNAUTH_KEY } from "../../../../assets/constants/Contants";

function SelectedMemoryDestination({ tracID }) {
  const history = useHistory();
  const [
    { userToken, reducerSelectedMemoryDestination, reducerVisitorID },
    dispatch,
  ] = useStateValue();
  const [selectedData, setSelectedData] = useState(
    reducerSelectedMemoryDestination
  );
  const ID = selectedData.tracID;
  const [coord, setCoord] = useState([]);
  const [feature, setFeatures] = useState([]);

  const [loading, isLoading] = useState(true);

  const getTrackValue = () => {
    retrieveTrackValueAPI(userToken, ID, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("retrieving Track Value", val.data); 
        isLoading(false);
        if (val.data) {
          var info = val.data;
        }
        var i = 0;
        var arrayCorrds = []
        var arrayVal = []
        for (var key in info) {
          const coordVal = [];

          coordVal.push(info[key].longitude1);
          coordVal.push(info[key].latitude1);


          arrayCorrds.push(coordVal)

        }

        arrayVal.push(arrayCorrds[0])
        arrayVal.push(arrayCorrds[arrayCorrds.length - 1])


        console.log("arrayVal", arrayVal)


        setFeatures(arrayVal)

        setCoord(arrayCorrds);
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };
  useEffect(() => {
    getTrackValue();
  }, []);

  useEffect(() => {
    // console.log("coordVal", coord);
  }, [coord]);

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }
  const moveToTracksPage = () => {
    history.push("/memories/destination/");
  };
  return (
    <div className="selectedMemoryDestination">
      <div className="groupContainer__top">
        <ChevronLeft onClick={moveToTracksPage} />
        <h3>Track ID: {selectedData.tracID}</h3>
      </div>
      {/* <h1>Track ID: ${selectedData.tracID}</h1> */}

      <div className="dest__body">
        {
          coord.length > 0 && <OLMapReact coord={coord} extentVal feature={feature} />
        }

      </div>
    </div>
  );
}

export default SelectedMemoryDestination;
