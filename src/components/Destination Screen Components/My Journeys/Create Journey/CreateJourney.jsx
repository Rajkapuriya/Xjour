import {
  Add,
  ChevronLeft,
  Close,
  CompareArrows,
  Edit,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import "./CreateJourney.css";
import { useAlert } from "react-alert";
import { useHistory } from "react-router";
import { useStateValue } from "../../../../config/context api/StateProvider";
import LocationSearchBar from "./Location SearchBar/LocationSearchBar";
import InitialCoordMap from "../../../OLMap React/InitialCoordMap";
import {
  addBase64File,
  addJourneyItemAPI,
  addWayPointItemAPI,
  deleteWayPointItemAPI,
  getCountryFlags,
  getDocumentByName,
  routingForMapsAPI,
  updateJourneyAPI,
} from "../../../../config/authentication/AuthenticationApi";
import {
  activityGroupKey,
  destinationGroupKey,
  memoryGroupKey,
  UNAUTH_KEY,
  user_contactGroupKey,
} from "../../../../assets/constants/Contants";
import OLMapReact from "../../../OLMap React/OLMapReact";
import CollapsibleButtons from "../../../Sidebar Group Buttons/Collapsible Buttons/CollapsibleButtons";
import DeleteOrHideDialogue from "../../../Delete Or Hide Dialogue/DeleteOrHideDialogue";
import ImageUploaderBox from "../../../Image Uploader Box/ImageUploaderBox";
import { Box, Modal } from "@mui/material";
import Cropper from "../../../Cropper/Cropper";
import { Oval } from "react-loader-spinner";
import Dropdown from "../../../React Dropdown/Dropdown";
import ReactQuill from "react-quill";
import PeopleCards from "../../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import MiniActivitiesCard from "../../My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import MiniDestinationCard from "../../My Destinations/Mini Destination Card/MiniDestinationCard";
import MediaGallery from "../../../Sidebar Group Buttons/Media Gallery/MediaGallery";
import { baseURL } from "../../../../assets/strings/Strings";
import { Prompt } from "react-router-dom";

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

function CreateJourney() {
  const [
    {
      userToken,
      reducerCreateJourny,
      reducerJournies,
      reducerDefaultPictures,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const alert = useAlert();
  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

  const [coord, setCoord] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [journeyBase64Data, setJourneyBase64Data] = useState([]);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [userFlag, setUserFlag] = useState(null);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [memoryImages, setMemoryImages] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  var iso2 = "";
  var url = "";
  const [quillValue, setQuillValue] = useState("");
  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });
  const [journeyDetails, setJourneyDetails] = useState([]);
  const [journeyImageDetails, setJourneyImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [newJourneysArray, setNewJourneysArray] = useState(reducerJournies);
  let [isBlocking, setIsBlocking] = useState(false);
  const [isPictureSelected, setPictureSelected] = useState(false);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);
  const [redirectNow, setRedirectNow] = useState(false);

  const [mediaUpdatedItem, setMediaUpdateItem] = useState([]);
  const [activityUpdatedItem, setActivityUpdatedItem] = useState([]);
  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [destinationUpdatedItem, setDestinationUpdatedItem] = useState([]);
  const [mediaComponent, setMediaComponent] = useState(false);
  const [locations, setLocations] = useState([
    {
      // endedTime: 00002,
      id: 0,
      index: 0,
      isLast: false,
      lat: 46.603354,
      lon: 1.8883335,
      name: "random test",
      journeyID: 0,
      journeyWayPointID: null,
      destinationID: null,
      // startedTime: 00001,
    },
    {
      // endedTime: 00004,
      id: 1,
      index: 1,
      isLast: false,
      lat: 46.603354,
      lon: 1.8883335,
      name: "random test",
      // startedTime: 00001,
    },
  ]);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

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

  const updateQuillValue = () => {
    setIsBlocking(true);
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

    setJourneyImageDetails({ ...journeyImageDetails, base64: e });
    setOpenImage(false);
    setPictureSelected(true);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const changeTitle = (e) => {
    setJourneyDetails({
      ...journeyDetails,
      title: e.target.value,
    });
    setIsBlocking(true);
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

  const getFlagValues = (e) => {
    // console.log(e);
    iso2 = e.isoTwo;
    url = e.countryFlag;
    // console.log("iso2", iso2);
    // setCountryFlag(baseURL + url);
    setUserFlag(baseURL + url);

    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });
    // console.log(groupCodes);
    setIsBlocking(true);
  };

  const moveToMyJourneys = () => {
    history.push("/destinations/my-journeys");
  };

  const addArray = () => {
    // console.log("Adding");
    const newVal = {
      id: locations.length,
      endedTime: null,
      index: locations.length + 1,
      isLast: true,
      key: locations.length,
      lat: 46.603354,
      lon: 1.8883335,
      name: "random test",
      startedTime: null,
    };
    // locations.push(newVal);
    // setLocations(locations);

    setLocations((locations) => [...locations, newVal]);
  };

  const removeArray = (data, index) => {
    // console.log("button pressed");

    locations.splice(index, 1);
    setLocations(locations);
    // console.log("locations", locations);
  };

  const updateArray = (lon, lat, name, index, key, startedTime, endedTime) => {
    // console.log("updateArrayItems", lon, lat, name, index, key);

    if (locations[locations.length - 2].key !== key) {
      // console.log("lastindexvalue is different");
      let arrayItems = locations;
      let item = { ...arrayItems[index] };
      item.name = name;
      item.lat = lat;
      item.lon = lon;
      item.index = index;
      item.key = index;
      item.startedTime = startedTime;
      item.endedTime = endedTime;

      arrayItems[index] = item;
      setLocations(arrayItems);
      setLocations(locations);

      // console.log("locations", locations);
      const coordVal = [];

      if (lon && lat) {
        coordVal.push(item.lon);
        coordVal.push(item.lat);
        setCoord((coord) => [...coord, coordVal]);
        coordinates.push(`${lat},${lon};`);
        setCoordinates(coordinates);
        // console.log("commaRemoved", coordinates);
      }

      callMapRoutesAPI();
      // console.log("location array updated");
    } else {
      // console.log("lastindexvalue is same");
    }
  };

  const callMapRoutesAPI = () => {
    let strCoordinates = coordinates.toString().replace(/;,/g, ";");
    let strCoordinatesParams = strCoordinates.replace(/;\s*$/, "");
    // console.log("calling Map routes API", strCoordinatesParams);

    setIsLoading(true);
    const params = JSON.stringify({
      route: strCoordinatesParams,
      lang: "de",
      maxRoutes: 3,
    });
    // console.log("Params", params);

    routingForMapsAPI(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        setIsLoading(false);

        // console.log("Routes for Map", val.data);
        var APIResponse = val.data;
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
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const mediaComponentActive = (e) => {
    // console.log("button Clicked", e);
    setMediaComponent(!mediaComponent);
    // console.log(mediaComponent);
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
        } else {
          // alert.show("Some Error Occured");
        }
      }
    );

    // connections.splice(index, 1);
    // setConnections([...connections]);
  };

  const getImage = (v, i) => {
    // console.log("vData", v, i);
    var index = memoryImages.findIndex((x) => x.documentId === v.documentId);
    if (index === -1) {
      memoryImages.push(v);
      mediaUpdatedItem.push(v.documentId);
      setMemoryImages([...memoryImages]);
      // console.log("memoryImages", memoryImages);
    }
  };

  const getActivities = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", activities);
    var index = activities.findIndex((x) => x.key === v.key);
    if (index === -1) {
      activities.push(v);
      activityUpdatedItem.push(v.key);
      setActivities([...activities]);
      // console.log("newActivities", activities);
    }
  };
  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
      connectionUpdatedItem.push(v.entKey);
      setConnectPeople([...connectPeople]);
      // console.log("connectPeople", connectPeople);
    }
  };

  const getDestinationData = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", destinations);
    var index = destinations.findIndex((x) => x.key === v.key);
    if (index === -1) {
      destinations.push(v);
      destinationUpdatedItem.push(v.key);
      setDestinations([...destinations]);
      // console.log("Array", destinations);
    }
  };

  const deleteActivityItem = (data, index) => {
    // console.log(index);

    activities.splice(index, 1);
    setActivities([...activities]);
    // console.log("newActivities", activities);
  };

  const deleteDestinationItem = (data, index) => {
    // console.log(index);
    destinations.splice(index, 1);

    var indexDestinationItem = destinations.indexOf(data.docKey);
    destinationUpdatedItem.splice(indexDestinationItem, 1);
    setDestinationUpdatedItem([...destinationUpdatedItem]);

    setDestinations([...destinations]);
  };

  const deleteCardItem = (data, index) => {
    // console.log("indexVal", index);

    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };

  const deleteMediaItem = (data, index) => {
    // console.log(index);

    memoryImages.splice(index, 1);
    setMemoryImages([...memoryImages]);
  };

  const deleteDestination = (v) => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  const callCreateJourneyAPI = (documentID) => {
    const config = JSON.stringify({
      countryCode: journeyDetails.iso2,
      pictureDocumentID: documentID,
      DestinationType: "destination",
    });
    const params = JSON.stringify({
      pk: 0,
      name: journeyDetails.title,
      description: quillValue,
      configurations: config,
      followUpDateTime: journeyDetails.dateDeparture,
      creationDateTime: journeyDetails.dateArrival,
      startDateTime: 1649453701,
      endDateTime: 1649453702,
      orderPosition: 5,
    });
    // console.log("Params", params);

    updateJourneyAPI(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        const valData = val.data;
        // console.log("valData", valData);
        setJourneyDetails({
          ...journeyDetails,
          name: "",
          description: "",
          base64: null,
          searchable: 0,
        });

        if (val.data.dstKey !== null || val.data.dstKey !== "") {
          getFlagURL(valData.dstKey, journeyDetails.iso2, config);
        }

        uploadUpdatedMemoryImages(valData.dstKey);
        uploadUpdatedActivities(valData.dstKey);
        uploadUpdatedConnection(valData.dstKey);
        uploadUpdatedDestination(valData.dstKey);

        // console.log("Destination Created", val.data);
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
      isLoading(false);
      // console.log(val.data);
    });
  };

  const callAddWayPoint = (params) => {
    addWayPointItemAPI(params, userToken, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        setIsLoading(false);
        // console.log("addWayPoint API Response", val.data);
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

  const uploadUpdatedActivities = (key) => {
    for (var i = 0; i < activityUpdatedItem.length; i++) {
      // console.log("activityUpdatedItem", activityUpdatedItem[i]);

      const params = JSON.stringify({
        ugGroupKey: activityUpdatedItem[i],
        gtGroupType: activityGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };
  const uploadUpdatedMemoryImages = (key) => {
    for (var i = 0; i < mediaUpdatedItem.length; i++) {
      // console.log("mediaUpdatedItem", mediaUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: mediaUpdatedItem[i],
        gtGroupType: memoryGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };

  const uploadUpdatedConnection = (key) => {
    for (var i = 0; i < connectionUpdatedItem.length; i++) {
      // console.log("connectionUpdatedItem", connectionUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: connectionUpdatedItem[i],
        gtGroupType: user_contactGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };

  const uploadUpdatedDestination = (key) => {
    for (var i = 0; i < destinationUpdatedItem.length; i++) {
      // console.log("destinationUpdatedItem", destinationUpdatedItem);
      // console.log("destinationUpdatedItemValue", destinationUpdatedItem[i]);
      const params = JSON.stringify({
        ugGroupKey: destinationUpdatedItem[i],
        gtGroupType: destinationGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addJourneyitem(params);
    }
  };

  const getFlagURL = (dstKey, data, config) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      // console.log("flagURL Info", val.data);
      if (val.data != null) {
        let mimeType = "image/svg+xml";
        let svgValue = `data:${mimeType};base64,${val.data}`;

        let obj = {
          key: dstKey,
          name: journeyDetails.title,
          description: quillValue,
          searchable: journeyDetails.searchable,
          configurations: config,
          latitude: journeyDetails.latitude,
          longitude: journeyDetails.longitude,
          displayName: journeyDetails.displayName,
          base64: journeyImageDetails.base64,
          countrySvg: svgValue,
          mapZoom: 12,
          followUpDateTime: journeyDetails.dateDeparture,
          creationDateTime: journeyDetails.dateArrival,
        };

        newJourneysArray.push(obj);
        setRedirectNow(true);

        isLoading(false);

        alert.show("Journey Updated successfully");
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

  const uploadJourneyPicture = () => {
    const base64result = journeyImageDetails.base64.substr(
      journeyImageDetails.base64.indexOf(",") + 1
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
      if (val) {
        // console.log(val.data);
        if (val.data.documentID != null) {
          let item = {
            date: Date.now(),
            documentId: val.data.documentId,
            image: journeyDetails.base64,
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
          callCreateJourneyAPI(val.data.documentID);
        } else {
          alert.show("Destination creation failed");
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

  const callCreateJourneyFunction = () => {
    isLoading(true);
    if (isPictureSelected) {
      uploadJourneyPicture();
    } else {
      callCreateJourneyAPI(journeyImageDetails.base64DocumentID);
    }
  };

  const createNewJourney = () => {
    if (journeyDetails.title) {
      setJourneyDetails({
        ...journeyDetails,
        description: quillValue,
      });
      // console.log("journeyDetails", journeyDetails);
      callCreateJourneyFunction();
    } else {
      alert.show("Please fill the required fields");
    }
  };

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  useEffect(() => {
    // console.log("coord in Create Journey", coord);
  }, [coord]);

  useEffect(() => {
    // console.log("locations", locations);
  }, [locations]);

  useEffect(() => {
    // console.log("reducerCreateJourny", reducerCreateJourny);
  }, [reducerCreateJourny]);

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[3]);

      setJourneyImageDetails({
        ...journeyImageDetails,
        base64: reducerDefaultPictures[3].base64Value,
        base64DocumentID: reducerDefaultPictures[3].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_JOURNIES",
        reducerJournies: newJourneysArray,
      });
      history.push("/destinations/my-destinations");
    }
  }, [redirectNow]);

  return (
    <div className="createJourney">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      <div className="viewDestination__container">
        <div className="createJourney__top">
          <div className="container__topLeft">
            <ChevronLeft onClick={moveToMyJourneys} />
            <h3>Create Journey</h3>
          </div>
        </div>

        <div className="createJourney__mainScreen">
          {/* {coord.length >= 1 ? <JourneyMap coord={coord} /> : <InitialCoordMap />} */}
          {coord.length >= 2 ? (
            <OLMapReact coord={coord} />
          ) : (
            <InitialCoordMap />
          )}

          <div className="createJourney__search">
            <div className="viewJourney__searchLeft">
              {locations.map((v, i) => (
                <LocationSearchBar
                  key={i}
                  data={v}
                  index={i}
                  updateArray={updateArray}
                  removeArray={removeArray}
                  locations={locations}
                  setLocations={setLocations}
                />
              ))}
              <div className="createJourney__actionButtons">
                <div className="createJourney__addItem">
                  <CompareArrows />
                </div>
                <div className="createJourney__addItem">
                  <Add onClick={addArray} />
                </div>
              </div>
            </div>

            <div className="viewJourney__searchRight">
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
                    controls
                    alt=""
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

              {!userFlag ? (
                <Oval color="#00BFFF" height={20} width={20} />
              ) : (
                <div className="groupMid__flagDiv">
                  {countrydropdownMenu || !userFlag ? (
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
                      {userFlag && (
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
                        src={userFlag}
                        onClick={CountryDropdown}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="viewJourney__topSearch">
            <div className="inputDiv destinationTitle">
              <input
                type="text"
                placeholder="Enter Title"
                value={journeyDetails.title}
                onChange={changeTitle}
              />
            </div>
          </div>
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

          <div className="container__activities">
            <h5>Activities</h5>
            {activities.length <= 0 ? (
              <p className="addDetails__heading">Please Add Activites </p>
            ) : (
              <div className="midActivities__tags">
                {activities.map((v, i) => (
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
            {memoryImages.length <= 0 ? (
              <p className="addDetails__heading">Please Add Gallery </p>
            ) : (
              <div className="postCards__cards">
                {memoryImages.map((v, i) => (
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
          <button className="primaryButtonActive" onClick={createNewJourney}>
            Create Journey
          </button>

          <div className="svg__IconRight">
            <Close onClick={() => deleteDestination(journeyDetails.key)} />
          </div>
        </div>
      )}

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={journeyDetails.key}
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

export default CreateJourney;
