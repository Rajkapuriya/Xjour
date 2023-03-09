import {
  Close,
  DeleteForever,
  Edit,
  KeyboardReturn,
} from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { UNAUTH_KEY } from "../../../../../assets/constants/Contants";
import {
  createDestinationAPI,
  deleteWayPointItemAPI,
  retrieveLocationDataAPI,
} from "../../../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../../../config/context api/StateProvider";
import { useAlert } from "react-alert";
import "./LocationSearchBar.css";
import Select from "react-select";

function LocationSearchBar({
  data,
  index,
  removeArray,
  removeWaypoint,
  locations,
  setLocations,
  updateArray,
  key,
  deleteWayPointItem,
  joKey,
  updateArrayEndTime,
  updateArrayStartTime,
  callAPI,
  checkArray,
}) {
  const [{ userToken, reducerMyDestinations, reducerVisitorID }, dispatch] =
    useStateValue();
  const [barColor, setBarColor] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [locationLoader, setLocationLoader] = useState(false);
  const [searchDropDown, setSearchDropDown] = useState(0);
  const [myDestinationsArray, setMyDestinationsArray] = useState([]);
  const [loader, isLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [locationInput, setLocationInput] = useState(false);
  const [autoSearchInput, setAutoSearchInput] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);

  console.log("dataInLocation", data);
  console.log("dataInLocation index", index);

  const alert = useAlert();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  let [isBlocking, setIsBlocking] = useState(false);
  const [locationSearcher, setLocationSearcher] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const changeLocationSearcher = () => {
    setLocationData([]);
    setLocationSearcher(!locationSearcher);
  };

  const handleSearchChange = (val) => {
    // console.log("handleSearchChange", val);
    setSelectedLocation(val);

    setIsBlocking(true);

    if (val) {
      if (val.lon && val.lat) {
        const config = JSON.stringify({
          DestinationType: "waypoint",
        });
        const params = JSON.stringify({
          pk: joKey,
          latitude: val.lat,
          longitude: val.lon,
          name: val.name,
          displayName: val.name,
          configurations: config,
        });
        // console.log("Params", params);

        createDestinationAPI(userToken, params, reducerVisitorID).then(
          function (value) {
            if (value) {
              const valData = value.data;
              if (valData) {
                // console.log("valData", valData);
                // updateArray(val.lon, val.lat, val.name, index, valData.dstKey);
                checkArray(
                  val.lon,
                  val.lat,
                  val.name,
                  index,
                  valData.dstKey,
                  1,
                  2,
                  data.jwKey
                );
              }
            }
          }
        );
      }
    }

    const coordVal = [];
  };

  const changeFields = () => {
    if (searchDropDown === 0 || searchDropDown === -1) {
      setSearchDropDown(1);
      // console.log("setting value to 1");
    } else {
      setSearchDropDown(0);
      // console.log("setting value to 0");
    }
    // console.log(searchDropDown);
  };

  const checkColor = () => {
    if (data.isLast && index !== data.length) {
      //red color
      setBarColor("#a90102");
    } else if (!data.isLast && index === 0) {
      //green color
      setBarColor("#00a701");
    } else {
      //grey color
      setBarColor("#808080");
    }
  };

  const dateArrivalMilisec = (e) => {
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();

    updateArrayStartTime(milliseconds, index, e);
  };
  const dateDepartureMilisec = (e) => {
    var date = new Date(e);
    var milliseconds = date.getTime();

    updateArrayEndTime(milliseconds, index, e);
  };

  const destinationSelection = (val) => {
    // the val selected
    // console.log("destinationSelection", val);

    if (val) {
      if (val.longitude && val.latitude) {
        checkArray(
          val.longitude,
          val.latitude,
          val.name,
          index,
          val.key,
          1,
          2,
          data.jwKey
        );
      }
    }
  };

  const handleOnSearch = (string, results) => {
    console.log("searchText", string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    // console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
    console.log("searchText", searchData);
  };

  const handleOnSelect = (val) => {
    if (val) {
      setLocationLoader(true);
      if (callAPI) {
      } else {
        if (val.lon && val.lat) {
          // console.log("val", val);
          var indexVal = locations.findIndex((x) => x.id === data.id);
          // console.log("indexVal", indexVal);

          let arrayItems = locations;
          let item = { ...arrayItems[indexVal] };

          updateArray(val.lon, val.lat, val.name, index, val.key);

          setLocationLoader(false);
        }
      }
    }
  };

  const formatResult = (item) => {
    // console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };
  const getTrackValue = (e) => {
    e.preventDefault();
    setLocationLoader(true);
    // console.log("searchData", searchData);

    setLocationData([]);
    if (searchData) {
      retrieveLocationDataAPI(userToken, searchData, reducerVisitorID).then(
        function (val) {
          console.log("retrieving Track", searchData, val);

          setLocationSearcher(false);
          setSearchData(null);
          if (val) {
            console.log("retrieving Track Value", JSON.parse(val.data));
            if (val.data) {
              var info = JSON.parse(val.data);
            }
            var i = 0;
            for (var key in info) {
              var i = Object.keys(info).indexOf(key);
              // console.log("Index:" + i);
              const locationArray = {
                lon: parseFloat(info[key].lon),
                lat: parseFloat(info[key].lat),
                name: info[key].display_name,
                label: info[key].display_name,
                key: i,
              };
              // locationData.push(locationArray);

              setLocationData((locationData) => [
                ...locationData,
                locationArray,
              ]);
            }

            setLocationLoader(false);
            alert.show("Location Loaded");
            // console.log("locationData", locationData);
          } else if (val.status === UNAUTH_KEY) {
            // console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          } else {
            setLocationLoader(false);
            alert.show("Could not get Locations");
          }
        }
      );
    }
  };

  const changeAutoSearchInput = () => {
    setLocationInput(!locationInput);
    setAutoSearchInput(false);
  };

  const editWayPoint = () => {
    console.log("button Pressed");
    setLocationInput(false); // handleOpenDeleteConfirmation();
  };

  const confirmDelete = (key) => {
    // console.log("vvv", key);
    setIsLoading(true);
    deleteWayPointItemAPI(userToken, key, reducerVisitorID).then(function (
      val
    ) {
      setIsLoading(true);
      // console.log("delete API response >>", val.data);
      setIsLoading(false);
      if (val.data.rows === "1") {
        alert.show("WayPoint Deleted Successfully");
        removeWaypoint(data, index);
        handleCloseDeleteConfirmation();
        setLocationInput(false);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        alert.show("Some Error Occured");
      }
    });
  };

  // console.log("UseEffect my Destinations:", reducerMyDestinations);
  useEffect(() => {
    // console.log("reducerMyDestinations", reducerMyDestinations);
    if (reducerMyDestinations) {
      if (reducerMyDestinations.length > 0) {
        setMyDestinationsArray(reducerMyDestinations);
        isLoading(false);
        // console.log("reducerMyDestinations", reducerMyDestinations);
      } else {
        isLoading(false);
        setMyDestinationsArray([]);
        // console.log("reducerMyDestinations", reducerMyDestinations);
      }
    }
  }, [reducerMyDestinations]);

  useEffect(() => {
    checkColor();
    // console.log("checking Data ", data);
  }, [data]);

  useEffect(() => {
    if (data === null || data === "") {
      setLocationInput(false);
      // console.log("checking LocationInput true", data);
    } else {
      // console.log("checking LocationInput true", data);
      if (data.name !== null) {
        setLocationInput(true);
        // console.log("checking LocationInput true", data);
      } else if (typeof data.name === "undefined" || data.name === "") {
        setLocationInput(false);
        // console.log("checking LocationInput false", data.name);
      } else {
        setLocationInput(false);
        // console.log("checking LocationInput false", data.name);
      }
    }
    // console.log("checking LocationInput ", locationInput);
  }, [data]);

  return (
    <div className="locationSearchBar">
      <div style={{ backgroundColor: barColor, width: "4px" }}></div>
      <div className="topSectionLocation">
        <div className="locationSearchBar__name">
          <form>
            {locationInput ? (
              <div className="locationSearchBar__edit">
                <h5>{data?.name}</h5>
                {/* <DeleteForever onClick={changeLocationInput} /> */}
                {/* <Edit onClick={deleteWayPoint} /> */}
                <Edit onClick={editWayPoint} />
              </div>
            ) : (
              <>
                {searchDropDown === 0 ? (
                  <>
                    {locationData.length === 0 && locationSearcher ? (
                      <ReactSearchAutocomplete
                        styling={{
                          hoverBackgroundColor: "#22b0ea",
                          zIndex: 999,
                          backgroundColor: "white",
                        }}
                        items={locationData}
                        autoFocus
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        placeholder="Enter Location"
                        formatResult={formatResult}
                      />
                    ) : (
                      <>
                        <Select
                          value={selectedLocation}
                          onChange={handleSearchChange}
                          options={locationData}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 999 }),
                            borderBottom: "1px dotted black",
                            backgroundColor: "white",
                            color: "black",
                            padding: 20,
                          }}
                        />
                        <Close onClick={changeLocationSearcher} />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {loader ? (
                      <div className="searchBar__loader">
                        <Oval color="#00BFFF" height={20} width={20} />
                      </div>
                    ) : (
                      <div className="autoSearchDiv">
                        {autoSearchInput && (
                          <Close
                            style={{ cursor: "pointer" }}
                            onClick={changeAutoSearchInput}
                          />
                        )}
                        <ReactSearchAutocomplete
                          styling={{
                            hoverBackgroundColor: "#22b0ea",
                            zIndex: 9999,
                            backgroundColor: "white",
                          }}
                          items={reducerMyDestinations}
                          autoFocus
                          // onSearch={handleOnSearch}
                          onSelect={destinationSelection}
                          placeholder="Enter Location"
                          formatResult={formatResult}
                          onClear={deleteWayPointItem}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            <button onClick={getTrackValue}>Search Data</button>
          </form>
        </div>
        {!locationInput && (
          <>
            {searchDropDown === 0 ? (
              <div className="toggleButton">
                <Switch {...label} onChange={changeFields} />
                <p className="switchText">Search</p>
              </div>
            ) : (
              <div className="toggleButton">
                <Switch {...label} onChange={changeFields} />
                <p className="switchText">From Destinations</p>
              </div>
            )}
          </>
        )}

        {/* <CalendarToday /> */}

        <div className="locationSearchBar__close">
          {locationLoader ? (
            <Oval color="#00BFFF" height={20} width={20} />
          ) : (
            <IconButton onClick={() => removeArray(data, index)}>
              <DeleteForever color="red" />
            </IconButton>
          )}
        </div>
      </div>
      <div className="lowerSectionLocation">
        <div className="dateDivLocation">
          <h5>Arrival Date</h5>
          <input
            id="standard-basic"
            label="Arrival Date"
            variant="standard"
            type="date"
            onChange={(e) => dateArrivalMilisec(e.target.value)}
          />
          <div className="divUnderLineDate"></div>
        </div>
        <div className="dateDivLocation">
          <h5>Departure Date</h5>
          <input
            value={data.endedTimeInitial}
            id="standard-basic"
            label="Departure Date"
            variant="standard"
            type="date"
            onChange={(e) => dateDepartureMilisec(e.target.value)}
          />
          <div className="divUnderLineDate"></div>
        </div>
      </div>

      <Dialog
        onClose={handleCloseDeleteConfirmation}
        open={openDeleteConfirmation}
      >
        <DialogTitle>Do you want to Edit this?</DialogTitle>
        <List sx={{ pt: 0 }} className="dialogList">
          <ListItem button onClick={() => confirmDelete(data.jwKey)}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#ee378a", color: "#ee378a" }}>
                <Edit style={{ color: "white" }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Edit" style={{ color: "red" }} />
          </ListItem>

          <ListItem button onClick={handleCloseDeleteConfirmation}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#22b0ea", color: "#22b0ea" }}>
                <KeyboardReturn style={{ color: "white" }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Hide" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}

export default LocationSearchBar;
