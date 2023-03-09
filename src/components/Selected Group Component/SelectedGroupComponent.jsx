import { Add, Close, Edit, Groups } from "@mui/icons-material";
import { Box, IconButton, Modal, Switch } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory, useParams } from "react-router-dom";
import {
  activityGroupKey,
  destinationGroupKey,
  memoryGroupKey,
  UNAUTH_KEY,
  user_contactGroupKey,
} from "../../assets/constants/Contants";
import { baseURL } from "../../assets/strings/Strings";
import {
  addBase64File,
  addMetaGroupItemAPI,
  deleteMetaGroupItemAPI,
  getCountryFlags,
  getDocumentByName,
  getPrivateDocument,
  readSingleActivityAPI,
  readSingleUserAPI,
  retrieveSingleDestinationAPI,
  retrieveSingleMetaGroupAPI,
  updateMetaGroupAPI,
} from "../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../config/context api/StateProvider";
import PeopleCards from "../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import Cropper from "../Cropper/Cropper";
import MiniActivitiesCard from "../Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import Dropdown from "../React Dropdown/Dropdown";
import CollapsibleButtons from "../Sidebar Group Buttons/Collapsible Buttons/CollapsibleButtons";
import MediaGallery from "../Sidebar Group Buttons/Media Gallery/MediaGallery";
import "./SelectedGroupComponent.css";
import { useAlert } from "react-alert";
import MiniDestinationCard from "../Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";
import { Prompt } from "react-router-dom";
import ImageUploaderBox from "../Image Uploader Box/ImageUploaderBox";
import DeleteOrHideDialogue from "../Delete Or Hide Dialogue/DeleteOrHideDialogue";

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

function SelectedGroupComponent({ selectedGroup }) {
  const [
    { userToken, reducerGroup, reducerVisitorID, reducerMemoryImages },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const alert = useAlert();
  const [flagValue, setFlagValue] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedActivitiesArrayData, setSelectedActivitiesArrayData] =
    useState([]);

  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const handleImageOpen = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
  const [connections, setConnections] = useState([]);

  const [groupFlag, setGroupFlag] = useState(selectedGroup.countrySvg);
  const [countryFlag, setCountryFlag] = useState(null);
  var iso2 = "";
  var url = "";

  const [firstLoad, setFirstLoad] = useState(false);
  const [groupBase64, setGroupBase64] = useState(null);
  const { key } = useParams();

  const [mediaUpdatedItem, setMediaUpdateItem] = useState([]);
  const [activityUpdatedItem, setActivityUpdatedItem] = useState([]);
  const [connectionUpdatedItem, setConnectionUpdatedItem] = useState([]);
  const [destinationUpdatedItem, setDestinationUpdatedItem] = useState([]);

  const [photoUrl, setPhotoUrl] = useState("");
  const history = useHistory();

  const [groupDetails, setGroupDetails] = useState([]);
  const [APIResponse, setAPIResponse] = useState([]);
  let [isBlocking, setIsBlocking] = useState(false);

  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  const deleteGroupButton = () => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
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

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const changeTitle = (e) => {
    setGroupDetails({
      ...groupDetails,
      name: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDescription = (e) => {
    setGroupDetails({
      ...groupDetails,
      description: e.target.value,
    });
    setIsBlocking(true);
  };

  // searchable working here //

  const changeSearchable = () => {
    // console.log(groupDetails.searchable);
    if (groupDetails.searchable === 0 || groupDetails.searchable === -1) {
      setGroupDetails({ ...groupDetails, searchable: 1 });
      // console.log("setting value to 1");
      setIsBlocking(true);
    } else {
      setGroupDetails({ ...groupDetails, searchable: 0 });
      // console.log("setting value to 0");
      setIsBlocking(true);
    }
    // console.log(groupDetails);
  };
  // searchable working here //

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const getMetaGroupData = () => {
    // console.log("Calling MetaGroup API", selectedGroup.key);
    retrieveSingleMetaGroupAPI(
      userToken,
      selectedGroup.key,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        // console.log("singleMetaGroup", val.data);
        // console.log("singleMetaGroup", val.data.configurations);

        setGroupDetails(val.data);
        const APIData = val.data;
        if (APIData) {
          setAPIResponse(APIData);
          setInitialLoading(false);

          if (val.data.configurations) {
            var configurations = JSON.parse(val.data.configurations);
            if (configurations !== null) {
              const groupDataVal = {
                countryCode: configurations.countryCode,
                documentID: configurations.pictureDocumentID,
              };

              if (
                groupDataVal.countryCode !== null ||
                groupDataVal.countryCode !== ""
              ) {
                getFlagURL(groupDataVal.countryCode, 0, 2);
              }
              if (
                groupDataVal.documentID !== null ||
                groupDataVal.documentID !== ""
              ) {
                getImageByDocumentId(groupDataVal.documentID, 0, 2);
              }
            }
            setGroupCodes({
              countryCode: configurations?.countryCode,
              pictureDocumentID: configurations?.pictureDocumentID,
            });

            var memoryKeys = JSON.parse(val.data.media);
            var activitiesKeys = JSON.parse(val.data.activities);
            var connectionKeys = JSON.parse(val.data.connections);
            var destinationKeys = JSON.parse(val.data.destinations);

            // console.log(memoryKeys, "Memories Keys Array Selected Group");
            // console.log(activitiesKeys, "activities Keys Array Selected Group");
            // console.log(connectionKeys, "Connection Keys Array Selected Group");
            // console.log(
            //   destinationKeys,
            //   "Destinations Keys Array Selected Group"
            // );

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
                0
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
              setSelectedActivitiesArrayData(
                selectedActivitiesArrayData.slice()
              );
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

              getSingleDestinationById(
                destinationKeys[key].docKey,
                destinations.length - 1
              );
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

  // const getSingleUser = () => {
  //   readSingleUserAPI
  // }

  const getSingleDestinationById = (key, index) => {
    retrieveSingleDestinationAPI(userToken, key, reducerVisitorID).then(
      function (val) {
        // console.log("Destinations Value", val.data);
        if (val) {
          // console.log("Destinations Value", val.data[key]);
          // console.log("Index Value", index);
          if (val.data.name !== null) {
            let destinationItem = destinations;
            let item = { ...destinationItem[index] };

            item.name = val.data?.name;
            destinationItem[index] = item;
            setDestinations(destinationItem.slice());

            if (val.data.configurations) {
              var configurations = JSON.parse(val.data?.configurations);
              // console.log("Destinations Configurations", configurations);
              if (
                configurations.pictureDocumentID !== null ||
                configurations.pictureDocumentID !== ""
              ) {
                getImageByDocumentId(
                  configurations.pictureDocumentID,
                  index,
                  4
                );
              }
              if (
                configurations.countryCode !== null ||
                configurations.countryCode !== ""
              ) {
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
        if (val.data.firstName !== null) {
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
          if (
            val.data.avatar_dms_key !== null ||
            val.data.avatar_dms_key !== ""
          ) {
            getImageByDocumentId(val.data.avatar_dms_key, index, 3);
          }
          if (val.data.countryCode !== null || val.data.countryCode !== "") {
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
        console.log("Activity Info", val.data);
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
            if (
              activityDataValue.countryCode !== null ||
              activityDataValue.countryCode !== ""
            ) {
              getFlagURL(activityDataValue.countryCode, index, 1);
            }
            if (
              activityDataValue.documentID !== null ||
              activityDataValue.documentID !== ""
            ) {
              getImageByDocumentId(activityDataValue.documentID, index, 1);
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

  const getFlagURL = (data, index, status) => {
    // console.log('Flagid',id);

    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("flagURL Info", val.data);
        if (val.data !== null) {
          var mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;
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
  };

  const getImageByDocumentId = (id, index, status) => {
    // console.log("Calling image API for ID:", id);
    getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("this is Image val", val);
        // setMemoryImages([]);

        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          let srcValue = `data:image/jpg;base64, ${imageFile}`;

          if (status === 0) {
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
            setGroupBase64(srcValue);
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
    getFlagsData();
  }, [flagValue]);

  const getFlagValues = (e) => {
    // console.log(e);
    iso2 = e.isoTwo;
    url = e.countryFlag;
    // console.log("iso2", iso2);
    setCountryFlag(baseURL + url);
    setGroupFlag(baseURL + url);

    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });
    // console.log(groupCodes);
    setIsBlocking(true);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

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
    // console.log("handleDone", e);
    // setGroupDetails({ ...groupDetails, base64: e });
    setGroupBase64(e);

    setGroupCodes({ ...groupCodes, base64Result: base64result });
    // console.log("handleDone", groupCodes);
    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
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

  const deleteActivityItem = (v, index) => {
    deleteMetaGroupItemAPI(userToken, v.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }

        selectedActivitiesArrayData.splice(index, 1);
        setSelectedActivitiesArrayData([...selectedActivitiesArrayData]);
        // console.log("new Activities", selectedActivitiesArrayData);

        // console.log("new Activities", activityUpdatedItem);

        var indexcMediaItem = activityUpdatedItem.indexOf(v.docKey);
        activityUpdatedItem.splice(indexcMediaItem, 1);
        setActivityUpdatedItem([...activityUpdatedItem]);

        // console.log("new Activities", activityUpdatedItem);
      }
    );
  };

  const deleteDestinationItem = (v, index) => {
    // console.log(index);

    deleteMetaGroupItemAPI(userToken, v.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Destination Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }

        selectedActivitiesArrayData.splice(index, 1);
        setSelectedActivitiesArrayData([...selectedActivitiesArrayData]);
        // console.log("new Activities", selectedActivitiesArrayData);

        // console.log("new Activities", activityUpdatedItem);

        var indexcMediaItem = activityUpdatedItem.indexOf(v.docKey);
        activityUpdatedItem.splice(indexcMediaItem, 1);
        setActivityUpdatedItem([...activityUpdatedItem]);

        // console.log("new Activities", activityUpdatedItem);
      }
    );

    destinations.splice(index, 1);
    setDestinations([...destinations]);
  };

  const deleteCardItem = (v, index) => {
    deleteMetaGroupItemAPI(userToken, v.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Connection Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }

        connections.splice(index, 1);
        setConnections([...connections]);
        // console.log("newMemoryImages", connections);

        // console.log("newMemoryImages", connectionUpdatedItem);

        var indexConnectionItem = connectionUpdatedItem.indexOf(v.docKey);
        connectionUpdatedItem.splice(indexConnectionItem, 1);
        setConnectionUpdatedItem([...connectionUpdatedItem]);

        // console.log("newMemoryImages", connectionUpdatedItem);
      }
    );
  };

  const deleteMediaItem = (v, index) => {
    // console.log("Media Item", index);
    // console.log("Media Item", v);
    // console.log("Media Item", v);

    // console.log("Media Item docKey", v.docKey);
    // setOpenDeleteConfirmation(true);
    // setKeyValue(v.groupItemsKey, "media");
    // setIndexValue(index);
    // setMediaItemKey(v.docKey);
    // if (mediaItem) {
    // console.log("Media file deleted");
    // } else if (activityItem) {
    // console.log("Activity file deleted");
    // }

    deleteMetaGroupItemAPI(userToken, v.groupItemsKey, reducerVisitorID).then(
      function (val) {
        setIsLoading(true);
        // console.log("delete API response >>", val.data);
        setIsLoading(false);
        if (val.data.rows === "1") {
          alert.show("Activity Deleted Successfully");
        } else {
          // alert.show("Some Error Occured");
        }

        memoryImagesTwo.splice(index, 1);
        setMemoryImagesTwo([...memoryImagesTwo]);
        // console.log("newMemoryImages", memoryImagesTwo);

        // console.log("newMemoryImages", mediaUpdatedItem);

        var indexcMediaItem = mediaUpdatedItem.indexOf(v.docKey);
        mediaUpdatedItem.splice(indexcMediaItem, 1);
        setMediaUpdateItem([...mediaUpdatedItem]);

        // console.log("newMemoryImages", mediaUpdatedItem);
      }
    );
  };

  const getImage = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", memoryImagesTwo);
    var index = memoryImagesTwo.findIndex((x) => x.docKey === v.documentId);
    if (index === -1) {
      mediaUpdatedItem.push(v.documentId);
      memoryImagesTwo.push(v);
      setMemoryImagesTwo([...memoryImagesTwo]);
    }
  };

  const getActivities = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", selectedActivitiesArrayData);
    if (v.base64 && v.countrySvg !== null) {
      var index = selectedActivitiesArrayData.findIndex((x) => x.key === v.key);
      if (index === -1) {
        selectedActivitiesArrayData.push(v);
        activityUpdatedItem.push(v.key);
        setActivityUpdatedItem([...selectedActivitiesArrayData]);
        // console.log("activityIndex:", selectedActivitiesArrayData);
      }
    }
  };

  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    // console.log("vData", connections);
    var index = connections.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connections.push(v);
      connectionUpdatedItem.push(v.entKey);
      setConnections([...connections]);
      // console.log("connections", connections);
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
      // console.log("newDestinations", destinations);
    }
  };

  const updateGroup = () => {
    setIsLoading(true);
    // console.log("Updating groups:", groupCodes);
    // console.log("groups:", groupDetails);
    // updateMetaGroupAPI;

    if (groupCodes.base64Result !== null) {
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
        // console.log("Updating groups", val.data);
        if (val.data !== null) {
          let item = {
            date: Date.now(),
            documentId: val.data.documentId,
            image: groupBase64,
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
          callUpdateGroupApi(val.data.documentID);
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        } else {
          alert.show("Group update failed");
          setIsLoading(false);
        }
      });
    } else {
      callUpdateGroupApi(groupCodes.pictureDocumentID);
    }

    // console.log(mediaUpdatedItem);
    // console.log(mediaUpdatedItem.length);

    uploadUpdatedMemoryImages();
    uploadUpdatedActivities();
    uploadUpdatedConnection();
    uploadUpdatedDestination();
    setCountrydropdownMenu(false);
  };

  const uploadUpdatedActivities = () => {
    for (var i = 0; i < activityUpdatedItem.length; i++) {
      // console.log("activityUpdatedItem", activityUpdatedItem[i].key);

      const params = JSON.stringify({
        ugGroupKey: activityUpdatedItem[i].key,
        gtGroupType: activityGroupKey,
        mtGroupKey: APIResponse.pk,
      });
      // console.log("parameter", params);
      addMetaGroupItem(params);
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
      addMetaGroupItem(params);
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
      addMetaGroupItem(params);
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
      addMetaGroupItem(params);
    }
  };

  const addMetaGroupItem = (params) => {
    addMetaGroupItemAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
      setIsLoading(false);
      // console.log(val.data);
    });
  };

  const callUpdateGroupApi = (documentID) => {
    // console.log("Updating groups:", groupCodes);
    // console.log("groups:", groupDetails);

    const config = JSON.stringify({
      countryCode: groupCodes.countryCode,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: groupDetails.pk,
      name: groupDetails.name,
      description: groupDetails.description,
      acl: 7429,
      searchable: groupDetails.searchable,
      configurations: config,
      memberStatus: 1,
    });
    // console.log("Params", params);

    updateMetaGroupAPI(params, userToken, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        setIsLoading(false);
        setIsBlocking(false);
        alert.show("Group updated successfully");
        updateSideBars();
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

  const updateSideBars = () => {
    // console.log("All Groups", reducerGroup);
    // console.log("All Groups Details", groupDetails);

    var index = reducerGroup.findIndex((x) => x.key === groupDetails.pk);
    if (index === -1) {
    } else {
      let tempReducerGroup = reducerGroup;
      let item = { ...tempReducerGroup[index] };

      item.name = groupDetails.name;
      item.base64 = groupBase64;
      item.countrySvg = groupFlag;
      // item.base64 = groupDetails.groupBase64;
      // item.countrySvg = groupFlag;
      item.description = groupDetails.description;

      tempReducerGroup[index] = item;

      dispatch({
        type: "SET_GROUP_DATA",
        reducerGroup: tempReducerGroup,
      });

      // console.log("updated Array", tempReducerGroup);
    }
  };
  const moveToViewMembers = () => {
    // console.log("groupKey", groupKey);
    history.push(`/${selectedGroup.key}/groupMembers`);
  };

  const collapsibleTurnedOff = () => {
    if (collapsibleButton) {
      setCollapsibleButton(false);
    }
  };

  useEffect(() => {
    setGroupFlag(null);
    setGroupBase64(null);
    setMemoryImagesTwo([]);
    setSelectedActivitiesArrayData([]);
    setMediaUpdateItem([]);
    setActivityUpdatedItem([]);
    setConnections([]);
    setDestinations([]);
    setConnectionUpdatedItem([]);
    setFirstLoad(false);
    setIsBlocking(false);
  }, [selectedGroup]);

  useEffect(() => {
    // console.log("Connections", connections);
    // console.log("Connections", connections.length);
    // console.log("Activities", activitiesArrayData);
    // console.log("Memories", memoryImagesTwo);

    if (!firstLoad) {
      // console.log("Getting Meta Groups!", selectedGroup);
      setFirstLoad(true);
      setInitialLoading(true);
      getMetaGroupData();
      setIsBlocking(false);
    }
  }, [firstLoad]);

  if (initialLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="selectedGroupComponent">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      <div
        className="selectedGroupComponent__details"
        // onClick={collapsibleTurnedOff}
      >
        <div className="group__container">
          {/* <h3>Manage Group</h3> */}

          <div className="groupContainer__mid">
            <div className="groupMid__detail">
              <div className="selectedGroup__bio">
                <div className="selectedGroup__bioLeft">
                  <div className="groupMid_detail_groupName">
                    <div className="groupNameDiv">
                      <h5 className="groupMid__h5">Group Name</h5>
                      <div className="inputDiv">
                        <input
                          type="text"
                          placeholder="Write name here."
                          value={groupDetails.name}
                          onChange={changeTitle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="groupMid_detail_groupDetails">
                    <div className="groupMid__details">
                      <h5 className="groupMid__h5">Group Details</h5>
                      <div className="inputDivDetail">
                        <textarea
                          type="text"
                          placeholder="Write name here."
                          value={groupDetails.description}
                          onChange={changeDescription}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="selectedGroup__bioRight">
                  <div className="searchableToggle">
                    {groupDetails.searchable === 0 ? (
                      <div className="switchButton">
                        <h5>Private</h5>
                        <Switch {...label} onChange={changeSearchable} />
                      </div>
                    ) : (
                      <div className="switchButton">
                        <h5>Public</h5>

                        <Switch
                          {...label}
                          checked={groupDetails.searchable === 1}
                          onChange={changeSearchable}
                        />
                      </div>
                    )}
                  </div>
                  <div className="selectedGroupComponent__image">
                    <div
                      style={{
                        display: "flex",
                        width: 150,
                        height: 150,
                        borderWidth: 1,
                        borderColor: "#000",
                        // backgroundColor: "#ffff00",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="selectedGroupImage"
                        style={{
                          display: "flex",
                          width: 140,
                          height: 140,
                          borderWidth: 1,
                          borderColor: "#8a8a8a",
                          //backgroundColor: "#ff1100",
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {!groupBase64 ? (
                          <Oval color="#00BFFF" height={80} width={80} />
                        ) : (
                          <img
                            //className="selectedGroupImage"
                            style={{
                              width: "140px",
                              height: "140px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                            alt=""
                            // src={selectedGroup.base64}
                            src={groupBase64}
                            onClick={handleImageOpen}
                          />
                        )}
                      </div>
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
                          src={groupBase64}
                          width="500"
                          height="500"
                          alt=""
                          // onClick={handleImageOpen}
                          controls
                        />
                      </Box>
                    </Modal>

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
                    </div>

                    <Modal
                      className="groupCropperModal"
                      open={openImageCropper}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      {/* <Box sx={style}> */}
                      <Cropper
                        inputImg={photoUrl}
                        // onClose={handleClose}
                        onClose={handleCropperClose}
                        onDone={handleDone}
                        mimeType={mimeType}
                      />
                      {/* </Box> */}
                    </Modal>
                  </div>

                  <div className="selectedGroup__flagAndMember">
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
                            {selectedGroup.countrySvg && (
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
                              onClick={CountryDropdown}
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="memebersIconButton">
                      <IconButton>
                        <Groups onClick={moveToViewMembers} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activitySec">
                <h5>Activities</h5>
                {/* {activities.length <= 0 ? ( */}
                {selectedActivitiesArrayData.length <= 0 ? (
                  <p className="addDetails__heading">Please Add Activites </p>
                ) : (
                  <div className="midActivities__tags">
                    {selectedActivitiesArrayData.map((v, i) => (
                      <MiniActivitiesCard
                        key={v + i}
                        // onClick={() => deleteActivityItem(i)}
                        data={v}
                        index={i}
                        // handleClick={() => deleteActivityItem(v, i)}
                        clickFunction={deleteActivityItem}
                        deleteItem
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="destinationsSec">
                <h5>Destinations</h5>
                {destinations.length <= 0 ? (
                  <p className="addDetails__heading">Please Add Destinations</p>
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

              <div className="groupSec">
                <h5>Group Members</h5>
                {/* {connectPeople?.length <= 0 ? ( */}
                {connections?.length <= 0 ? (
                  <p className="addDetails__heading">Please Add Members </p>
                ) : (
                  <div className="groupSec__cards">
                    {connections.map((v, i) => (
                      <PeopleCards
                        key={v + i}
                        index={i}
                        data={v}
                        // deleteItem={deleteCardItem}
                        deleteItem
                        clickFunction={deleteCardItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="MediaSec">
                <h5>Media</h5>
                {memoryImagesTwo?.length <= 0 ? (
                  <p className="addDetails__heading">Please Add Gallery </p>
                ) : (
                  <div className="postCards__cards">
                    {memoryImagesTwo?.map((v, i) => (
                      <MediaGallery
                        key={i}
                        data={v}
                        index={i}
                        clickFunction={deleteMediaItem}
                        // deleteItem={() => deleteMediaItem(v, i)}
                        deleteItem
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="SelectedGroup__bottom">
            {collapsibleButton ? (
              <CollapsibleButtons
                // onClose={collapsibleTurnedOff}
                getImage={getImage}
                getActivities={getActivities}
                getConnection={getConnection}
                getDestinationData={getDestinationData}
                handleTriggerClose={handleTriggerClose}
                // mediaComponentActive={mediaComponentActive}
              />
            ) : (
              <div className="groupContainer__bottom">
                <div className="svg__Icon">
                  <Add onClick={handleTriggerOpen} />
                </div>
                <button className="primaryButtonActive" onClick={updateGroup}>
                  Update Group
                </button>
                <div className="svg__IconRight">
                  <Close onClick={() => deleteGroupButton()} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Postcard Picture"
          showImageUploader={showImageUploader}
          setShowImageUploader={setShowImageUploader}
          inputRef={inputRef}
          handleDone={handleDone}
          uploadImageFromPC={uploadImageFromPC}
          getImageData={getImageData}
        />
      )}

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={selectedGroup.key}
          state="groups"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}
    </div>
  );
}

export default SelectedGroupComponent;
