import { ChevronLeft } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../config/context api/StateProvider";
import "./DestinationEmergency.css";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";
import { retrieveEmergenciesMapAPI } from "../../../config/authentication/AuthenticationApi";
import EmergencyMap from "../../OLMap React/EmergencyMap";
import { Oval } from "react-loader-spinner";

function DestinationEmergency() {
  const [
    { userToken, reducerVisitorID, reducerLatitude, reducerLongitude },
    dispatch,
  ] = useStateValue();
  const [coord, setCoord] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);
  const [emergencyArrayData, setEmergencyArrayData] = useState([]);
  const [emergencyCoordsArray, setEmergencyCoordsArray] = useState([]);

  const returnHomeButton = () => {
    // console.log("Button Pressed");
  };

  const initEmergenciesMap = () => {
    const params = JSON.stringify({
      longitude: reducerLongitude,
      latitude: reducerLatitude,
      range: 4500,
    });
    console.log("Params", params);

    retrieveEmergenciesMapAPI(userToken, params, reducerVisitorID).then(
      function (val) {
        console.log("retrieving Emergencies Map API", val);
        if (val) {
          const valData = val.data;
          //console.log("retrieving API valData", valData);

          for (var key in valData) {
            var i = Object.keys(valData).indexOf(key);

            const emergencyVal = {
              address: valData[key].address,
              distance: valData[key].distance,
              extra: valData[key].extra,
              latitude: valData[key].latitude,
              longitude: valData[key].longitude,
              name: valData[key].name,
              type: valData[key].type,
            };

            emergencyArrayData.push(emergencyVal);

            const emergencyCoordVal = {
              latitude: valData[key].latitude,
              longitude: valData[key].longitude,
              type: valData[key].type,
            };

            setEmergencyCoordsArray((emergencyCoordsArray) => [
              ...emergencyCoordsArray,
              emergencyCoordVal,
            ]);
            //emergencyCoordsArray.push(emergencyCoordVal);
            setIsLoading(false);
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
    );
  };

  useEffect(() => {
    console.log("Emergency Cords", emergencyCoordsArray);
    //setEmergencyCoordsArray([...emergencyCoordsArray])
  }, [emergencyCoordsArray]);

  useEffect(() => {
    console.log(
      "reducerLongitude",
      reducerLongitude,
      "reducerLatitude",
      reducerLatitude
    );

    const coordVal = [];

    setLocationLoader(true);
    if (reducerLongitude && reducerLatitude) {
      coordVal.push(reducerLongitude);
      coordVal.push(reducerLatitude);

      setCoord(coordVal);

      setLocationLoader(false);
    }

    initEmergenciesMap();
  }, [reducerLatitude]);

  if (isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" />
      </div>
    );
  }

  return (
    <div className="destinationEmergency">
      <div className="createJourney__top">
        <div className="container__topLeft">
          <ChevronLeft onClick={returnHomeButton} />
          <h3>Emergency</h3>
        </div>
      </div>

      <div className="destinationEmergency__mainScreen">
        {/* {coord.length >= 1 && (
          <MultiMarkerMap
            coord={coord}
            emergencyCoordsArray={emergencyCoordsArray}
          />
        )} */}
        {coord.length >= 1 && (
          <EmergencyMap
            coord={coord}
            emergencyCoordsArray={emergencyCoordsArray}
          />
        )}

        {/* <MultiMarkerMap /> */}

        <div className="createJourney__bottom">
          {/* <button className="primaryButtonActive" onClick={createNewJourney}>
            Create Journey
          </button> */}

          {/* <div className="emptyDiv"></div> */}
        </div>
      </div>
    </div>
  );
}

export default DestinationEmergency;
