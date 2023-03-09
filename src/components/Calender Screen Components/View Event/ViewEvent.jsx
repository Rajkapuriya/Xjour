import {
  Add,
  CalendarToday,
  ChevronLeft,
  Close,
  Edit,
  FmdGood,
} from "@mui/icons-material";
import { Box, Modal, Switch } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import PeopleCards from "../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import Cropper from "../../Cropper/Cropper";
import DestinationMap from "../../OLMap React/DestinationMap";
import InitialCoordMap from "../../OLMap React/InitialCoordMap";
import Dropdown from "../../React Dropdown/Dropdown";
import CollapsibleForPostcard from "../../Sidebar Group Buttons/Collapsible Buttons/Collapsible For Postcard/CollapsibleForPostcard";
import "./ViewEvent.css";
import DateTimePicker from "react-datetime-picker";
import { useStateValue } from "../../../config/context api/StateProvider";
import { useAlert } from "react-alert";
import {
  addBase64File,
  addEventItemAPI,
  deleteEventItemAPI,
  getCountryFlags,
  getDocumentByName,
  getPrivateDocument,
  readSingleUserAPI,
  retrieveLocationDataAPI,
  retrieveSingleEventAPI,
  updateEventAPI,
  updateEventTimeAPI,
} from "../../../config/authentication/AuthenticationApi";
import { useHistory } from "react-router";
import { Oval } from "react-loader-spinner";
import {
  UNAUTH_KEY,
  user_contactGroupKey,
} from "../../../assets/constants/Contants";
import { baseURL } from "../../../assets/strings/Strings";
import ImageUploaderBox from "../../Image Uploader Box/ImageUploaderBox";
import DeleteOrHideDialogue from "../../Delete Or Hide Dialogue/DeleteOrHideDialogue";
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

function ViewEvent({ eventValue, closeModal }) {
  const [
    {
      userToken,
      reducerEvent,
      reducerVisitorID,
      reducerMemoryImages,
      reducerDefaultPictures,
      reducerUserDATA,
    },
    dispatch,
  ] = useStateValue();
  const [startDateVal, setStartDateVal] = useState(
    new Date(eventValue.startDate)
  );
  const [endDateVal, setEndDateVal] = useState(new Date(eventValue.endDate));
  const alert = useAlert();

  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

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
  const [eventDetails, setEventDetails] = useState([]);
  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [APIResponse, setAPIResponse] = useState([]);
  const [connections, setConnections] = useState([]);
  const history = useHistory();
  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  const [groupFlag, setGroupFlag] = useState(null);
  var url = "";
  const [eventImageData, setEventImageData] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });
  let [isBlocking, setIsBlocking] = useState(false);
  const [locationSearcher, setLocationSearcher] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const changeStartDateVal = (e) => {
    let now = new Date(e);
    const nextdate = new Date(now.setDate(now.getDate() + 1));

    setStartDateVal(e);
    setEndDateVal(nextdate);
  };

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

  const deleteEvent = () => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  const uploadImageFromPC = (e) => {
    // console.log("uploadImageFromPC", e);
    inputRef.current.click();
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };
  // console.log("eventValue in viewEvent", eventValue);
  // console.log("eventValue startDateVal", startDateVal);
  // console.log("eventValue endDateVal", endDateVal);

  // console.log("coordVal", coord);

  var startMS = startDateVal.getTime();
  // console.log("startMS", startMS);

  var indexVal = reducerEvent.findIndex((x) => x.pk === eventValue.pk);
  // console.log("indexVal", indexVal);

  useEffect(() => {
    if (endDateVal !== null || endDateVal !== "") {
      let isoStartDate = endDateVal.toISOString();
      // console.log("eventValue endDateVal", isoStartDate);
      setEventDetails({ ...eventDetails, endDate: isoStartDate });
    }
  }, [endDateVal]);

  useEffect(() => {
    if (startDateVal !== null || startDateVal !== "") {
      let isoEndDate = startDateVal.toISOString();
      // console.log("eventValue endDateVal", isoEndDate);
      setEventDetails({ ...eventDetails, startDate: isoEndDate });
    }
  }, [startDateVal]);

  useEffect(() => {
    const coordVal = [];
    if (eventValue) {
      // setLocationLoader(true);
      if (eventValue.longitude && eventValue.latitude) {
        coordVal.push(eventValue.longitude);
        coordVal.push(eventValue.latitude);
        setCoord(coordVal);
      }
    }
    // console.log("coord", coord);
  }, [eventValue]);

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getFlagValues = (e) => {
    // console.log(e.isoTwo);
    url = e.countryFlag;
    setGroupFlag(baseURL + url);
    setEventDetails({
      ...eventDetails,
      countryCode: e.isoTwo,
      countrySvg: e.countryFlag,
    });
    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });

    // console.log(eventDetails.iso2);
  };

  const getFlagsData = () => {
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      if (val) {
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
        } else {
          console.log("document is null");
        }
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
    getFlagsData();
  }, [flagValue]);

  const imageHandleChange = (event) => {
    console.log("event in cropper", event);
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

    setEventDetails({ ...eventDetails, base64: e, base64Result: base64result });
    setEventImageData({ ...eventImageData, base64: e });

    setGroupCodes({ ...groupCodes, base64Result: base64result });

    setOpenImage(false);
    setShowImageUploader(false);
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };
  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  // const deleteCardItem = (index) => {
  //   console.log("indexVal", index);

  //   connectPeople.splice(index, 1);
  //   setConnectPeople([...connectPeople]);
  // };

  const deleteCardItem = (data, index) => {
    console.log("data", index);

    deleteEventItemAPI(
      userToken,
      data.entKey,
      data.groupItemsKey,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        isLoading(true);
        console.log("delete API response >>", val.data);
        isLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
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

    connections.splice(index, 1);
    setConnections([...connections]);
  };

  const getConnection = (v, i) => {
    console.log("vData", v, i);
    var index = connections.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connections.push(v);
      connectionUpdatedItem.push(v.entKey);

      setConnections([...connections]);

      // newMemberKeys.push(v.entKey);

      // console.log("Member Keys", newMemberKeys);

      console.log("connections", connections);
    }
  };

  const handleImageOpen = () => setOpenImage(true);
  const handleImageClose = (e) => {
    console.log(e);
    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    console.log(e);
    setOpenImageCropper(false);
  };

  // searchable working here //

  const changeSearchable = () => {
    console.log(eventDetails.searchable);
    if (eventDetails.searchable === 0 || eventDetails.searchable === -1) {
      setEventDetails({ ...eventDetails, searchable: 1 });
      console.log("setting value to 1");
    } else {
      setEventDetails({ ...eventDetails, searchable: 0 });
      console.log("setting value to 0");
    }
    console.log(eventDetails);
  };
  // searchable working here //

  const getTrackValue = (e) => {
    e.preventDefault();
    setLocationLoader(true);
    console.log("searchData", searchData);

    setLocationData([]);
    if (searchData) {
      retrieveLocationDataAPI(userToken, searchData, reducerVisitorID).then(
        function (val) {
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
              console.log("Index:" + i);
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
            console.log("locationData", locationData);
          } else if (val.status === UNAUTH_KEY) {
            console.log("Setting to 0");
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

  const formatResult = (item) => {
    console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const handleOnSearch = (string, results) => {
    console.log(string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
    console.log("locationData", locationData);
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

  const callUpdateEventApi = (documentID) => {
    console.log("groups:", eventDetails);
    let startDate = new Date(startDateVal);
    let startedMilliseconds = startDate.getTime();

    let endDate = new Date(endDateVal);
    let endMilliseconds = endDate.getTime();

    let duration = endMilliseconds - startedMilliseconds;

    const config = JSON.stringify({
      countryCode: groupCodes.countryCode,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: eventDetails.pk,
      name: eventDetails.title,
      description: eventDetails.description,

      searchable: eventDetails.searchable,
      calendarType: "{}",
      calendarTag: "{}",
      latitude: eventDetails.latitude,
      longitude: eventDetails.longitude,
      mapZoom: 12,
      configurations: config,
      groupType: 16,
    });
    console.log("Params", params);

    updateEventAPI(params, userToken, reducerVisitorID).then(function (val) {
      isLoading(false);

      if (val) {
        // alert.show("Event updated successfully");
        console.log(val.data);

        updateEventTime();
        console.log("reducerEvent", reducerEvent);

        var index = reducerEvent.findIndex((x) => x.pk === eventValue.pk);

        let eventArray = reducerEvent;
        let item = { ...eventArray[index] };

        item.pk = eventDetails.pk;
        item.title = eventDetails.title;
        item.description = eventDetails.description;
        item.searchable = eventDetails.searchable;
        // item.base64 = photoUrl;
        item.base64 = eventImageData.base64;
        item.countrySvg = groupFlag;
        item.latitude = eventDetails.latitude;
        item.longitude = eventDetails.longitude;
        item.countryCode = eventDetails.countryCode;
        item.startDate = eventDetails.startDate;
        item.endDate = eventDetails.endDate;
        item.duration = eventDetails.duration;
        item.pictureDocumentID = eventDetails.pictureDocumentID;

        eventArray[index] = item;

        console.log("eventArray", eventArray);
        dispatch({
          type: "SET_EVENT",
          reducerEvent: eventArray,
        });

        history.push("/home");
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
  const updateEventTime = () => {
    let startDate = new Date(startDateVal);
    let startedMilliseconds = startDate.getTime();

    let endDate = new Date(endDateVal);
    let endMilliseconds = endDate.getTime();

    let duration = endMilliseconds / 1000 - startedMilliseconds / 1000;

    // let durationTime =
    //   eventDetails.endDate / 1000 - eventDetails.startDate / 1000;
    const params = JSON.stringify({
      startTime: startedMilliseconds / 1000,
      duration: duration,
      groupKey: eventDetails.pk,
    });
    console.log("Params", params);

    updateEventTimeAPI(params, userToken, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        isLoading(false);

        alert.show("Event updated successfully");
        console.log(val.data);
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
    history.push("/calender");
    uploadUpdatedConnection();
  };

  const updateEvent = () => {
    console.log("eventDetails", eventDetails);
    if (endDateVal > startDateVal) {
      if (groupCodes.base64Result != null) {
        isLoading(true);

        const params = JSON.stringify({
          pk: 0,
          acl: 7429,
          fileName: imageName,
          documentName: mimeType + "/" + imageName,
          mimeType: mimeType,
          timestampDocument: Date.now(),
          dataBase64: groupCodes.base64Result,
          versioning: 0,
        });
        // console.log("Params", params);

        addBase64File(userToken, params, reducerVisitorID).then(function (val) {
          if (val) {
            console.log("Updating Event Img", val.data);
            if (val.data != null) {
              let item = {
                date: Date.now(),
                documentId: val.data.documentId,
                image: eventDetails.base64,
                isLoaded: true,
              };
              if (
                memoryImagesTwo === undefined ||
                memoryImagesTwo.length === 0
              ) {
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
              callUpdateEventApi(val.data.documentID);
            } else {
              alert.show("Event update failed");
              isLoading(false);
            }
          } else if (val.status === UNAUTH_KEY) {
            console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        });
      } else {
        callUpdateEventApi(groupCodes.pictureDocumentID);
      }
    } else {
      alert.show("Event End Date Invalid");
      console.log("Event End Date Invalid");
    }
  };

  const uploadUpdatedConnection = () => {
    console.log("connectionUpdatedItem", connectionUpdatedItem);
    for (var i = 0; i < connectionUpdatedItem.length; i++) {
      console.log("connectionUpdatedItem", connectionUpdatedItem[i]);
      const params = JSON.stringify({
        entKey: connectionUpdatedItem[i],
        ugKey: eventValue.pk,
        message: "Bob has invited you",
      });
      console.log("parameter", params);
      addEventitem(params);
    }
  };

  const addEventitem = (params) => {
    addEventItemAPI(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        isLoading(false);

        console.log("event Members API ", val.data);
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

  const getFlagURL = (data, index, status) => {
    // console.log('Flagid',id);

    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("flagURL Info", val.data);
        if (val.data !== null) {
          var mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;
          if (status === 2) {
            setGroupFlag(svgValue);
            console.log("svgValue API CALL", svgValue);
          } else if (status === 3) {
            let connectionItem = connections;
            let item = { ...connectionItem[index] };

            item.countrySvg = svgValue;
            connectionItem[index] = item;
            setConnections(connectionItem.slice());
          }
        }
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

  const getImageByDocumentId = (id, index, status) => {
    console.log("Calling image API for ID:", id);
    getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("this is Image val", val);
        // setMemoryImages([]);

        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          let srcValue = `data:image/jpg;base64, ${imageFile}`;

          if (status === 0) {
            console.log("destinationDetails base64", srcValue);
            setEventImageData({
              ...eventImageData,
              base64: srcValue,
            });
          } else if (status === 2) {
            //setGroupBase64(srcValue);
          } else if (status === 3) {
            let connectionItem = connections;
            let item = { ...connectionItem[index] };

            item.base64 = srcValue;
            item.isLoaded = true;

            connectionItem[index] = item;

            setConnections(connectionItem.slice());
            console.log("connectionItem", connectionItem);
            // dispatch({
            //   type: "SET_GROUP_PEOPLE",
            //   reducerGroupPeople: connections,
            // });
          }
        } else {
          console.log("document is null");
        }
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

  const getEventData = () => {
    console.log("Calling Event API", eventValue);
    console.log("userToken", userToken);
    retrieveSingleEventAPI(userToken, eventValue.pk, reducerVisitorID).then(
      function (val) {
        if (val) {
          // console.log("singleEventData", val.data);

          // setDestinationAPIData(val.data);
          const APIData = val.data;
          if (APIData) {
            setAPIResponse(APIData);
            setInitialLoading(false);
            if (val.data.pk === 0) {
              setEventImageData({
                ...eventImageData,
                base64: reducerDefaultPictures[5].base64Value,
                base64DocumentID: reducerDefaultPictures[5].documentID,
              });
              setGroupFlag(reducerUserDATA.countrySvg);
            } else if (val.data.configurations) {
              var configurations = JSON.parse(val.data.configurations);

              console.log("configurations", configurations);
              setGroupCodes({
                countryCode: configurations?.countryCode,
                pictureDocumentID: configurations?.pictureDocumentID,
              });
              if (
                configurations.countryCode &&
                configurations.pictureDocumentID
              ) {
                const eventDataVal = {
                  countryCode: configurations.countryCode,
                  documentID: configurations.pictureDocumentID,
                };

                // console.log("eventDataVal", eventDataVal);
                getFlagURL(eventDataVal.countryCode, 0, 2);
                console.log("callingapiforflag", eventDataVal.countryCode);
                if (eventDataVal.documentID != null) {
                  getImageByDocumentId(eventDataVal.documentID, 0, 0);
                  console.log("callingapiforimage", eventDataVal.documentID);
                }
              }

              var connectionKeys = JSON.parse(val.data.connections);

              console.log(
                connectionKeys,
                "Connection Keys Array Selected Group"
              );

              for (var key in connectionKeys) {
                const connectionValue = {
                  entKey: connectionKeys[key].entKey,
                  groupItemsKey: connectionKeys[key].ugmKey,
                  index: connections.length,
                  base64: null,
                  isLoaded: false,
                  countrySvg: null,
                  firstName: null,
                  lastName: null,
                };
                connections.push(connectionValue);

                getSingleConnectionValue(
                  connectionKeys[key].entKey,
                  connections.length - 1
                );
              }
            }
          }
        } else if (val.status === UNAUTH_KEY) {
          console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
    );
  };

  const getSingleConnectionValue = (key, index) => {
    readSingleUserAPI(userToken, key, reducerVisitorID).then(function (val) {
      console.log("ConnectionUserValue", val.data);
      if (val) {
        if (val.data.firstName != null) {
          console.log("ConnectionUserValue", val.data);

          let connectionitem = connections;
          let item = { ...connectionitem[index] };
          item.firstName = val.data?.firstName;
          item.lastName = val.data?.lastName;
          connectionitem[index] = item;
          setConnections(connectionitem.slice());
          // dispatch({
          //   type: "SET_GROUP_PEOPLE",
          //   reducerGroupPeople: connections,
          // });
          if (
            val.data.avatar_dms_key !== null ||
            val.data.avatar_dms_key !== ""
          ) {
            getImageByDocumentId(val.data.avatar_dms_key, index, 3);
          }
          if (val.data.countryCode) {
            getFlagURL(val.data.countryCode, index, 3);
          }
        }
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
    // console.log("Connections", connections);

    if (!firstLoad) {
      console.log("Getting Event Data!");
      setFirstLoad(true);
      setInitialLoading(true);
      getEventData();
    }
  }, [firstLoad]);

  useEffect(() => {
    if (eventValue) {
      setEventDetails(eventValue);
    }
  }, [eventValue]);

  if (initialLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }
  return (
    <div className="addEvent__container">
      <div className="addEventcontainer__top">
        <div className="container__topLeft">
          <ChevronLeft onClick={closeModal} />
          <h3>Update Event</h3>
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

              <Switch {...label} defaultChecked onChange={changeSearchable} />
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
              {eventImageData.base64 && (
                <div class="uploadImageButton">
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
                </div>
              )}

              {!eventImageData.base64 ? (
                <Oval color="#00BFFF" height={20} width={20} />
              ) : (
                <img
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 10,
                    objectFit: "cover",
                  }}
                  src={eventImageData.base64}
                  alt=""
                  onClick={eventImageData.base64 && handleImageOpen}
                />
              )}
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
                  src={eventImageData.base64}
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
              {!groupFlag ? (
                <Oval color="#00BFFF" height={20} width={20} />
              ) : (
                <div className="groupMid__flagDiv">
                  {countrydropdownMenu || !groupFlag ? (
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
                      {eventDetails.countrySvg && (
                        <Close
                          onClick={CountryDropdown}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="selectedGroup__flag">
                      <img
                        className="groupCountryFlagSvg"
                        src={groupFlag}
                        alt=""
                        onClick={CountryDropdown}
                      />
                    </div>
                  )}
                </div>
              )}
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
                  <div className="divUnderLineDate"></div>
                </div>
                <div className="dateDiv">
                  <h5>End Date</h5>

                  <DateTimePicker onChange={setEndDateVal} value={endDateVal} />
                  <div className="divUnderLineDate"></div>
                </div>

                <CalendarToday />
              </div>
              <button onClick={getTrackValue}>Submit</button>
            </form>
          </div>
        </div>
      </div>

      <div className="createEvent__map">
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
          {connections.length <= 0 ? (
            <p className="addDetails__heading">Please Add Members </p>
          ) : (
            <div className="groupSec__cards">
              {connections.map((v, i) => (
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
            <button className="megaButton" onClick={updateEvent}>
              Update Event
            </button>
          </div>
          <div className="svg__IconRight">
            <Close onClick={() => deleteEvent()} />
          </div>
        </div>
      </div>

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={eventValue.pk}
          state="event"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}

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
    </div>
  );
}

export default ViewEvent;
