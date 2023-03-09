import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

import "./CreateGroup.css";

import {
  memoryGroupKey,
  activityGroupKey,
  destinationGroupKey,
  user_contactGroupKey,
  UNAUTH_KEY,
} from "assets/constants/Contants";

import {
  addBase64File,
  addMetaGroupItemAPI,
  createMetaGroupAPI,
  getCountryFlags,
  getDocumentByName,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Switch,
} from "@mui/material";

import { Add, ChevronLeft, Edit } from "@mui/icons-material";

import ButtonAtom from "components/Atoms/Button/Button";

import PeopleCards from "../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import Cropper from "../Cropper/Cropper";
import CollapsibleButtons from "./Collapsible Buttons/CollapsibleButtons";
import MediaGallery from "./Media Gallery/MediaGallery";
import Dropdown from "../React Dropdown/Dropdown";
import CreatedGroupScreen from "./Created Group Screen/CreatedGroupScreen";
import MiniActivitiesCard from "../Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";
import MiniDestinationCard from "../Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";
import ImageUploaderBox from "../Image Uploader Box/ImageUploaderBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  height: "70vh",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function CreateGroup() {
  const [
    {
      userToken,
      reducerGroup,
      reducerDefaultPictures,
      reducerUserDATA,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] = useState([]);
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setIsBlocking(false);
  };
  // const handleClose = () => setOpen(false);
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const history = useHistory();
  const [openImage, setOpenImage] = useState(false);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  // const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  // const [groupImage, setGroupImage] = useState(null);
  const handleImageOpen = () => setOpenImage(true);
  const [memoryImages, setMemoryImages] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [openCreatedGroup, setOpenCreatedGroup] = useState(false);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [flagValue, setFlagValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectNow, setRedirectNow] = useState(false);
  const [newGroupsArray, setNewGroupsArray] = useState([]);

  const [isPictureSelected, setPictureSelected] = useState(false);

  let [isBlocking, setIsBlocking] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);

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

  const handleClickOpen = () => {
    setDialogueOpen(true);
  };

  const handleBothClose = () => {
    setDialogueOpen(false);
    handleClose();
  };

  const handleDialogueClose = () => {
    setDialogueOpen(false);
  };

  const changeTitle = (e) => {
    setGroupDetails({
      ...groupDetails,
      groupName: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDescription = (e) => {
    setGroupDetails({
      ...groupDetails,
      groupDescription: e.target.value,
    });
    setIsBlocking(true);
  };

  // var iso2 = "";
  const [groupDetails, setGroupDetails] = useState({
    groupName: "",
    groupDescription: "",
    groupBase64: null,
    searchable: 1,
    iso2: "",
  });

  const [groupImageDetails, setGroupImageDetails] = useState({
    groupBase64: null,
    groupBase64DocumentID: null,
  });

  useEffect(() => {
    // console.log("Group Details:", groupDetails);
    setMemoryImagesArray(reducerMemoryImages);
  }, [reducerMemoryImages]);

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

      setGroupImageDetails({
        ...groupImageDetails,
        groupBase64: reducerDefaultPictures[1].base64Value,
        groupBase64DocumentID: reducerDefaultPictures[1].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    if (reducerUserDATA) {
      // console.log("reducerUserDATA Flag: ", reducerUserDATA);
      // console.log("Flag useEffect triggered");

      setGroupDetails({
        ...groupDetails,
        countrySvg: reducerUserDATA.countrySvg,
        iso2: reducerUserDATA.countryCode,
      });
    }
  }, [reducerUserDATA]);

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const [collapsibleButton, setCollapsibleButton] = useState(false);

  const [mediaComponent, setMediaComponent] = useState(false);

  const mediaComponentActive = (e) => {
    // console.log("button Clicked", e);
    setMediaComponent(!mediaComponent);
    // console.log(mediaComponent);
  };

  // const handleTriggerClick = () => {
  //   setCollapsibleButton(!collapsibleButton);
  // };
  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };

  const handleTriggerClose = () => {
    setCollapsibleButton(false);
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
    // const base64result = e.substr(e.indexOf(",") + 1);

    setGroupImageDetails({ ...groupImageDetails, groupBase64: e });
    setOpenImage(false);
    setPictureSelected(true);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const handleImageClose = (e) => {
    // console.log(e);

    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    // console.log(e);
    // setPhotoUrl(null);
    setOpenImageCropper(false);
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
    setDestinations([...destinations]);
  };

  const deleteCardItem = (data, index) => {
    // console.log("indexVal", index);

    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };

  const deleteMediaItem = (data, index) => {
    // console.log(index);

    // deleteDMSDocument(userToken, i.documentId, reducerVisitorID).then(function (val) {
    // console.log("delete API response >>", val.data);

    memoryImages.splice(index, 1);
    setMemoryImages([...memoryImages]);
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

  // Country Flag API Working Here //

  const getFlagsData = () => {
    // console.log("Calling Country Flags API :");
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      // console.log("Country Info", val);

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

        // console.log("FlagData >", flagValue);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        // console.log("document is null");
      }
    });
  };

  useEffect(() => {
    // console.log(userToken);
    getFlagsData();
  }, [flagValue]);
  // Country Flag API Working Here //

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  const getFlagValues = (e) => {
    // console.log(e.isoTwo);

    setGroupDetails({
      ...groupDetails,
      iso2: e.isoTwo,
      countrySvg: e.countryFlag,
    });
    setIsBlocking(true);
  };

  // const openCreatedGroupModal = () => {
  //   setOpenCreatedGroup(!openCreatedGroup);
  //   // console.log(openCreatedGroup);
  // };

  const addMetaGroupItem = (params) => {
    addMetaGroupItemAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        setIsLoading(false);
        // console.log(val.data);
        setMemoryImages([]);
        setActivities([]);
        setConnectPeople([]);
        setDestinations([]);
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

  const addMemoryGroupItems = (key) => {
    for (var i = 0; i < memoryImages.length; i++) {
      const params = JSON.stringify({
        ugGroupKey: memoryImages[i].documentId,
        gtGroupType: memoryGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addMetaGroupItem(params);
    }
  };

  const addActivitiesGroupItems = (key) => {
    for (var i = 0; i < activities.length; i++) {
      const params = JSON.stringify({
        ugGroupKey: activities[i].key,
        gtGroupType: activityGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addMetaGroupItem(params);
    }
  };

  const addConnectionGroupItems = (key) => {
    for (var i = 0; i < connectPeople.length; i++) {
      // console.log("connectPeople", connectPeople[i].entKey);
      const params = JSON.stringify({
        ugGroupKey: connectPeople[i].entKey,
        gtGroupType: user_contactGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addMetaGroupItem(params);
    }
  };

  const addDestinationGroupItems = (key) => {
    for (var i = 0; i < destinations.length; i++) {
      // console.log("connectPeople", destinations[i].key);
      const params = JSON.stringify({
        ugGroupKey: destinations[i].key,
        gtGroupType: destinationGroupKey,
        mtGroupKey: key,
      });
      // console.log("parameter", params);
      addMetaGroupItem(params);
    }
  };

  const getFlagURL = (groupId, data) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      // console.log("flagURL Info", val.data);
      if (val.data != null) {
        let mimeType = "image/svg+xml";
        let svgValue = `data:${mimeType};base64,${val.data}`;

        // console.log(svgValue);

        const obj = {
          key: parseInt(groupId),
          name: groupDetails.groupName,
          description: groupDetails.groupDescription,
          searchable: groupDetails.searchable,
          base64: groupImageDetails.groupBase64,
          countrySvg: svgValue,
        };

        const newArray = reducerGroup.concat(obj);

        setNewGroupsArray(newArray);

        // console.log("newArray", newArray);
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

  const createGroupAPI = (documentID) => {
    // if (isCountrySelected){}
    const config = JSON.stringify({
      countryCode: groupDetails.iso2,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: 0,
      name: groupDetails.groupName,
      description: groupDetails.groupDescription,
      searchable: groupDetails.searchable,
      memberStatus: 0,
      configurations: config,
    });
    // console.log("Params", params);

    createMetaGroupAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        // setIsLoading(false);
        setGroupDetails({
          ...groupDetails,
          groupName: "",
          groupDescription: "",
          groupBase64: null,
          searchable: 0,
        });
        setIsLoading(false);

        // console.log("groupCreated", val.data);
        alert.show("Group created successfully");

        if (val.data.ugKey !== null || val.data.ugKey !== "") {
          getFlagURL(val.data.ugKey, groupDetails.iso2);
        }

        // newGroupsArray.push({ ...reducerGroup, obj });
        addMemoryGroupItems(val.data.ugKey);
        addActivitiesGroupItems(val.data.ugKey);
        addConnectionGroupItems(val.data.ugKey);
        addDestinationGroupItems(val.data.ugKey);
        setRedirectNow(true);
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

  const uploadGroupProfilePicture = () => {
    const base64result = groupImageDetails.groupBase64.substr(
      groupImageDetails.groupBase64.indexOf(",") + 1
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
      // console.log(val.data);
      if (val.data.documentID !== null) {
        let item = {
          date: Date.now(),
          documentId: val.data.documentId,
          image: groupImageDetails.base64,
          isLoaded: true,
        };
        if (memoryImagesArray === undefined || memoryImagesArray.length === 0) {
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
        createGroupAPI(val.data.documentID);
        setOpen(false);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        alert.show("Group creation failed");
      }
    });
  };

  const callCreateGroupAPIs = () => {
    setIsLoading(true);

    if (isPictureSelected) {
      uploadGroupProfilePicture();
    } else {
      createGroupAPI(groupImageDetails.groupBase64DocumentID);
    }
  };

  const createNewGroup = () => {
    // console.log("base64 test", groupDetails.groupBase64);
    if (
      groupDetails.groupName &&
      groupDetails.groupDescription &&
      groupDetails.iso2 &&
      groupImageDetails.groupBase64
    ) {
      callCreateGroupAPIs();
    } else {
      alert.show("Plase fill the required fields");
    }
  };

  const getImage = (v, i) => {
    // console.log("vData", v, i);
    var index = memoryImages.findIndex((x) => x.documentId === v.documentId);
    if (index === -1) {
      memoryImages.push(v);
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
      setActivities([...activities]);
      // console.log("newActivities", activities);
    }
  };

  const getConnection = (v, i) => {
    // var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    // if (index === -1) {
    //   connectPeople.push(v);
    //   setConnectPeople([...connectPeople]);

    //   newMemberKeys.push(v.pk);

    // console.log("connectPeople", connectPeople);
    // }

    // console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
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
      // destinationUpdatedItem.push(v.key);
      setDestinations([...destinations]);
      // console.log("newDestinations", destinations);
    }
  };

  const confirmationBox = () => {
    // console.log("confirmationBox");
    handleClickOpen();
  };

  useEffect(() => {
    // console.log("newGroupsArray", newGroupsArray);
    setRedirectNow(false);
    dispatch({
      type: "SET_GROUP_DATA",
      reducerGroup: newGroupsArray,
    });
    handleClose();
  }, [newGroupsArray]);

  if (isLoading) {
    return (
      <div className="ScreenLoader">
        {/* <Oval color="#000000" height={200} width={200} /> */}
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="groupButtons">
      <ButtonAtom
        fontSize="medium"
        onClick={() => history.push("/connect/discover")}
      >
        DISCOVER GROUPS
      </ButtonAtom>
      <ButtonAtom variant="filled" fontSize="medium" onClick={handleOpen}>
        + CREATE GROUP
      </ButtonAtom>

      <Modal
        open={open}
        onClose={!isBlocking ? handleClose : confirmationBox}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="group__container">
            <div className="groupContainer__top">
              <ChevronLeft onClick={handleClose} />
              <h3>Create Group</h3>
            </div>

            <div className="groupContainer__mid">
              <div className="groupMid__detail">
                <div className="group__bio">
                  <div className="group__bioLeft">
                    <div className="groupNameDiv">
                      <h5 className="groupMid__h5">Group Name</h5>
                      <div className="inputDiv">
                        <input
                          type="text"
                          placeholder="Write name here."
                          value={groupDetails.groupName}
                          onChange={changeTitle}
                        />
                      </div>
                    </div>
                    <div className="groupMid__details">
                      <h5 className="groupMid__h5">Group Details</h5>
                      <div className="inputDivDetail">
                        <textarea
                          type="text"
                          placeholder="Write name here."
                          value={groupDetails.groupDescription}
                          onChange={changeDescription}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="group__bioRigth">
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
                            defaultChecked
                            onChange={changeSearchable}
                          />
                        </div>
                      )}
                    </div>

                    <div className="group__containerImage">
                      <div
                        style={{
                          display: "flex",
                          width: 130,
                          height: 130,
                          borderWidth: 2,
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
                            width: 130,
                            height: 130,
                            borderWidth: 1,
                            borderColor: "#8a8a8a",
                            //backgroundColor: "#ff1100",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            //className="selectedGroupImage"
                            style={{
                              width: 130,
                              height: 130,
                              borderRadius: 10,
                              objectFit: "cover",
                            }}
                            alt=""
                            src={groupImageDetails.groupBase64}
                            onClick={
                              groupImageDetails.groupBase64 && handleImageOpen
                            }
                          />
                        </div>
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
                            alt=""
                            src={photoUrl}
                            width="500"
                            height="500"
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

                    <div className="groupMid__countries">
                      {countrydropdownMenu || !groupDetails.countrySvg ? (
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
                          {/* {groupDetails.countrySvg && (
                            <Close
                              onClick={CountryDropdown}
                              style={{ cursor: "pointer" }}
                            />
                          )} */}
                        </div>
                      ) : (
                        <div className="selectedGroup__flag">
                          <img
                            className="groupCountryFlagSvg"
                            src={groupDetails.countrySvg}
                            onClick={CountryDropdown}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="groupMid_detail_groupName"></div>

                <div className="groupMid_detail_groupDetails"></div>

                <div className="activitySec">
                  <h5>Activities</h5>
                  {activities.length <= 0 ? (
                    <p className="addDetails__heading">Please Add Activites </p>
                  ) : (
                    <div className="midActivities__tags">
                      {activities.map((v, i) => (
                        <div className="mapMiniActivites">
                          <MiniActivitiesCard
                            data={v}
                            index={i}
                            deleteItem
                            clickFunction={deleteActivityItem}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="destinationsSec">
                  <h5>Destinations</h5>
                  {destinations.length <= 0 ? (
                    <p className="addDetails__heading">
                      Please Add Destinations{" "}
                    </p>
                  ) : (
                    <div className="destinationItems">
                      {destinations.map((v, i) => (
                        <div className="mapMiniActivites">
                          <MiniDestinationCard
                            data={v}
                            index={i}
                            deleteItem
                            clickFunction={deleteDestinationItem}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="groupSec">
                  <h5>Group Members</h5>
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

                <div className="MediaSec">
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
                          deleteItem
                          clickFunction={deleteMediaItem}
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
                // handleTriggerClick={handleTriggerClick}
                handleTriggerClose={handleTriggerClose}
                mediaComponentActive={mediaComponentActive}
                // onClose={handleTriggerClose}
              />
            ) : (
              <div className="groupContainer__bottom">
                <Add onClick={handleTriggerOpen} />

                <ButtonAtom
                  variant="filled"
                  fontSize="medium"
                  onClick={createNewGroup}
                >
                  CREATE GROUP
                </ButtonAtom>

                {/* {openCreatedGroup && ( */}
                {isLoading && (
                  <CreatedGroupScreen groupDetails={groupDetails} />
                )}
                <div className="emptyDiv"></div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
      <Dialog
        open={dialogueOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{
            textAlign: "center",
          }}
          id="alert-dialog-title"
        >
          {"UNSAVED CHANGES"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              textAlign: "center",
            }}
          >
            Do you want to close this ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBothClose}>Yes</Button>
          <Button onClick={handleDialogueClose}>No</Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
}

export default CreateGroup;
