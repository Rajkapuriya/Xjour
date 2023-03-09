import { Close, Edit } from "@mui/icons-material";
import { Box, Modal, Switch } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import {
  addBase64File,
  createActivitiesAPI,
  getCountryFlags,
  getDocumentByName,
} from "../../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../../config/context api/StateProvider";
import Cropper from "../../../Cropper/Cropper";
import Dropdown from "../../../React Dropdown/Dropdown";
import "./CreateActivities.css";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../../assets/constants/Contants";
import ImageUploaderBox from "../../../Image Uploader Box/ImageUploaderBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 650,
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function CreateActivities({ handleClose, setIsBlocking }) {
  const [
    {
      userToken,
      reducerMyActivities,
      reducerDefaultPictures,
      reducerUserDATA,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const history = useHistory();
  const alert = useAlert();
  const [openImage, setOpenImage] = useState(false);
  const handleImageOpen = () => setOpenImage(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [flagValue, setFlagValue] = useState([]);
  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPictureSelected, setPictureSelected] = useState(false);

  const [activityDetails, setActivityDetails] = useState({
    activityName: "",
    activityDescription: "",
    activityBase64: null,
    base64DocumentID: null,
    searchable: 1,
    iso2: "",
  });
  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

  const [activityImageDetails, setActivityImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
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

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const changeTitle = (e) => {
    setActivityDetails({
      ...activityDetails,
      activityName: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDescription = (e) => {
    setActivityDetails({
      ...activityDetails,
      activityDescription: e.target.value,
    });
    setIsBlocking(true);
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

    setActivityImageDetails({ ...activityImageDetails, base64: e });
    setOpenImage(false);
    setPictureSelected(true);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  // searchable working here //

  const changeSearchable = () => {
    // console.log(activityDetails.searchable);
    if (activityDetails.searchable === 0 || activityDetails.searchable === -1) {
      setActivityDetails({ ...activityDetails, searchable: 1 });
      // console.log("setting value to 1");
      setIsBlocking(true);
    } else {
      setActivityDetails({ ...activityDetails, searchable: 0 });
      // console.log("setting value to 0");
      setIsBlocking(true);
    }
    // console.log(activityDetails);
  };
  // searchable working here //

  // photoURL working here //
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
  // photoURL working here //

  // getting Countries and flags working here //
  const getFlagsData = () => {
    // console.log("Calling Country Flags API :");
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Country Info", val);

        if (val.data !== null) {
          var info = val.data;
          for (var key in info) {
            // console.log(info[key]);
            const flagDataVal = {
              countryName: info[key].country,
              iso2: info[key].iso2,
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
    // console.log(e.iso2);
    setActivityDetails({ ...activityDetails, iso2: e.iso2 });
    // console.log(activityDetails.iso2);
    setIsBlocking(true);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  useEffect(() => {
    // console.log(userToken);
    getFlagsData();
  }, [flagValue]);
  // getting Countries and flags working here //

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[2]);

      setActivityImageDetails({
        ...activityImageDetails,
        base64: reducerDefaultPictures[3].base64Value,
        base64DocumentID: reducerDefaultPictures[3].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    if (reducerUserDATA) {
      // console.log("Flag: ", reducerUserDATA);

      setActivityDetails({
        ...activityDetails,
        countrySvg: reducerUserDATA.countrySvg,
        iso2: reducerUserDATA.countryCode,
      });
    }
  }, [reducerUserDATA]);

  // Create Activity API

  const getFlagURL = (groupId, data) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data != null) {
          let mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;

          const obj = {
            key: groupId,
            name: activityDetails.activityName,
            description: activityDetails.activityDescription,
            searchable: activityDetails.searchable,
            base64: activityImageDetails.base64,
            countrySvg: svgValue,
          };

          if (
            typeof reducerMyActivities === "undefined" ||
            reducerMyActivities.length === 0
          ) {
            dispatch({
              type: "SET_MY_ACTIVITIES",
              reducerMyActivities: [obj],
            });
          } else if (reducerMyActivities.length !== 0) {
            const newArray = reducerMyActivities.concat(obj);
            // newActivitiesArray(newArray);
            dispatch({
              type: "SET_MY_ACTIVITIES",
              reducerMyActivities: newArray,
            });
            // console.log("newArray", newArray);
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

  const createActivityAPI = (documentID) => {
    const config = JSON.stringify({
      countryCode: activityDetails.iso2,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: 0,
      name: activityDetails.activityName,
      description: activityDetails.activityDescription,
      searchable: activityDetails.searchable,
      memberStatus: 0,
      configurations: config,
    });
    // console.log("Params", params);

    createActivitiesAPI(userToken, params, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        alert.show("Activity Created Successfully");
        setIsLoading(false);
        setActivityDetails({
          ...activityDetails,
          activityName: "",
          activityDescription: "",
          activityBase64: null,
          searchable: 0,
        });
        // console.log("Activity API CALL", val.data);

        getFlagURL(val.data.ugKey, activityDetails.iso2);
        //   addMemoryGroupItems(val.data.ugKey);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
    handleClose();
  };

  const uploadActivityPicture = () => {
    const base64result = activityImageDetails.base64.substr(
      activityImageDetails.base64.indexOf(",") + 1
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
            image: activityImageDetails.base64,
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
          createActivityAPI(val.data.documentID);
        } else {
          alert.show("Group creation failed");
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

  const callCreateActivityAPIs = () => {
    setIsLoading(true);

    if (isPictureSelected) {
      uploadActivityPicture();
    } else {
      createActivityAPI(activityImageDetails.base64DocumentID);
    }
  };

  const createNewActivity = () => {
    if (activityDetails.activityName && activityDetails.activityDescription) {
      callCreateActivityAPIs();
    } else {
      alert.show("Plase fill the required fields");
    }
    // history.push("/create-group");
  };
  // Create Activity API

  if (isLoading) {
    return (
      <div className="createActivityLoader">
        <Oval color="#00BFFF" height={200} width={200} />
      </div>
    );
  }

  return (
    <div className="createActivities">
      <div className="createActivities__container">
        <div className="container__top">
          {/* <ChevronLeft onClick={handleClose} /> */}
          <h3>Create Activities</h3>
          <Close onClick={handleClose} />
        </div>

        <div className="container__mid">
          <div className="container__midDetails">
            <div className="container__midLeft">
              <div className="activityNameDiv">
                <h5>Activity Name</h5>
                <div className="inputDiv">
                  <input
                    type="text"
                    placeholder="Write name here."
                    value={activityDetails.activityName}
                    onChange={changeTitle}
                  />
                </div>
              </div>

              <div className="activityNameDiv">
                <h5>Activity Details</h5>
                <div className="inputDivDetail">
                  <textarea
                    type="text"
                    placeholder="Write details here."
                    value={activityDetails.activityDescription}
                    onChange={changeDescription}
                  />
                </div>
              </div>
            </div>

            <div className="container__midRight">
              <div className="searchableToggle">
                {activityDetails.searchable === 0 ? (
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
                <img
                  className="activityImage"
                  src={activityImageDetails.base64}
                  alt=""
                  onClick={handleImageOpen}
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
                      src={photoUrl}
                      alt=""
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
                  <Cropper
                    inputImg={photoUrl}
                    // onClose={handleClose}
                    onClose={handleCropperClose}
                    onDone={handleDone}
                    mimeType={mimeType}
                  />
                </Modal>
              </div>

              <div className="activityData__fieldInputs">
                {countrydropdownMenu || !activityDetails.countrySvg ? (
                  <Dropdown
                    name="location"
                    title="Select location"
                    searchable={["Search for location", "No matching location"]}
                    list={flagValue}
                    onChange={getFlagValues}
                  />
                ) : (
                  <p
                    className="selectedGroupComponent__flagDropDown"
                    onClick={CountryDropdown}
                  >
                    <img
                      className="groupCountryFlagSvg"
                      src={activityDetails.countrySvg}
                      alt=""
                    />
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="createActivities__createButton">
            <button className="megaButton" onClick={createNewActivity}>
              + Create Activities
            </button>
          </div>
        </div>
      </div>
      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Activity Picture"
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

export default CreateActivities;
