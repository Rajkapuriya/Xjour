import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Oval } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

import "./DestinationAmenities.css";

import { UNAUTH_KEY } from "assets/constants/Contants";
import { defaultRadius } from "assets/strings/Strings";
import {
  retrieveAmenitiesClassesAPI,
  retrieveAmenitiesMapAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import { Box, Slider } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

import {
  amenitiesSelector,
  setAmenities,
  setMultiple,
} from "store/reducers/amenities";
import {
  useRetrieveClassesQuery,
  useRetrieveEnvelopeMutation,
} from "store/endpoints/amenities";

import GeneralMap from "components/OLMap React/GeneralMap/GeneralMap";
import ButtonAtom from "components/Atoms/Button/Button";
import Overlay from "components/extras/Overlay/Overlay";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted black",
    backgroundColor: "white",
    color: "black",
    padding: 20,
  }),
};

// document.addEventListener("contextmenu", (event) => {
//   event.preventDefault();
// });

const marks = [
  {
    value: 10,
    label: "10 Km",
  },
  {
    value: 200,
    label: "200 Km",
  },
  {
    value: 400,
    label: "400 Km",
  },
  {
    value: 600,
    label: "600 Km",
  },
  {
    value: 800,
    label: "800 Km",
  },
  {
    value: 1000,
    label: "1000 Km",
  },
];

function valuetext(value) {
  return `${value}°C`;
}

function DestinationAmenities() {
  const alert = useAlert();
  const history = useHistory();
  const storeDispatch = useDispatch();

  const [
    { userToken, reducerVisitorID, reducerLatitude, reducerLongitude },
    dispatch,
  ] = useStateValue();

  const amenitiesSlice = useSelector(amenitiesSelector);
  const { amenitiesClasses, selectedAmenityType } = amenitiesSlice;
  console.log(
    "%camenitiesSlice:",
    "background-color:crimson;color:white;",
    amenitiesSlice
  );

  const getAmenitiesClassesQueryState = useRetrieveClassesQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });
  const [retrieveEnvelope, retrieveEnvelopeMutationState] =
    useRetrieveEnvelopeMutation();
  console.log(
    "%cretrieveEnvelopeMutationState:",
    "background-color:green;color:white;",
    retrieveEnvelopeMutationState
  );
  console.log(
    "%cgetAmenitiesClassesQueryState:",
    "background-color:crimson;color:white;",
    getAmenitiesClassesQueryState
  );

  // const bounds = useRef([]);
  const [bounds, setBounds] = useState([]);

  // const [newLocation, setNewLocation] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [APIResponse, setAPIResponse] = useState([]);
  // const [minMaxCoords, setMinMaxCoords] = useState([]);
  // const [amenityType, setAmenityType] = useState(null);
  // const [radiusKM, setRadiusKM] = useState(10);

  const getAmenities = useCallback(() => {
    let retrieveEnvelopePromise;

    if (!selectedAmenityType) return;

    storeDispatch(setAmenities([]));

    const data = {
      searchClass: selectedAmenityType.class,

      xmin: bounds[0],
      ymin: bounds[1],
      xmax: bounds[2],
      ymax: bounds[3],
    };

    toast.dismiss();

    if (retrieveEnvelopePromise) {
      retrieveEnvelopePromise?.abort();
    }

    retrieveEnvelopePromise = retrieveEnvelope({
      token: userToken,
      visitorID: reducerVisitorID,
      data: JSON.stringify(data),
    }).unwrap();

    toast.promise(retrieveEnvelopePromise, {
      error: "Request Failed! Some Error Occurred.",
    });
  }, [
    bounds,
    reducerVisitorID,
    retrieveEnvelope,
    selectedAmenityType,
    storeDispatch,
    userToken,
  ]);

  useEffect(() => {
    if (selectedAmenityType) {
      getAmenities();
    }
  }, [getAmenities, selectedAmenityType, bounds]);

  const onBoundsChange = useCallback((receivedBounds) => {
    setBounds(receivedBounds);
  }, []);

  const handleSearchChange = (val) => {
    console.log("%chandleSearchChange", "background-color:pink", val);

    storeDispatch(
      setMultiple({
        selectedAmenityType: val,
        amenities: [],
      })
    );

    // setAPIResponse([]);
    // setIsLoading(true);

    // setCoord(newLocation);

    // initEmergenciesMap(
    //   minMaxCoords.lon_min,
    //   minMaxCoords.lat_min,
    //   minMaxCoords.lon_max,
    //   minMaxCoords.lat_max,
    //   val.class
    // );
  };

  // function getKM(value) {
  //   console.log("valueText", value.target.value);
  //   setRadiusKM(value.target.value);
  // }

  // const returnHomeButton = () => {
  //   // console.log("Button Pressed");
  // };

  // const getCoordinates = (e) => {
  //   getBoundsFromLatLng(e[1], e[0], radiusKM);
  //   setNewLocation([e[0], e[1]]);
  //   // setCoord(e[0], e[1]);
  // };

  // function getBoundsFromLatLng(lat, lng, radiusInKm) {
  //   var lat_change = radiusInKm / 111.2;
  //   var lon_change = Math.abs(Math.cos(lat * (Math.PI / 180)));
  //   var bounds = {
  //     lat_min: lat - lat_change,
  //     lon_min: lng - lon_change,
  //     lat_max: lat + lat_change,
  //     lon_max: lng + lon_change,
  //   };
  //   return setMinMaxCoords(bounds);
  // }
  // TODO; Fix this, get bounding box from displayed map
  // ol.Map.getView().calculateExtent(map.getSize())
  //    map.getView().calculateExtent(map.getSize())

  // function getBoundsFromLatLng(lat, lon, radiusInKm) {
  //   console.log("coordsValues initial", lat, lon, radiusInKm);
  //   // let xx = AmenitiesMap().getBox();
  //   //let box = ol.map.getView().calculateExtent(AmenitiesMap.getSize());
  //   // let box = this.map.getView().calculateExtent(this.map.getSize());
  //   let searchDistance = radiusInKm / 10; //float value in KM
  //   let minLat = lat - searchDistance / 69;
  //   let maxLat = lat + searchDistance / 69;
  //   let minLon =
  //     lon - searchDistance / Math.abs(Math.cos(lat * (Math.PI / 180)) * 69);
  //   let maxLon =
  //     lon + searchDistance / Math.abs(Math.cos(lat * (Math.PI / 180)) * 69);

  //   console.log("coordsValues", minLat, maxLat, minLon, maxLon);
  //   var bounds = {
  //     lat_min: minLat,
  //     lon_min: minLon,
  //     lat_max: maxLat,
  //     lon_max: maxLon,
  //   };
  //   setMinMaxCoords(bounds); // TODO: set the correct box here
  // }

  // useEffect(() => {
  //   getBoundsFromLatLng(reducerLatitude, reducerLongitude, defaultRadius);
  // }, [reducerLatitude, reducerLongitude]);

  // useEffect(() => {
  //   console.log(
  //     "minMaxCoords",
  //     minMaxCoords,
  //     "reducerLongitude",
  //     reducerLongitude,
  //     "reducerLatitude",
  //     reducerLatitude
  //   );
  // }, [minMaxCoords]);

  // const initEmergenciesMap = (lon_min, lat_min, lon_max, lat_max, name) => {
  //   while (APIResponse.length > 0) {
  //     APIResponse.pop();
  //   }

  //   const params = JSON.stringify({
  //     searchClass: name,
  //     xmin: lon_min,
  //     ymin: lat_min,
  //     xmax: lon_max,
  //     ymax: lat_max,
  //   });
  //   console.log("Params", params);

  //   retrieveAmenitiesMapAPI(userToken, params, reducerVisitorID).then(function (
  //     val
  //   ) {
  //     console.log("retrieving Amenities Map API", val);
  //     if (val) {
  //       setIsLoading(false);

  //       const valData = val.data;
  //       console.log("retrieving API valData", valData);

  //       for (var key in valData) {
  //         var i = Object.keys(valData).indexOf(key);

  //         const APIVal = {
  //           address: valData[key].address,
  //           distance: valData[key].distance,
  //           extra: valData[key].extra,
  //           latitude: valData[key].latitude,
  //           longitude: valData[key].longitude,
  //           name: valData[key].name,
  //           type: valData[key].type,
  //         };
  //         APIResponse.push(APIVal);
  //         setAPIResponse([...APIResponse]);
  //         setAmenityType(name);

  //         // const emergencyCoordVal = {
  //         //   latitude: valData[key].latitude,
  //         //   longitude: valData[key].longitude,
  //         //   type: valData[key].type,
  //         // };

  //         // setEmergencyCoordsArray((emergencyCoordsArray) => [
  //         //   ...emergencyCoordsArray,
  //         //   emergencyCoordVal,
  //         // ]);
  //         //emergencyCoordsArray.push(emergencyCoordVal);
  //       }
  //     } else if (val.status === UNAUTH_KEY) {
  //       // console.log("Setting to 0");
  //       localStorage.setItem("user-info-token", 0);
  //       dispatch({
  //         type: "SET_USER_TOKEN",
  //         reducerUserToken: 0,
  //       });
  //     }
  //   });
  // };

  // useEffect(() => {
  //   const coordVal = [];

  //   // setLocationLoader(true);
  //   if (reducerLongitude && reducerLatitude) {
  //     coordVal.push(reducerLongitude);
  //     coordVal.push(reducerLatitude);

  //     setCoord(coordVal);

  //     // setLocationLoader(false);
  //     // setIsLoading(false);
  //   } else {
  //     setIsLoading(false);

  //     alert.show("Could not get user's location");
  //   }
  // }, [reducerLatitude]);

  if (getAmenitiesClassesQueryState.isFetching) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" />
      </div>
    );
  }

  return (
    <div className="destination-amenities">
      <h1 className="destination-amenities__heading">Amenities</h1>

      <div className="destination-amenities__amenities-setter">
        <Select
          value={selectedAmenityType}
          onChange={handleSearchChange}
          options={amenitiesClasses}
          styles={customStyles}
          isDisabled={retrieveEnvelopeMutationState.isLoading}
        />
      </div>

      <div className="destination-amenities__map-container">
        <GeneralMap
          boundsChangeHandler={onBoundsChange}
          markersType="amenities"
        />

        {retrieveEnvelopeMutationState.isLoading && (
          <div className="destination-amenities__amenities-loader">
            <Oval color="white" secondaryColor="black" width={50} height={50} />
          </div>
        )}

        {/* <MultiMarkerMap /> */}

        <div className="createJourney__bottom"></div>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default DestinationAmenities;
