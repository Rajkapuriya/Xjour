import {
  Add,
  ChevronLeft,
  Close,
  CompareArrows,
  Edit,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import Switch from "@mui/material/Switch";
import { Box, Modal } from "@mui/material";
import PeopleCards from "../../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import { Prompt } from "react-router-dom";
import {
  addBase64File,
  addJourneyItemAPI,
  addWayPointItemAPI,
  deleteJourneyItemAPI,
  deleteWayPointItemAPI,
  getCountryFlags,
  getDocumentByName,
  getPrivateDocument,
  readSingleActivityAPI,
  readSingleUserAPI,
  retrieveLocationDataAPI,
  retrieveSingleDestinationAPI,
  retrieveSingleJourneyAPI,
  routingForMapsAPI,
  updateJourneyAPI,
} from "../../../../config/authentication/AuthenticationApi";
import "./ViewJourney.css";
import { useStateValue } from "../../../../config/context api/StateProvider";
import Cropper from "../../../Cropper/Cropper";
import Dropdown from "../../../React Dropdown/Dropdown";
import MiniActivitiesCard from "../../My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import MediaGallery from "../../../Sidebar Group Buttons/Media Gallery/MediaGallery";
import CollapsibleButtons from "../../../Sidebar Group Buttons/Collapsible Buttons/CollapsibleButtons";
import { Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import { useHistory } from "react-router";
import MiniDestinationCard from "../../My Destinations/Mini Destination Card/MiniDestinationCard";
import { useAlert } from "react-alert";
import {
  activityGroupKey,
  destinationGroupKey,
  memoryGroupKey,
  user_contactGroupKey,
  UNAUTH_KEY,
} from "../../../../assets/constants/Contants";

import { baseURL } from "../../../../assets/strings/Strings";

import DeleteOrHideDialogue from "../../../Delete Or Hide Dialogue/DeleteOrHideDialogue";
import InitialCoordMap from "../../../OLMap React/InitialCoordMap";
import JourneyMap from "../../../OLMap React/JourneyMap";
import LocationSearchBar from "../Create Journey/Location SearchBar/LocationSearchBar";
import ImageUploaderBox from "../../../Image Uploader Box/ImageUploaderBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};
const Editor = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["image", "blockqoute", "code-block"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      ["clean"], // remove formatting button
    ],
  },
};

function ViewJourney() {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [
    {
      userToken,
      reducerSelectedJourney,
      reducerJournies,
      reducerUserDATA,
      reducerDefaultPictures,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);

  const [locations, setLocations] = useState([
    {
      dstKey: 0,
      jwKey: 0,
      latitude: 0,
      longitude: 0,
      name: null,
      orderPosition: 0,
    },
    {
      dstKey: 0,
      jwKey: 0,
      latitude: 0,
      longitude: 0,
      name: null,
      orderPosition: 1,
    },
  ]);

  const [journeyDetails, setJourneyDetails] = useState(reducerSelectedJourney);
  const [journeyBase64Data, setJourneyBase64Data] = useState({ base64: null });
  const [searchData, setSearchData] = useState("");
  const [updatedValue, setUpdatedValue] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [locationLoader, setLocationLoader] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [connectPeople, setConnectPeople] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [mediaComponent, setMediaComponent] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [initialWayPointLoader, setInitialWayPointLoader] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [quillValue, setQuillValue] = useState("");
  const [groupFlag, setGroupFlag] = useState(null);
  const alert = useAlert();
  const history = useHistory();
  const [coord, setCoord] = useState([]);
  const [centerVal, setCenterVal] = useState([]);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
  const [connections, setConnections] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);
  var iso2 = "";
  var url = "";
  // const [destinationAPIData, setDestinationAPIData] = useState([]);

  const [mediaUpdatedItem, setMediaUpdateItem] = useState([]);
  const [activityUpdatedItem, setActivityUpdatedItem] = useState([]);
  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [destinationUpdatedItem, setDestinationUpdatedItem] = useState([]);
  const [wayPointUpdatedItem, setWayPointUpdatedItem] = useState([]);

  const [routeWayPoint, setRouteWaypoints] = useState([]);

  const [APIResponse, setAPIResponse] = useState([]);
  let [waypointlength, setWaypointlength] = useState(0);
  let [isBlocking, setIsBlocking] = useState(false);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  const [selectedActivitiesArrayData, setSelectedActivitiesArrayData] =
    useState([]);

  // console.log("coordVal", coord);

  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });
  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  // console.log("reducerSelectedJourney", reducerSelectedJourney);

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

  // let defaultDateArrival = new Date(reducerSelectedJourney.arrivalDate);
  // defaultDateArrival.setDate(defaultDateArrival.getDate() + 3);
  let defaultDateArrival = new Date(Date.now());
  defaultDateArrival.setDate(defaultDateArrival.getDate() + 3);

  const [dateArrivalDefault, setDateArrivalDefault] =
    useState(defaultDateArrival);

  // let defaultDateDeparture = new Date(reducerSelectedJourney.departureDate);
  // defaultDateDeparture.setDate(defaultDateDeparture.getDate() + 3);
  let defaultDateDeparture = new Date(Date.now());
  defaultDateDeparture.setDate(defaultDateDeparture.getDate() + 3);

  const [dateDepartureDefault, setDateDepartureDefault] =
    useState(defaultDateDeparture);

  const onSetDateArrival = (event) => {
    setIsBlocking(true);
    setDateArrivalDefault(new Date(event.target.value));
    var date = new Date(event.target.value); // some mock date
    var milliseconds = date.getTime();
    setJourneyDetails({ ...journeyDetails, dateArrival: milliseconds });
    // console.log("dateArrival Mili", journeyDetails.arrivalDate);
  };

  const onSetDateDeparture = (event) => {
    setIsBlocking(true);
    setDateDepartureDefault(new Date(event.target.value));
    var date = new Date(event.target.value); // some mock date
    var milliseconds = date.getTime();
    setJourneyDetails({
      ...journeyDetails,
      dateDeparture: milliseconds,
    });
    // console.log("dateDeparture Mili", journeyDetails.dateDeparture);
  };
  // searchable working here //

  const changeSearchable = () => {
    // console.log(journeyDetails.searchable);
    if (journeyDetails.searchable === 0 || journeyDetails.searchable === -1) {
      setJourneyDetails({ ...journeyDetails, searchable: 1 });
      // console.log("setting value to 1");
    } else {
      setJourneyDetails({ ...journeyDetails, searchable: 0 });
      // console.log("setting value to 0");
    }
    // console.log(journeyDetails);
  };
  // searchable working here //

  const changeTitle = (e) => {
    setJourneyDetails({
      ...journeyDetails,
      name: e.target.value,
    });
    setIsBlocking(true);
  };

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // console.log(string, results);
    const spacesReplaced = string.replaceAll(" ", "+");
    // console.log("spacesReplaced", spacesReplaced);
    setSearchData(spacesReplaced);
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result);
  };

  const handleOnSelect = (item) => {
    setIsBlocking(true);
    // the item selected
    // console.log(item);
    // console.log("locationData", locationData);
    // setCoord([]);
    const coordVal = [];

    if (item) {
      setLocationLoader(true);
      if (item.lon && item.lat) {
        coordVal.push(item.lon);
        coordVal.push(item.lat);

        setCoord(coordVal);
        setJourneyDetails({
          ...journeyDetails,
          latitude: item.lat,
          longitude: item.lon,
          displayName: item.name,
        });

        setLocationLoader(false);
      }
    }
  };

  const handleOnFocus = () => {
    // console.log("Focused");
    // console.log(locationData);
  };

  const handleKeyPress = (event) => {
    // console.log("Event", event);
  };

  const formatResult = (item) => {
    // console.log("item", item);
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const dateArrivalMilisec = (e) => {
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
    // setDateArrival(milliseconds);
    setJourneyDetails({ ...journeyDetails, dateArrival: milliseconds });
  };
  const dateDepartureMilisec = (e) => {
    var date = new Date(e); // some mock date
    var milliseconds = date.getTime();
    // setDateDeparture(milliseconds);
    setJourneyDetails({
      ...journeyDetails,
      dateDeparture: milliseconds,
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
          console.log("retrieving Track", val);
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
                key: i,
              };
              // locationData.push(locationArray);

              setLocationData((locationData) => [
                ...locationData,
                locationArray,
              ]);
            }

            setIsLoading(false);
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

  const handleImageOpen = () => setOpenImage(true);
  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  const handleDone = (e) => {
    const base64result = e.substr(e.indexOf(",") + 1);

    setGroupCodes({ ...groupCodes, base64Result: base64result });
    setJourneyDetails({ ...journeyDetails, base64: e });
    setJourneyBase64Data({ ...journeyBase64Data, base64: e });
    // console.log("handleDone", groupCodes);
    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const getFlagsData = () => {
    // console.log("Calling Country Flags API :");
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      // console.log("Country Info", val);
      if (val) {
        if (val.data != null) {
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

          // console.log("FlagData >", flagValue);
        } else {
          // console.log("document is null");
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
  };

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (journeyBase64Data.base64 === null) {
      if (reducerDefaultPictures) {
        // console.log("Default Pictures`Array :", reducerDefaultPictures);
        // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

        setJourneyBase64Data({
          journeyBase64Data,
          base64: reducerDefaultPictures[3]?.base64Value,
          base64DocumentID: reducerDefaultPictures[3]?.documentID,
        });
      }
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    // console.log(" reducerSelectedJourney:", reducerSelectedJourney);
    // console.log(" reducerSelectedJourney:", reducerSelectedJourney.countrySvg);
    if (
      reducerSelectedJourney.countrySvg === null ||
      reducerSelectedJourney.countrySvg === ""
    ) {
      setGroupFlag(reducerUserDATA.countrySvg);
    } else {
      setGroupFlag(reducerSelectedJourney.countrySvg);
    }
  }, [reducerUserDATA]);

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  const getFlagValues = (e) => {
    // console.log(e);
    iso2 = e.isoTwo;
    url = e.countryFlag;
    // console.log("iso2", iso2);
    // setCountryFlag(baseURL + url);
    setGroupFlag(baseURL + url);

    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });
    // console.log(groupCodes);
    setIsBlocking(true);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getImage = (v, i) => {
    // console.log("vData", v, i);
    var index = memoryImagesTwo.findIndex((x) => x.documentId === v.documentId);
    if (index === -1) {
      memoryImagesTwo.push(v);
      setMemoryImagesTwo([...memoryImagesTwo]);
      mediaUpdatedItem.push(v.documentId);
      // console.log("memoryImages", memoryImagesTwo);
    }
  };

  const getActivities = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", selectedActivitiesArrayData);
    var index = selectedActivitiesArrayData.findIndex((x) => x.key === v.key);
    if (index === -1) {
      selectedActivitiesArrayData.push(v);
      activityUpdatedItem.push(v.key);
      setSelectedActivitiesArrayData([...selectedActivitiesArrayData]);
      // console.log("newActivities", selectedActivitiesArrayData);
    }
  };
  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    var index = connections.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connections.push(v);
      connectionUpdatedItem.push(v.entKey);
      setConnections([...connections]);
      // console.log("connectPeople", connections);
    }
  };

  const getDestinationData = (v, i) => {
    // console.log("vData", v, i);
    var index = destinations.findIndex((x) => x.key === v.key);
    if (index === -1) {
      destinations.push(v);
      destinationUpdatedItem.push(v.key);
      setDestinations([...destinations]);
      // console.log("destinations", destinations);
    }
  };

  const deleteActivityItem = (data, index) => {
    // console.log("deleteActivityItem", data, index);

    deleteJourneyItemAPI(userToken, data.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    selectedActivitiesArrayData.splice(index, 1);
    setSelectedActivitiesArrayData([...selectedActivitiesArrayData]);
    // console.log("newActivities", selectedActivitiesArrayData);

    var indexActivityItem = activityUpdatedItem.indexOf(data.docKey);
    activityUpdatedItem.splice(indexActivityItem, 1);
    setActivityUpdatedItem([...activityUpdatedItem]);
  };

  const deleteDestinationItem = (data, index) => {
    // console.log(data);

    deleteJourneyItemAPI(userToken, data.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Destination Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    var indexDestinationItem = destinations.indexOf(data.docKey);
    destinationUpdatedItem.splice(indexDestinationItem, 1);
    setDestinationUpdatedItem([...destinationUpdatedItem]);

    destinations.splice(index, 1);
    setDestinations([...destinations]);
  };
  const deleteWaypointItem = (data, index) => {
    // console.log(data);

    deleteJourneyItemAPI(userToken, data.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Destination Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    var indexDestinationItem = wayPoints.indexOf(data.docKey);
    wayPointUpdatedItem.splice(indexDestinationItem, 1);
    setWayPointUpdatedItem([...wayPointUpdatedItem]);

    wayPoints.splice(index, 1);
    setWayPoints([...wayPoints]);
  };

  const deleteCardItem = (data, index) => {
    // console.log("data", index);

    deleteJourneyItemAPI(userToken, data.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    connections.splice(index, 1);
    setConnections([...connections]);
  };

  const deleteWayPointItem = (data, index) => {
    // console.log("data", index);
    // console.log("WayPoint Deleted API ");

    deleteWayPointItemAPI(userToken, journeyDetails.key, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("WayPoint Deleted Successfully");
          callRoutingForMapAPI();
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    // connections.splice(index, 1);
    // setConnections([...connections]);
  };

  const deleteMediaItem = (data, index) => {
    // console.log(data);

    deleteJourneyItemAPI(userToken, data.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    memoryImagesTwo.splice(index, 1);
    setMemoryImagesTwo([...memoryImagesTwo]);
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const moveToJourneys = () => {
    history.push("/destinations/my-journeys");
  };

  const mediaComponentActive = (e) => {
    // console.log("button Clicked", e);
    setMediaComponent(!mediaComponent);
    // console.log(mediaComponent);
  };

  const updateJourney = () => {
    // console.log("Updating groups:", groupCodes);
    // console.log(
    //   "Updating Journy values:",
    //   journeyDetails.name,
    //   journeyDetails.description,
    //   "startedTime:",
    //   locations[0].startedTime,
    //   "endedTime:",
    //   locations[locations.length - 1].endedTime
    // );
    if (
      journeyDetails.name !== null &&
      journeyDetails.name !== "undefined" &&
      journeyDetails.description !== null &&
      locations[0].startedTime !== 0 &&
      locations[locations.length - 1].endedTime !== 0
    ) {
      // updateMetaGroupAPI;
      setIsLoading(true);
      if (groupCodes.base64Result != null) {
        // console.log("going through if", groupCodes.base64Result);
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
            // console.log("Updating Journey", val.data);
            if (val.data !== null) {
              let item = {
                date: Date.now(),
                documentId: val.data.documentId,
                image: journeyDetails.base64,
                isLoaded: true,
              };
              if (
                memoryImagesArray === undefined ||
                memoryImagesArray.length === 0
              ) {
                setMemoryImagesArray([item]);

                dispatch({
                  type: "SET_MEMORY_IMAGE",
                  reducerMemoryImages: [item],
                });
              } else {
                memoryImagesArray.push(item);

                dispatch({
                  type: "SET_MEMORY_IMAGE",
                  reducerMemoryImages: memoryImagesArray,
                });
              }
              callUpdateJourneyApi(val.data?.documentID);
            } else {
              alert.show("Journey update failed");
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
        });
      } else {
        // console.log("going through else", groupCodes.pictureDocumentID);
        callUpdateJourneyApi(groupCodes?.pictureDocumentID);
      }

      uploadUpdatedMemoryImages();
      uploadUpdatedActivities();
      uploadUpdatedConnection();
      uploadUpdatedDestination();
      addWayPointsToJourney();
      // setCountrydropdownMenu(false);
    } else {
      alert.show("Please fill the required fields");
    }
  };

  const callUpdateJourneyApi = (documentID) => {
    // console.log("Updating Destination:", groupCodes);
    // console.log("groups:", journeyDetails);
    // console.log("documentID:", documentID);

    const config = JSON.stringify({
      countryCode: groupCodes.countryCode,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: journeyDetails.key,
      name: journeyDetails.name,
      description: journeyDetails.description,
      configurations: config,
      // followUpDateTime: journeyDetails.departureDate,
      followUpDateTime: 1649458900,
      creationDateTime: 1649453700,
      startDateTime: locations[0].startedTime,
      endDateTime: locations[locations.length - 1].endedTime,
      orderPosition: 5,
    });
    // console.log("Params", params);

    updateJourneyAPI(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        setIsLoading(false);
        setIsBlocking(false);
        alert.show("Journey updated successfully");

        // console.log("reducerJournies", reducerJournies);
        var index = reducerJournies.findIndex(
          (x) => x.key === reducerSelectedJourney.key
        );
        if (index === -1) {
        } else {
          let journeyArray = reducerJournies;
          let item = { ...journeyArray[index] };
          item.name = journeyDetails.name;
          item.description = journeyDetails.description;
          item.searchable = journeyDetails.searchable;
          item.base64 = journeyDetails.base64;
          item.countrySvg = groupFlag;
          item.latitude = journeyDetails.latitude;
          item.longitude = journeyDetails.longitude;
          item.followUpDateTime = journeyDetails.followUpDateTime;

          journeyArray[index] = item;

          dispatch({
            type: "SET_JOURNIES",
            reducerJournies: journeyArray,
          });
          history.push("/destinations/my-journeys");
        }
        // console.log("update journey response", val.data);
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

  const addJourneyitem = (params) => {
    addJourneyItemAPI(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        setIsLoading(false);
        // console.log(val.data);
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
  const callAddWayPoint = (params, index) => {
    addWayPointItemAPI(params, userToken, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        setIsLoading(false);
        console.log("addWayPoint API Response", val.data);
        if (val.data.jwKey) {
          let arrayItems = locations;
          let item = { ...arrayItems[index] };
          item.jwKey = val.data.jwKey;
          arrayItems[index] = item;
          setLocations(arrayItems);
          setLocations(locations);
          setWayPoints(locations);
          callRoutingForMapAPI();
        } else if ((val.data.Error = "Database error")) {
          alert.show("Some Error Occuered");
          wayPoints.splice(index, 1);
          setWayPoints([...wayPoints]);
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
  };

  const uploadUpdatedActivities = () => {
    for (var i = 0; i < activityUpdatedItem.length; i++) {
      // console.log("activityUpdatedItem", activityUpdatedItem[i]);

      const params = JSON.stringify({
        ugGroupKey: activityUpdatedItem[i],
        gtGroupType: activityGroupKey,
        mtGroupKey: APIResponse.pk,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };
  const uploadUpdatedMemoryImages = () => {
    for (var i = 0; i < mediaUpdatedItem.length; i++) {
      // console.log("mediaUpdatedItem", mediaUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: mediaUpdatedItem[i],
        gtGroupType: memoryGroupKey,
        mtGroupKey: APIResponse.pk,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };

  const uploadUpdatedConnection = () => {
    for (var i = 0; i < connectionUpdatedItem.length; i++) {
      // console.log("connectionUpdatedItem", connectionUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: connectionUpdatedItem[i],
        gtGroupType: user_contactGroupKey,
        mtGroupKey: APIResponse.pk,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };

  const uploadUpdatedDestination = () => {
    for (var i = 0; i < destinationUpdatedItem.length; i++) {
      // console.log("destinationUpdatedItem", destinationUpdatedItem);
      // console.log("destinationUpdatedItemValue", destinationUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: destinationUpdatedItem[i],
        gtGroupType: destinationGroupKey,
        mtGroupKey: APIResponse.pk,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };
  const addWayPointsToJourney = () => {
    for (var i = 0; i < locations.length; i++) {
      // console.log("locations way Points", locations[i]);

      const params = JSON.stringify({
        pk: journeyDetails.key,
        dstKey: locations[i].key,
        orderPosition: locations[i].index,
      });
      // console.log("parameter", params);
      // callAddWayPoint(params);
    }
  };

  const addArray = () => {
    // console.log("Adding");
    const newVal = {
      id: locations.length,
      endedTime: null,
      endedTimeInitial: null,
      index: locations.length + 1,
      isLast: true,
      dstKey: null,
      lat: null,
      lon: null,
      name: null,
      startedTime: null,
    };
    // locations.push(newVal);
    // setLocations(locations);

    setLocations((locations) => [...locations, newVal]);
  };

  const removeArray = (data, index) => {
    console.log("button pressed", data);
    console.log("button pressed pre", locations.length);
    // console.log("button pressed next", locations[index + 1]?.dstKey);

    if (
      locations[index - 1]?.dstKey === locations[index + 1]?.dstKey &&
      locations.length > 1
    ) {
      alert.show("Location Could not be deleted");
    } else {
      deleteWayPointItemAPI(userToken, data.jwKey, reducerVisitorID).then(
        function (val) {
          // console.log("valData", val.data);
          setIsLoading(true);
          // console.log("delete API response >>", val.data);
          setIsLoading(false);
          if (val.data.rows === "1") {
            alert.show("WayPoint Deleted Successfully");
            callRoutingForMapAPI();

            var indexx = wayPoints.findIndex((x) => x.jwKey === data.jwKey);
            if (indexx === -1) {
              console.log("checking coord", indexx);
            } else {
              wayPoints.splice(indexx, 1);
              setWayPoints([...wayPoints]);
              console.log("checking coord", indexx);
            }

            // coord.splice(index, 1);
            // setCoord([...coord]);

            console.log("waypoints waypoint", wayPoints);
            console.log("waypoints coord", coord);
            // console.log("index in removeArray", index);
          } else {
            setCoord([...coord]);
            // console.log("removeArray", coord);
            // alert.show("Some Error Occured");
          }
        }
      );

      locations.splice(index, 1);
      setLocations(locations);
    }
    // console.log("locations", locations);
  };

  const removeWaypoint = (data, index) => {
    var indx = wayPoints.findIndex((x) => x.jwKey === data.jwKey);
    if (indx === -1) {
      console.log("checking coord", indx);
      wayPoints.splice(indx, 1);
      setWayPoints([...wayPoints]);
    } else {
      // wayPoints.splice(indx, 1);
      // setWayPoints([...wayPoints]);
      console.log("checking coord", indx);
    }
  };

  const checkArray = (
    lon,
    lat,
    name,
    index,
    key,
    startedTime,
    endedTime,
    jwKey
  ) => {
    // if (locations[locations.length - 2].dstKey !== key) {
    console.log("checkArray >>", locations, jwKey, "userToken", userToken);
    if (locations[index].dstKey) {
      deleteWayPointItemAPI(
        userToken,
        locations[index].jwKey,
        reducerVisitorID
      ).then(function (val) {
        setIsLoading(true);
        console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          // alert.show("WayPoint Deleted Successfully");

          updateArray(lon, lat, name, index, key, startedTime, endedTime);
          // removeWaypoint(data, index);
          // setLocationInput(false);
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
    } else {
      updateArray(lon, lat, name, index, key, startedTime, endedTime);
    }
  };
  const updateArray = (lon, lat, name, index, key, startedTime, endedTime) => {
    // if (locations[locations.length - 2].dstKey !== key) {
    if (
      locations[index - 1]?.dstKey !== key &&
      locations[index + 1]?.dstKey !== key
    ) {
      console.log("coord in UpdateArray", coord);

      // console.log("lastindexvalue previous", locations[index - 1]?.dstKey);
      // console.log("lastindexvalue next", locations[index + 1]?.dstKey);
      let arrayItems = locations;
      let item = { ...arrayItems[index] };
      item.name = name;
      item.latitude = lat;
      item.longitude = lon;
      item.index = index;
      item.dstKey = key;
      item.startedTime = startedTime;
      item.endedTime = endedTime;

      arrayItems[index] = item;
      setLocations(arrayItems);
      setLocations(locations);

      const coordVal = [];

      if (lon && lat) {
        coordVal.push(item.longitude);
        coordVal.push(item.latitude);

        coord.push(coordVal);
        setCoord([...coord]);
      }
      if (centerVal.length < 1) {
        setCenterVal(coordVal);
      }

      // console.log("updateArray", coord);

      const params = JSON.stringify({
        pk: journeyDetails.key,
        dstKey: key,
        orderPosition: index,
      });
      // console.log("parameter", params);

      callAddWayPoint(params, index);
    } else {
      // console.log("lastindexvalue is same");
      alert.show("Invalid Location");
    }
  };

  const updateArrayStartTime = (startedTime, index, e) => {
    let now = new Date(e);
    const nextdate = new Date(now.setDate(now.getDate() + 1));
    var nextMilliseconds = nextdate.getTime();

    let arrayItems = locations;
    let item = { ...arrayItems[index] };
    item.startedTime = startedTime;
    item.endedTimeInitial = nextdate.toLocaleDateString("en-CA");
    item.endedTime = nextMilliseconds;
    arrayItems[index] = item;
    setLocations(arrayItems.slice());
    // setLocations((locations) => [...locations, arrayItems]);
  };
  const updateArrayEndTime = (endedTime, index, e) => {
    let arrayItems = locations;
    let item = { ...arrayItems[index] };
    item.endedTime = endedTime;
    item.endedTimeInitial = e;
    arrayItems[index] = item;
    setLocations(arrayItems.slice());
  };

  useEffect(() => {
    if (reducerSelectedJourney?.description !== null) {
      const decoder = Buffer.from(
        reducerSelectedJourney?.description,
        "base64"
      ).toString("UTF-8");
      setQuillValue(decoder);
    }
    // console.log("quillValue", quillValue);
  }, [reducerSelectedJourney]);

  const updateQuillValue = () => {
    setIsBlocking(true);
  };

  useEffect(() => {
    // if (setQuillValue != null) {

    setUpdatedValue(Buffer.from(quillValue).toString("base64"));
    // console.log("quillValue", quillValue);
    // console.log("quillValue", updatedValue);
    // }
  }, [quillValue]);

  useEffect(() => {
    console.log("Coord changed:", coord);

    if (coord.length > 1) {
      var coordStr = "";

      for (var i = 0; i < coord.length; i++) {}
    }
  }, [coord]);

  useEffect(() => {
    //console.log("Route Way Points", routeWayPoint);
  }, [routeWayPoint]);

  useEffect(() => {
    if (updatedValue != null) {
      setJourneyDetails({
        ...journeyDetails,
        description: updatedValue,
      });
      // console.log("quillValue", updatedValue);
    }
  }, [updatedValue]);

  // useEffect(() => {
  //   const coordVal = [];
  //   if (reducerSelectedJourney) {
  //     // setLocationLoader(true);
  //     if (reducerSelectedJourney.longitude && reducerSelectedJourney.latitude) {
  //       coordVal.push(reducerSelectedJourney.latitude);
  //       coordVal.push(reducerSelectedJourney.longitude);
  //       setCoord(coordVal);
  //     }
  //   }
  // console.log("coords reducerSelectedJourney", coord);
  // console.log("reducerSelectedJourney", reducerSelectedJourney);
  // }, [reducerSelectedJourney]);

  // useEffect(() => {
  //   if (reducerSelectedJourney.key !== null) {
  //     // setJourneyDetails({
  //     //   ...journeyDetails,
  //     //   latitude: reducerSelectedJourney.latitude,
  //     //   displayName: reducerSelectedJourney.displayName,
  //     //   longitude: reducerSelectedJourney.longitude,
  //     //   searchable: reducerSelectedJourney.searchable,
  //     //   // configuration: reducerSelectedJourney,
  //     //   // iso2: reducerSelectedJourney,
  //     //   // countrySvg: reducerSelectedJourney.countrySvg,
  //     //   // base64: reducerSelectedJourney.base64,
  //     //   title: reducerSelectedJourney.name,
  //     //   description: reducerSelectedJourney.description,
  //     //   key: reducerSelectedJourney.key,
  //     //   departureDate: reducerSelectedJourney.departureDate,
  //     //   arrivalDate: reducerSelectedJourney.arrivalDate,
  //     // });
  //     setJourneyDetails(reducerSelectedJourney);
  // console.log("journeyDetails", journeyDetails);
  // console.log("reducerSelectedJourney", reducerSelectedJourney);
  //   }
  // }, [reducerSelectedJourney]);

  useEffect(() => {
    if (!firstLoad) {
      // console.log("firstLoad triggered");
      setFirstLoad(true);
      setInitialLoading(true);
      getJourneyDataAPI();
    }
  }, [firstLoad]);

  const getFlagURL = (data, index, status) => {
    // console.log('Flagid',id);

    if (data) {
      getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
        if (val) {
          // console.log("flagURL Info", val.data);
          if (val.data != null) {
            var mimeType = "image/svg+xml";
            let svgValue = `data:${mimeType};base64,${val.data}`;
            if (status === 0) {
              setJourneyDetails({
                ...journeyDetails,
                countrySvg: svgValue,
              });

              // setJourneyDetails(journeyDetails.slice());
              // console.log("journeyDetails countrySvg", journeyDetails);
            }
            if (status === 1) {
              let activityItem = selectedActivitiesArrayData;
              let item = { ...activityItem[index] };

              item.countrySvg = svgValue;
              activityItem[index] = item;

              setSelectedActivitiesArrayData(activityItem.slice());
              // console.log(selectedActivitiesArrayData);
            } else if (status === 2) {
              setGroupFlag(svgValue);
            } else if (status === 3) {
              let connectionItem = connections;
              let item = { ...connectionItem[index] };

              item.countrySvg = svgValue;
              connectionItem[index] = item;
              setConnections(connectionItem.slice());
            } else if (status === 4) {
              let destinationItem = destinations;
              let item = { ...destinationItem[index] };

              item.countrySvg = svgValue;
              destinationItem[index] = item;
              setDestinations(destinationItem.slice());
            }
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
    }
  };

  const getImageByDocumentId = (id, index, status) => {
    // console.log("Calling image API for ID:", id);
    getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("this is Image valBase64", val);
        // setMemoryImages([]);

        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          let srcValue = `data:image/jpg;base64, ${imageFile}`;
          if (status === 0) {
            console.log("journeyDetailsbase64", srcValue);
            setJourneyBase64Data({
              ...journeyBase64Data,
              base64: srcValue,
            });

            setJourneyBase64Data(journeyBase64Data.slice());
            // console.log("journey base64", journeyBase64Data);
          } else if (status === 5) {
            let memoryItem = memoryImagesTwo;
            let item = { ...memoryItem[index] };

            item.base64 = srcValue;
            item.isLoaded = true;
            item.date = val.data.timestampDocument;
            memoryItem[index] = item;

            setMemoryImagesTwo(memoryItem.slice());
            // console.log("Memory Images Array", memoryImagesTwo);
          } else if (status === 1) {
            let activityItem = selectedActivitiesArrayData;
            let item = { ...activityItem[index] };

            item.base64 = srcValue;
            item.isLoaded = true;

            activityItem[index] = item;

            setSelectedActivitiesArrayData(activityItem.slice());
          } else if (status === 2) {
            //setGroupBase64(srcValue);
          } else if (status === 3) {
            let connectionItem = connections;
            let item = { ...connectionItem[index] };

            item.base64 = srcValue;
            item.isLoaded = true;

            connectionItem[index] = item;

            setConnections(connectionItem.slice());
            // console.log("connectionItem", connectionItem);
            dispatch({
              type: "SET_GROUP_PEOPLE",
              reducerGroupPeople: connections,
            });
          } else if (status === 4) {
            let destinationItem = destinations;
            let item = { ...destinationItem[index] };

            item.base64 = srcValue;
            item.isLoaded = true;

            destinationItem[index] = item;

            setDestinations(destinationItem.slice());
            // console.log("Destination item", destinationItem);
          }
        } else {
          // console.log("document is null");
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
  };

  const getSingleDestinationById = (key, index) => {
    retrieveSingleDestinationAPI(userToken, key, reducerVisitorID).then(
      function (val) {
        if (val) {
          // console.log("Destinations Value", val.data);
          // console.log("Index Value", index);
          if (val.data.name != null) {
            let destinationItem = destinations;
            let item = { ...destinationItem[index] };

            item.name = val.data.name;
            destinationItem[index] = item;
            setDestinations(destinationItem.slice());

            if (val.data.configurations) {
              var configurations = JSON.parse(val.data?.configurations);
              // console.log("Destinations Configurations", configurations);
              if (configurations.pictureDocumentID) {
                getImageByDocumentId(
                  configurations.pictureDocumentID,
                  index,
                  4
                );
              }
              if (configurations.countryCode) {
                getFlagURL(configurations.countryCode, index, 4);
              }
            }
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

  const getSingleConnectionValue = (key, index) => {
    readSingleUserAPI(userToken, key, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data.firstName != null) {
          // console.log("ConnectionUserValue", val.data);

          let connectionitem = connections;
          let item = { ...connectionitem[index] };
          item.firstName = val.data?.firstName;
          item.lastName = val.data?.lastName;
          connectionitem[index] = item;
          setConnections(connectionitem.slice());
          dispatch({
            type: "SET_GROUP_PEOPLE",
            reducerGroupPeople: connections,
          });
          if (val.data.avatar_dms_key) {
            getImageByDocumentId(val.data.avatar_dms_key, index, 3);
          }
          if (val.data.countryCode) {
            getFlagURL(val.data.countryCode, index, 3);
          }
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
  };

  const getSingleActivityByID = (id, index, status) => {
    // console.log("Calling Activity API for ID:", id);

    readSingleActivityAPI(userToken, id, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Activity Info", val.data);
        // console.log("Activity InfoTwo", id);

        if (status === 1) {
          let activityItem = selectedActivitiesArrayData;
          let item = { ...activityItem[index] };

          item.name = val.data?.name;
          item.description = val.data?.description;
          activityItem[index] = item;
          setSelectedActivitiesArrayData(activityItem.slice());
          // console.log("Activity Array", selectedActivitiesArrayData);
          // console.log("Activity InfoConfig", val.data.configurations);
        } else if (status === 2) {
          let activityItem = connectPeople;
          let item = { ...activityItem[index] };

          item.firstName = val.data?.firstName;
          item.lastName = val.data?.lastName;
          activityItem[index] = item;

          setConnectPeople(connectPeople.slice());
          // console.log("Connection Array", connectPeople);
          // console.log("Activity InfoConfig", val.data.configurations);
        }

        if (val.data.configurations) {
          var configurations = JSON.parse(val.data?.configurations);

          if (val.data.pk !== 1213) {
            const activityDataValue = {
              countryCode: configurations?.countryCode,
              documentID: configurations?.pictureDocumentID,
            };

            if (activityDataValue.countryCode) {
              getFlagURL(activityDataValue?.countryCode, index, 1);
            }
            if (activityDataValue.documentID) {
              getImageByDocumentId(activityDataValue?.documentID, index, 1);
            }
          }
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
  };

  const getJourneyDataAPI = () => {
    // console.log("Calling Journey API");
    retrieveSingleJourneyAPI(
      userToken,
      reducerSelectedJourney.key,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        console.log("singleJourneyData", val.data);

        const APIData = val.data;
        if (APIData) {
          setAPIResponse(APIData);
          setInitialLoading(false);

          const centerPoint = [];

          if (APIData?.longitude && APIData?.latitude) {
            centerPoint.push(APIData?.longitude);
            centerPoint.push(APIData?.latitude);
          }
          setCenterVal(centerPoint);

          if (APIData.waypoints) {
            // setWayPointMarkers([...APIData.waypoints]);
            setWayPoints([...APIData?.waypoints]);
          }

          if (val.data.configurations) {
            var configurations = val?.data?.configurations;

            console.log("configurations", configurations);
            setGroupCodes({
              countryCode: configurations?.countryCode,
              pictureDocumentID: configurations?.pictureDocumentID,
            });
            if (
              configurations?.countryCode ||
              configurations?.pictureDocumentID
            ) {
              const journeyDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              console.log("journeyDataVal.countryCode", journeyDataVal);
              getFlagURL(journeyDataVal?.countryCode, 0, 0);

              if (journeyDataVal?.documentID) {
                console.log(
                  "journeyDataVal.documentID",
                  journeyDataVal?.documentID
                );
                getImageByDocumentId(journeyDataVal?.documentID, 0, 0);
              }
            }
          }

          var memoryKeys = val?.data?.media;
          var activitiesKeys = val?.data?.activities;
          var connectionKeys = val?.data?.connections;
          var destinationKeys = val?.data?.destinations;
          var waypointsKey = val?.data?.waypoints;

          // console.log("Memories Keys Array View Journey", val.data.media);
          // console.log(memoryKeys, "Memories Keys Array View Journey");
          // console.log(activitiesKeys, "activities Keys Array View Journey");
          // console.log(
          //   "activities Keys Array View Journey",
          //   val.data.activities
          // );
          // console.log(connectionKeys, "Connection Keys Array View Journey");
          // console.log(destinationKeys, "DestinationsKeys Array View Journey");
          // console.log(waypointsKey, "waypoints Keys Array View Journey");

          for (var key in memoryKeys) {
            const imageValue = {
              docKey: memoryKeys[key].docKey,
              groupItemsKey: memoryKeys[key].groupItemsKey,
              index: memoryImagesTwo.length,
              base64: null,
              isLoaded: false,
              date: null,
            };
            memoryImagesTwo.push(imageValue);

            getImageByDocumentId(
              memoryKeys[key].docKey,
              memoryImagesTwo.length - 1,
              5
            );
          }

          for (var key in connectionKeys) {
            const connectionValue = {
              entKey: connectionKeys[key].docKey,
              groupItemsKey: connectionKeys[key].groupItemsKey,
              index: connections.length,
              base64: null,
              isLoaded: false,
              countrySvg: null,
              firstName: null,
              lastName: null,
            };
            connections.push(connectionValue);

            getSingleConnectionValue(
              connectionKeys[key].docKey,
              connections.length - 1
            );
          }

          for (var key in activitiesKeys) {
            const activitiesSingleItemValue = {
              name: null,
              key: activitiesKeys[key].docKey,
              groupItemsKey: activitiesKeys[key].groupItemsKey,
              description: null,
              countrySvg: null,
              base64: null,
              index: selectedActivitiesArrayData.length,
            };

            selectedActivitiesArrayData.push(activitiesSingleItemValue);
            setSelectedActivitiesArrayData(selectedActivitiesArrayData.slice());
            getSingleActivityByID(
              activitiesKeys[key].docKey,
              selectedActivitiesArrayData.length - 1,
              1
            );
          }

          for (var key in destinationKeys) {
            const destinationSingleItemValue = {
              name: null,
              key: destinationKeys[key].docKey,
              groupItemsKey: destinationKeys[key].groupItemsKey,
              countrySvg: null,
              isLoading: false,
              index: destinations.length,
            };

            destinations.push(destinationSingleItemValue);
            setDestinations(destinations.slice());
            // console.log("DestinationsArraySingleItem", destinations);

            getSingleDestinationById(
              destinationKeys[key].docKey,
              destinations.length - 1
            );
          }
          var coordStr = "";
          for (var key in waypointsKey) {
            const waypointsItemValue = {
              name: waypointsKey[key].displayName,
              latitude: waypointsKey[key].latitude,
              longitude: waypointsKey[key].longitude,
              dstKey: waypointsKey[key].dstKey,
              jwKey: waypointsKey[key].jwKey,
              orderPosition: waypointsKey[key].orderPosition,
            };

            wayPoints.push(waypointsItemValue);
            setWayPoints(wayPoints.slice());

            coordStr =
              coordStr +
              waypointsKey[key].longitude +
              "," +
              waypointsKey[key].latitude;
            coordStr = coordStr + ";";

            //console.log("Coord Item",coord[i][0])
          }
        }

        //ROUTING API BLOCK
        const params = JSON.stringify({
          route: coordStr.substring(0, coordStr.length - 1),
          lang: "de",
          maxRoutes: 1,
        });
        console.log("Cordinates Params", params);

        routingForMapsAPI(userToken, params, reducerVisitorID).then(function (
          val
        ) {
          if (val) {
            setIsLoading(false);

            console.log("Routes for Map", val.data);

            //var steps = val.data.routes[0].legs[0].steps;

            var legs = val.data.routes[0].legs;

            for (var legsKey in legs) {
              console.log("legs! keys:", legs[legsKey].steps);
              var steps = legs[legsKey].steps;

              for (key in steps) {
                console.log(
                  "Steps! keys:",
                  steps[key].intersections[0].location
                );
                const coordVal = [];
                coordVal.push(steps[key].intersections[0].location[0]);
                coordVal.push(steps[key].intersections[0].location[1]);
                setRouteWaypoints((routeWayPoint) => [
                  ...routeWayPoint,
                  coordVal,
                ]);
              }
            }

            //var APIResponse = val.data;
            // console.log("Routes for Map JSON", JSON.Parse(APIResponse));
          } else if (val.status === UNAUTH_KEY) {
            // console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        });

        //Routing API BLOCK
      }
    });
  };

  const callRoutingForMapAPI = () => {
    // console.log("Calling Journey API");
    setRouteWaypoints([]);
    retrieveSingleJourneyAPI(
      userToken,
      reducerSelectedJourney.key,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        console.log("singleJourneyData", val.data);

        const APIData = val.data;
        if (APIData) {
          var waypointsKey = val.data.waypoints;

          var coordStr = "";
          for (var key in waypointsKey) {
            coordStr =
              coordStr +
              waypointsKey[key].longitude +
              "," +
              waypointsKey[key].latitude;
            coordStr = coordStr + ";";

            //console.log("Coord Item",coord[i][0])
          }
        }

        //ROUTING API BLOCK
        const params = JSON.stringify({
          route: coordStr.substring(0, coordStr.length - 1),
          lang: "de",
          maxRoutes: 1,
        });
        //console.log("Cordinates Params", params);

        routingForMapsAPI(userToken, params, reducerVisitorID).then(function (
          val
        ) {
          if (val) {
            setIsLoading(false);

            console.log("Routes for Map", val.data);

            //var steps = val.data.routes[0].legs[0].steps;


            if(val.data){

            
            var legs = val.data.routes[0].legs;

            for (var legsKey in legs) {
              //console.log("legs! keys:", legs[legsKey].steps)
              var steps = legs[legsKey].steps;

              for (key in steps) {
                //console.log("Steps! keys:",steps[key].intersections[0].location)
                const coordVal = [];
                coordVal.push(steps[key].intersections[0].location[0]);
                coordVal.push(steps[key].intersections[0].location[1]);
                setRouteWaypoints((routeWayPoint) => [
                  ...routeWayPoint,
                  coordVal,
                ]);
              }
            }
          }

            //var APIResponse = val.data;
            // console.log("Routes for Map JSON", JSON.Parse(APIResponse));
          } else if (val.status === UNAUTH_KEY) {
            // console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        });

        //Routing API BLOCK
      }
    });
  };

  const deleteJourney = (v) => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  useEffect(() => {
    setLocationLoader(true);

    let arrayLength = wayPoints.length;
    var newArr = wayPoints.map(function (val, index) {
      return [val.longitude, val.latitude];
    });
    if (newArr.length === arrayLength) {
      setCoord(newArr);

      console.log("coords in useEffect coord", newArr.length, arrayLength);
    }

    setWaypointlength(parseInt(wayPoints.length));
  }, [wayPoints]);

  useEffect(() => {
    console.log("waypoints in useEffect", wayPoints);
    if (wayPoints.length > 0) {
      setInitialWayPointLoader(false);

      const numAscending = [...wayPoints].sort(
        (a, b) => a.orderPosition - b.orderPosition
      );
      console.log("numAscending in useEffect", numAscending);
      setLocations(numAscending);
    } else {
      setInitialWayPointLoader(false);
      setLocations(locations);
    }
    // console.log("locations in useEffect", locations);
  }, [wayPoints]);

  useEffect(() => {
    console.log("locations in useEffect", locations);
  }, [locations]);

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="viewJourney">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />

      <div className="viewDestination__container">
        <div className="viewJourney__containerTop">
          <div className="container__topLeft">
            <ChevronLeft onClick={moveToJourneys} />
            <h3>View Journeys</h3>
          </div>
          <div className="container__topRight">
            {journeyDetails.searchable === 0 ? (
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

        <div className="viewJourney__topSearch">
          <div className="destinationTitle">
            <h5 className="inputTitle">Journey Title</h5>
            <div className="inputDiv">
              <input
                type="text"
                placeholder="Enter Title"
                value={journeyDetails.name}
                onChange={changeTitle}
              />
            </div>

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
                    {groupFlag && (
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
                      src={
                        reducerSelectedJourney.countrySvg
                          ? reducerSelectedJourney.countrySvg
                          : reducerUserDATA.countrySvg
                      }
                      onClick={CountryDropdown}
                      alt=""
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="topSearch">
            <div className="viewJourney__searchRight">
              <div className="uploadImageSection">
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
                {!journeyBase64Data.base64 ? (
                  <Oval color="#00BFFF" height={80} width={80} />
                ) : (
                  <img
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                    alt=""
                    src={journeyBase64Data.base64}
                    onClick={photoUrl && handleImageOpen}
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
                  <img
                    style={{ borderRadius: "12px" }}
                    src={journeyBase64Data.base64}
                    width="500"
                    height="500"
                    alt=""
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
            </div>
          </div>
        </div>

        <div className="viewJourney__search">
          {initialWayPointLoader ? (
            <div className="initialLocationLoader">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : (
            <div className="viewJourney__searchLeft">
              {locations.map((v, i) => (
                <LocationSearchBar
                  key={locations.orderPosition}
                  data={v}
                  index={i}
                  joKey={journeyDetails.key}
                  updateArray={updateArray}
                  checkArray={checkArray}
                  removeArray={removeArray}
                  removeWaypoint={removeWaypoint}
                  locations={locations}
                  setLocations={setLocations}
                  deleteWayPointItem={deleteWayPointItem}
                  updateArrayStartTime={updateArrayStartTime}
                  updateArrayEndTime={updateArrayEndTime}
                  callAPI={true}
                />
              ))}
              <div className="createJourney__actionButtons">
                <div className="createJourney__addItem">
                  <CompareArrows />
                </div>
                <div className="createJourney__addItem" onClick={addArray}>
                  <Add />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="createJourney__mainScreen">
          {coord.length >= 1 ? (
            <JourneyMap
              coord={routeWayPoint}
              centerVal={centerVal}
              wayPointMarkers={wayPoints}
            />
          ) : (
            <InitialCoordMap />
          )}
        </div>

        <div className="container__notes">
          <ReactQuill
            theme="snow"
            value={quillValue}
            onChange={setQuillValue}
            onFocus={updateQuillValue}
            modules={Editor}
          />
        </div>

        <div className="container__items">
          <div className="container__connections">
            <h5>Connections</h5>
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

          <div className="container__activities">
            <h5>Activities</h5>
            {selectedActivitiesArrayData.length <= 0 ? (
              <p className="addDetails__heading">Please Add Activites </p>
            ) : (
              <div className="midActivities__tags">
                {selectedActivitiesArrayData.map((v, i) => (
                  <div className="mapMiniActivites">
                    <MiniActivitiesCard
                      key={v + i}
                      data={v}
                      index={i}
                      clickFunction={deleteActivityItem}
                      deleteItem
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="container__LinkedDestinations">
            <h5>Destinations</h5>
            {destinations.length <= 0 ? (
              <p className="addDetails__heading">Please Add Destinations </p>
            ) : (
              <div className="destinationItems">
                {destinations.map((v, i) => (
                  <MiniDestinationCard
                    key={v + i}
                    data={v}
                    index={i}
                    clickFunction={deleteDestinationItem}
                    deleteItem
                  />
                ))}
              </div>
            )}
          </div>

          <div className="container__media">
            <h5>Media</h5>
            {memoryImagesTwo.length <= 0 ? (
              <p className="addDetails__heading">Please Add Gallery </p>
            ) : (
              <div className="postCards__cards">
                {memoryImagesTwo.map((v, i) => (
                  <MediaGallery
                    key={i}
                    data={v}
                    index={i}
                    clickFunction={deleteMediaItem}
                    deleteItem
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {collapsibleButton ? (
        <CollapsibleButtons
          getImage={getImage}
          getActivities={getActivities}
          getConnection={getConnection}
          getDestinationData={getDestinationData}
          handleTriggerClose={handleTriggerClose}
          mediaComponentActive={mediaComponentActive}
        />
      ) : (
        <div className="createDestination__bottom">
          <div className="svg__Icon">
            <Add onClick={handleTriggerOpen} />
          </div>
          <button className="primaryButtonActive" onClick={updateJourney}>
            Update Journey
          </button>

          <div className="svg__IconRight">
            <Close onClick={() => deleteJourney(reducerSelectedJourney.key)} />
          </div>
        </div>
      )}

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={reducerSelectedJourney.key}
          state="journey"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}

      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Journey Picture"
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

export default ViewJourney;
