import React, { useState, useEffect, useRef } from "react";
import "./CalenderScreen.css";
import { Box, Modal, Switch, Tab, Tabs } from "@mui/material";
// import { Box } from "@mui/system";
import DayComponent from "./Day Component/DayComponent";
import WeekComponent from "./Week Component/WeekComponent";
import MonthComponent from "./Month Component/MonthComponent";
import { Oval } from "react-loader-spinner";
import PeopleCards from "../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import InitialCoordMap from "../OLMap React/InitialCoordMap";
import DestinationMap from "../OLMap React/DestinationMap";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {
  Add,
  CalendarToday,
  ChevronLeft,
  Close,
  Edit,
  FmdGood,
} from "@mui/icons-material";
import {
  addBase64File,
  addEventItemAPI,
  createEventAPI,
  getCountryFlags,
  getDocumentByName,
  retrieveLocationDataAPI,
} from "../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../config/context api/StateProvider";
import Cropper from "../Cropper/Cropper";
import Dropdown from "../React Dropdown/Dropdown";
import { useAlert } from "react-alert";
import CollapsibleForPostcard from "../Sidebar Group Buttons/Collapsible Buttons/Collapsible For Postcard/CollapsibleForPostcard";
import MiniMap from "../OLMap React/MiniMap";
import DateTimePicker from "react-datetime-picker";
import { UNAUTH_KEY } from "../../assets/constants/Contants";
import { baseURL } from "../../assets/strings/Strings";
import dummyImage from "../../assets/images/wallpaperDestination.jpg";
import { useHistory } from "react-router-dom";
import ImageUploaderBox from "../Image Uploader Box/ImageUploaderBox";
import Select from "react-select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "90%",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflowY: "auto",
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted black",
    backgroundColor: "white",
    color: "black",
    padding: 20,
  }),
};

function CalenderScreen() {
  const [
    {
      userToken,
      reducerEvent,
      reducerDefaultPictures,
      reducerUserDATA,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const [value, setValue] = useState(1);
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchData, setSearchData] = useState("");
  const [locationLoader, setLocationLoader] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [coord, setCoord] = useState([]);
  const [loading, isLoading] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [connectPeople, setConnectPeople] = useState([]);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [redirectNow, setRedirectNow] = useState(false);
  var date = new Date();
  date.setDate(date.getDate());
  const [startDateVal, setStartDateVal] = useState(date);
  const [endDateVal, setEndDateVal] = useState(date);
  const [newEventArray, setNewEventArray] = useState([]);
  const [isPictureSelected, setPictureSelected] = useState(false);
  const history = useHistory();
  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);
  let [isBlocking, setIsBlocking] = useState(false);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

  const changeStartDateVal = (e) => {
    let now = new Date(e);
    const nextdate = new Date(now.setDate(now.getDate() + 1));

    const d = new Date(e).getTime();
    // let ms = d.getMilliseconds();
    console.log("startDateVal", d);
    // console.log("startDateVal now", ms);

    setStartDateVal(e);
    setEndDateVal(nextdate);
    setEventDetails({
      ...eventDetails,
      startDate: d,
    });
  };

  const [eventDetails, setEventDetails] = useState({
    pk: "",
    name: "",
    description: "",
    startTime: "",
    startDate: date,
    endDate: date,
    duration: "",
    configurations: "",
    searchable: 1,
  });
  const [eventImageDetails, setEventImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [eventCountryInfo, setEventCountryInfo] = useState({
    countrySvg: null,
    countryCode: null,
  });
  const label = { inputProps: { "aria-label": "Switch demo" } };
  // console.log("reducerEvent", reducerEvent);

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
    // the item selected
    // console.log(val);
    // console.log("locationData", locationData);

    const coordVal = [];

    if (val) {
      setLocationLoader(true);
      if (val.lon && val.lat) {
        coordVal.push(val.lon);
        coordVal.push(val.lat);

        setCoord(coordVal);
        setEventDetails({
          ...eventDetails,
          latitude: val.lat,
          longitude: val.lon,
          displayName: val.name,
        });

        setLocationLoader(false);
      }
    }
  };

  const openImageUploaderBox = (v) => {
    if (showImageUploader === false) {
      setShowImageUploader(true);
      // console.log("showImageUploader", showImageUploader);
    } else if (showImageUploader === true) {
      setShowImageUploader(false);
      // console.log("showImageUploader", showImageUploader);
    }
  };

  const uploadImageFromPC = (e) => {
    // console.log("uploadImageFromPC", e);
    inputRef.current.click();
  };

  // useEffect(() => {
  //   if (redirectNow) {
  //     setRedirectNow(false);
  //     dispatch({
  //       type: "SET_EVENT",
  //       reducerEvent: newEventArray,
  //     });
  //     // history.push("/destinations/my-destinations");
  //   }
  // }, [redirectNow]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageOpen = () => setOpenImage(true);
  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  // searchable working here //

  const changeSearchable = () => {
    // console.log(eventDetails.searchable);
    if (eventDetails.searchable === 0 || eventDetails.searchable === -1) {
      setEventDetails({ ...eventDetails, searchable: 1 });
      // console.log("setting value to 1");
    } else {
      setEventDetails({ ...eventDetails, searchable: 0 });
      // console.log("setting value to 0");
    }
    // console.log(eventDetails);
  };
  // searchable working here //

  const formatResult = (item) => {
    // console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const handleOnSearch = (string, results) => {
    // console.log(string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    // console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
  };

  const handleOnSelect = (item) => {
    // the item selected
    // console.log(item);
    // console.log("locationData", locationData);
    setCoord([]);
    const coordVal = [];

    if (item) {
      setLocationLoader(true);
      if (item.lon && item.lat) {
        coordVal.push(item.lon);
        coordVal.push(item.lat);

        setCoord(coordVal);
        setEventDetails({
          ...eventDetails,
          latitude: item.lat,
          longitude: item.lon,
          displayName: item.name,
        });

        setLocationLoader(false);
      }
    }
  };

  const dateArrivalMilisec = (e) => {
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
  };
  const dateDepartureMilisec = (e) => {
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
    setEventDetails({
      ...eventDetails,
      endDate: milliseconds,
    });
  };

  const getTrackValue = (e) => {
    e.preventDefault();
    setLocationLoader(true);
    // console.log("searchData", searchData);

    setLocationData([]);
    if (searchData) {
      retrieveLocationDataAPI(userToken, searchData, reducerVisitorID).then(
        function (val) {
          setLocationSearcher(false);
          setSearchData(null);
          if (val) {
            // console.log("retrieving Track Value", JSON.parse(val.data));
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
              setLocationData((locationData) => [
                ...locationData,
                locationArray,
              ]);
            }

            isLoading(false);
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
          }
        }
      );
    }
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getFlagValues = (e) => {
    // console.log(e.isoTwo);
    setEventCountryInfo({
      ...eventCountryInfo,
      iso2: e.isoTwo,
      countrySvg: e.countryFlag,
    });
    // console.log(eventCountryInfo.iso2);
  };

  const getFlagsData = () => {
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      if (val.data !== null) {
        var info = val.data;
        for (var key in info) {
          // console.log(info[key]);
          const flagDataVal = {
            countryName: info[key].country,
            isoTwo: info[key].iso2,
            dmsKey: info[key].dmsKey,
            countryFlag: info[key].url,
          };
          flagValue.push(flagDataVal);
        }
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        console.log("document is null");
      }
    });
  };

  const imageHandleChange = (event) => {
    // console.log("event in cropper", event);
    if (event.target.files && event.target.files[0]) {
      setMimeType(event.target.files[0].type);
      setImageName(event.target.files[0].name);
      let reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target.result);

        setOpenImageCropper(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setImageName(event.imageName);
  };

  const handleDone = (e) => {
    const base64result = e.substr(e.indexOf(",") + 1);

    setEventImageDetails({ ...eventImageDetails, base64: e });
    setOpenImage(false);
    setPictureSelected(true);
    setShowImageUploader(false);
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };
  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const deleteCardItem = (index) => {
    // console.log("indexVal", index);

    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };

  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
      setConnectPeople([...connectPeople]);

      // newMemberKeys.push(v.entKey);

      // console.log("Member Keys", newMemberKeys);

      // console.log("connectPeople", connectPeople);
    }
  };

  const createEvent = () => {
    // console.log("eventDetails", eventDetails);
    if (
      eventDetails.description &&
      eventDetails.title &&
      eventDetails.displayName
    ) {
      if (eventDetails.endDate > eventDetails.startDate) {
        callUploadEventPictureAPI();
      } else {
        alert.show("Event End Date Invalid");
        // console.log("Event End Date Invalid");
      }
    } else {
      alert.show("Please fill the required fields");
    }
  };

  const callUploadEventPictureAPI = () => {
    isLoading(true);

    if (isPictureSelected) {
      uploadEventPicture();
    } else {
      callCreateEventAPI(eventImageDetails.base64DocumentID);
    }
  };

  const uploadEventPicture = () => {
    const base64result = eventImageDetails.base64.substr(
      eventImageDetails.base64.indexOf(",") + 1
    );

    // console.log("Calling an API");
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: imageName,
      documentName: mimeType + "/" + imageName,
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: base64result,
      versioning: 0,
    });
    // console.log("Params", params);

    addBase64File(userToken, params, reducerVisitorID).then(function (val) {
      console.log(val.data);
      if (val.data.documentID != null) {
        let item = {
          date: Date.now(),
          documentId: val.data.documentId,
          image: eventImageDetails.base64,
          isLoaded: true,
        };
        if (memoryImagesTwo === undefined || memoryImagesTwo.length === 0) {
          setMemoryImagesTwo([item]);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: [item],
          });
        } else {
          memoryImagesTwo.push(item);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: memoryImagesTwo,
          });
        }
        callCreateEventAPI(val.data.documentID);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        alert.show("Event creation failed");
      }
    });
  };

  const callCreateEventAPI = (documentID) => {
    let durationTime = endDateVal / 1000 - startDateVal / 1000;
    const config = JSON.stringify({
      countryCode: eventCountryInfo.iso2,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: 0,
      name: eventDetails.title,
      description: eventDetails.description,
      calendarType: "{}",
      startTime: eventDetails.startDate / 1000,
      duration: durationTime,
      latitude: eventDetails.latitude,
      longitude: eventDetails.longitude,
      mapZoom: 12,
      searchable: eventDetails.searchable,
      acl: 7429,
      calendarTag: "{}",
      configurations: config,
      groupType: 16,
    });
    console.log("Params", params);

    createEventAPI(userToken, params, reducerVisitorID).then(function (val) {
      const valData = val.data;
      // console.log("valData", valData);
      setEventDetails({
        ...eventDetails,
        title: "",
        description: "",
        base64: null,
        searchable: 0,
        startDate: null,
        endDate: null,
      });
      isLoading(false);

      if (val.data.caeKey !== null || val.data.caeKey !== "") {
        getFlagURL(valData.caeKey, eventCountryInfo.iso2, config, durationTime);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const uploadConnections = (key) => {
    for (var i = 0; i < connectPeople.length; i++) {
      // console.log("ent Key", connectPeople[i].entKey);
      // console.log("ug Key", key);
      const params = JSON.stringify({
        entKey: connectPeople[i].entKey,
        ugKey: key,
        message: "Bob has invited you",
      });
      // console.log("parameter", params);

      addEventItemAPI(params, userToken, reducerVisitorID).then(function (val) {
        if (val) {
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
        // console.log("member Added", val.data);
      });
    }
    handleClose();
    history.push("/home");
    alert.show("Event created successfully");
    // console.log("event created with member added");
  };

  const getFlagURL = (caeKey, data, config, durationTime) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      //console.log("flagURL Info", val.data);
      if (val.data != null) {
        let mimeType = "image/svg+xml";
        let svgValue = `data:${mimeType};base64,${val.data}`;

        var startTime = new Date(eventDetails.startDate).toISOString();
        var endTime = new Date(eventDetails.endDate).toISOString();
        // var endTimeMS = info[key].startTime + info[key].duration;

        let obj = {
          pk: caeKey,
          title: eventDetails.title,
          description: eventDetails.description,
          searchable: eventDetails.searchable,
          configurations: config,
          latitude: eventDetails.latitude,
          longitude: eventDetails.longitude,
          displayName: eventDetails.displayName,
          base64: eventImageDetails.base64,
          countrySvg: svgValue,
          mapZoom: 12,
          startDate: startTime,
          endDate: endTime,
          duration: durationTime,
        };

        newEventArray.push(obj);
        dispatch({
          type: "SET_EVENT",
          reducerEvent: newEventArray,
        });

        // console.log("Event Created", val.data);
        // console.log("connectPeople.length", connectPeople.length);
        if (connectPeople.length === 0) {
          handleClose();
          history.push("/home");
          alert.show("Event created successfully");
          console.log("only event created without member added");
        } else {
          // setRedirectNow(true);
          uploadConnections(caeKey);
        }
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });

    // console.log("countryFlag", countryFlag);
  };

  useEffect(() => {
    const d = new Date(eventDetails.startDate);

    let ms = d.getMilliseconds();
    console.log("eventDetails date ", eventDetails.startDate);
    console.log("eventDetails d ", d);
    console.log("eventDetails ms ", ms);
  }, [startDateVal]);

  useEffect(() => {
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[2]);

      setEventImageDetails({
        ...eventImageDetails,
        base64: reducerDefaultPictures[5].base64Value,
        base64DocumentID: reducerDefaultPictures[5].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    if (reducerUserDATA) {
      // console.log("Flag: ", reducerUserDATA);
      // console.log("Flag useEffect triggered");

      setEventCountryInfo({
        ...eventCountryInfo,
        countrySvg: reducerUserDATA.countrySvg,
        iso2: reducerUserDATA.countryCode,
      });
    }
  }, [reducerUserDATA]);

  useEffect(() => {
    var milliseconds = startDateVal.getTime();
    setEventDetails({ ...eventDetails, startDate: milliseconds });
  }, [startDateVal]);
  useEffect(() => {
    var milliseconds = endDateVal.getTime();
    setEventDetails({ ...eventDetails, endDate: milliseconds });
  }, [endDateVal]);

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  useEffect(() => {
    if (reducerEvent) {
      console.log("reducerEvent", reducerEvent);
      setNewEventArray(reducerEvent);
    }
  }, [reducerEvent]);

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />;
      </div>
    );
  }

  return (
    <>
      <div className="calenderScreen">
        <div className="calenderScreen__headingSection">
          <h3 className="calenderScreen__heading">Calendar</h3>
          <button className="primaryButton" onClick={handleOpen}>
            Add Event
          </button>
        </div>
        <div className="calenderScreen__containerTop">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="secondary tabs example"
            >
              <Tab className="tabButton" value={1} label="Day" />
              <Tab className="tabButton" value={2} label="Week" />
              <Tab className="tabButton" value={3} label="Month" />
            </Tabs>
          </Box>
        </div>

        <div className="calenderScreen__containerMain">
          {(value === 1 && <DayComponent events={reducerEvent} />) ||
            (value === 2 && <WeekComponent events={reducerEvent} />) ||
            (value === 3 && <MonthComponent events={reducerEvent} />)}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="addEvent__container">
            <div className="addEventcontainer__top">
              <div className="container__topLeft">
                <ChevronLeft onClick={handleClose} />
                <h3>Add Event</h3>
              </div>
              <div className="addEventContainer__topRight">
                {eventDetails.searchable === 0 ? (
                  <div className="switchButton">
                    <h5>Private</h5>
                    <Switch {...label} onChange={changeSearchable} />
                  </div>
                ) : (
                  <div className="switchButton">
                    <h5>Public</h5>

                    <Switch
                      {...label}
                      defaultChecked
                      onChange={changeSearchable}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* /***** First Container Ends Here  *******/}
            {/* /***** Second Container Starts Here  *******/}
            <div className="container__topSearch">
              <div className="container__topSearchBio">
                <div className="topSearchLeft">
                  <div className="destinationTitle">
                    <h5 className="inputTitle">Event Title</h5>
                    <div className="inputDiv">
                      <input
                        type="text"
                        placeholder="Enter Title"
                        value={eventDetails.title}
                        onChange={(e) =>
                          setEventDetails({
                            ...eventDetails,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="destinationTitleDescription">
                    <h5 className="inputTitle">Event Description</h5>
                    <div className="inputDivDetail">
                      <textarea
                        type="text"
                        placeholder="Enter Descripton"
                        value={eventDetails.description}
                        onChange={(e) =>
                          setEventDetails({
                            ...eventDetails,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="topSearch__right">
                  <div className="uploadImageSection">
                    <div class="uploadImageButton">
                      {/* <label> */}
                      <Edit onClick={openImageUploaderBox} />
                      <input
                        // id="file-input"
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="input-file"
                        style={{ display: "none" }}
                        onChange={imageHandleChange}
                      />
                      {/* </label> */}
                    </div>

                    <img
                      style={{
                        width: 130,
                        height: 130,
                        borderRadius: 10,
                        objectFit: "cover",
                      }}
                      alt=""
                      src={eventImageDetails.base64}
                      onClick={eventImageDetails.base64 && handleImageOpen}
                    />
                  </div>

                  <Modal
                    open={openImage}
                    onClose={handleImageClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      {/* <SimpleDialogBox onItemClick={onItemClick} dataValue={data} / > */}
                      <img
                        style={{ borderRadius: "12px" }}
                        src={photoUrl}
                        alt=""
                        width="500"
                        height="500"
                        // onClick={handleImageOpen}
                        controls
                      />
                    </Box>
                  </Modal>

                  <Modal
                    className="groupCropperModal"
                    open={openImageCropper}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Cropper
                      inputImg={photoUrl}
                      // onClose={handleClose}
                      onClose={handleCropperClose}
                      onDone={handleDone}
                      mimeType={mimeType}
                    />
                  </Modal>

                  <div className="groupMid__countries">
                    <div className="groupMid__fieldInputs">
                      {countrydropdownMenu || !eventCountryInfo.countrySvg ? (
                        <div className="groupMid__flagDiv">
                          <Dropdown
                            name="location"
                            title="Select location"
                            searchable={[
                              "Search for location",
                              "No matching location",
                            ]}
                            list={flagValue}
                            onChange={getFlagValues}
                          />
                        </div>
                      ) : (
                        <div className="selectedGroup__flag">
                          <img
                            className="groupCountryFlagSvg"
                            src={eventCountryInfo.countrySvg}
                            alt=""
                            onClick={CountryDropdown}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="addEventTopSearch">
                <div className="inputDivBox">
                  <form>
                    <div className="upperSection">
                      <div className="upperSection__searchDiv">
                        {locationData.length === 0 || locationSearcher ? (
                          <ReactSearchAutocomplete
                            styling={{
                              hoverBackgroundColor: "#22b0ea",
                              zIndex: 99,
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
                              styles={customStyles}
                            />
                            <Close onClick={changeLocationSearcher} />
                          </>
                        )}
                      </div>
                      {locationLoader ? (
                        <Oval color="#00BFFF" height={20} width={20} />
                      ) : (
                        <FmdGood />
                      )}
                    </div>

                    <div className="lowerSection">
                      <div className="dateDiv">
                        <h5>Start Date</h5>

                        <DateTimePicker
                          onChange={changeStartDateVal}
                          value={startDateVal}
                        />
                        <div className="divUnderLineDateLarge"></div>
                      </div>
                      <div className="dateDiv">
                        <h5>End Date</h5>

                        <DateTimePicker
                          onChange={setEndDateVal}
                          value={endDateVal}
                        />
                        <div className="divUnderLineDateLarge"></div>
                      </div>

                      {/* <CalendarToday /> */}
                    </div>
                    <button onClick={getTrackValue}>Submit</button>
                  </form>
                </div>
              </div>
            </div>
            {/* <SearchDestinationSection getValue={getValue}/> */}
            {/* /***** Second Container Ends Here  *******/}
            {/* /***** Third Container Starts Here  *******/}

            <div className="createEvent__map">
              {/* {coord.length >= 1 ? (
                <DestinationMap coord={coord} />
              ) : (
                // <DestinationMap coords={initialCoord} />
                <InitialCoordMap />
              )} */}
              <div className="mapSideBox">
                {coord.length >= 1 ? (
                  <DestinationMap coord={coord} />
                ) : (
                  // <DestinationMap coords={initialCoord} />
                  <InitialCoordMap />
                )}
              </div>

              {/* <OLMapReact /> */}
            </div>

            {/* /***** Third Container Ends Here  *******/}

            {/* /***** FIfth Container Starts Here  *******/}
            <div className="container__items">
              <div className="container__connections">
                <h5>Connections</h5>
                {/* <ConnectionsSection /> */}
                {connectPeople.length <= 0 ? (
                  <p className="addDetails__heading">Please Add Members </p>
                ) : (
                  <div className="groupSec__cards">
                    {connectPeople.map((v, i) => (
                      <PeopleCards
                        key={v + i}
                        index={i}
                        data={v}
                        deleteItem
                        clickFunction={deleteCardItem}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* /***** Fifth Container Ends Here  *******/}

              <div className="addEvent__actionButtons">
                {collapsibleButton ? (
                  <CollapsibleForPostcard
                    getConnection={getConnection}
                    handleTriggerClose={handleTriggerClose}
                  />
                ) : (
                  <div className="viewPostcard__bottom">
                    <div className="svg__Icon">
                      <Add onClick={handleTriggerOpen} />
                    </div>

                    <div className="emptyDiv"></div>
                  </div>
                )}
                <div className="viewPostcard__updateButton">
                  <button className="megaButton" onClick={createEvent}>
                    Add Event
                  </button>
                </div>
                <div className="viewPostcard__bottom"></div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Event Picture"
          showImageUploader={showImageUploader}
          setShowImageUploader={setShowImageUploader}
          inputRef={inputRef}
          handleDone={handleDone}
          uploadImageFromPC={uploadImageFromPC}
          getImageData={getImageData}
        />
      )}
    </>
  );
}

export default CalenderScreen;
