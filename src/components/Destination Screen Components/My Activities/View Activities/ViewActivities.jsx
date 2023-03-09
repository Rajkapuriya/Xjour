import React, { useState, useEffect, useRef } from "react";
import "./ViewActivities.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  ChevronLeft,
  Close,
  DeleteForever,
  Edit,
  SettingsSuggest,
} from "@mui/icons-material";
import { Avatar, Switch } from "@mui/material";
import Cropper from "../../../Cropper/Cropper";
import Dropdown from "../../../React Dropdown/Dropdown";
import { useStateValue } from "../../../../config/context api/StateProvider";
import {
  addBase64File,
  getCountryFlags,
  getDocumentByName,
  getPrivateDocument,
  readSingleActivityAPI,
  updateActivitiesAPI,
} from "../../../../config/authentication/AuthenticationApi";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../../assets/constants/Contants";
import { Prompt } from "react-router-dom";
import ImageUploaderBox from "../../../Image Uploader Box/ImageUploaderBox";
import { baseURL } from "../../../../assets/strings/Strings";
import DeleteOrHideDialogue from "../../../Delete Or Hide Dialogue/DeleteOrHideDialogue";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  height: "60vh",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function ViewActivities() {
  const [
    {
      userToken,
      reducerSelectedActivity,
      reducerMyActivities,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const history = useHistory();
  const [memoryImagesTwo, setMemoryImagesTwo] = useState(reducerMemoryImages);

  const alert = useAlert();
  const [openImage, setOpenImage] = useState(false);
  const handleImageOpen = () => setOpenImage(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageVal, setImageVal] = useState(null);

  const [flagValue, setFlagValue] = useState([]);
  const [groupFlag, setGroupFlag] = useState(null);

  const [countrydropdownMenu, setCountrydropdownMenu] = useState(false);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activityLoader, setActivityLoader] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };

  let [isBlocking, setIsBlocking] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  var url = "";
  const [activityDetails, setActivityDetails] = useState([]);

  const [activityImageData, setActivityImageData] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);
  const [groupCodes, setGroupCodes] = useState({
    countryCode: "",
    pictureDocumentID: "",
  });

  const deleteActivityButton = () => {
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

  // console.log("reducerSelectedActivity", reducerSelectedActivity);
  // console.log("reducerMyActivities", reducerMyActivities);

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
    setImageVal(base64result);

    setActivityImageData({
      ...activityImageData,
      base64: e,
    });
    setGroupCodes({ ...groupCodes, base64Result: base64result });

    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const changeTitle = (e) => {
    setActivityDetails({
      ...activityDetails,
      name: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDetails = (e) => {
    setActivityDetails({
      ...activityDetails,
      description: e.target.value,
    });
    setIsBlocking(true);
  };

  const getActivityDataAPI = () => {
    // console.log("Calling Destination API", reducerSelectedActivity.data.key);
    readSingleActivityAPI(
      userToken,
      reducerSelectedActivity.data.key,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        // console.log("singleActivityData", val.data);

        // setDestinationAPIData(val.data);
        const APIData = val.data;
        if (APIData) {
          if (val.data.configurations) {
            var configurations = JSON.parse(val.data.configurations);
            if (configurations != null) {
              setGroupCodes({
                countryCode: configurations?.countryCode,
                pictureDocumentID: configurations?.pictureDocumentID,
              });
              const activityDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              getFlagURL(activityDataVal?.countryCode, 0, 0);
              if (activityDataVal.documentID != null) {
                getImageByDocumentId(activityDataVal?.documentID, 0, 0);
              }
            }
            // console.log("configurations", configurations);
            // setGroupCodes({
            //   countryCode: configurations?.countryCode,
            //   pictureDocumentID: configurations?.pictureDocumentID,
            // });
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
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data !== null) {
          var mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;
          // console.log("activityDetails countrySvg", svgValue);
          // console.log("activityDetails countrySvg val.data", val.data);
          if (status === 0) {
            setGroupFlag(svgValue);
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
          // console.log("activityDetails base64 imageFile", imageFile);
          // console.log("activityDetails base64 srcValue", srcValue);

          if (status === 0) {
            // console.log("activityDetails base64", srcValue);
            setActivityImageData({
              ...activityImageData,
              base64: srcValue,
            });

            setActivityImageData(activityImageData.slice());

            // setActivityDetails(activityDetails.slice());
            // console.log("activityDetails base64", activityImageData);
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

  // searchable working here //

  const changeSearchable = () => {
    // console.log(activityDetails.searchable);
    if (activityDetails.searchable === 0 || activityDetails.searchable === -1) {
      setActivityDetails({ ...activityDetails, searchable: 1 });
      setIsBlocking(true);
      // console.log("setting value to 1");
    } else {
      setActivityDetails({ ...activityDetails, searchable: 0 });
      setIsBlocking(true);
      // console.log("setting value to 0");
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

  const getFlagsData = () => {
    // console.log("Calling Country Flags API :");
    getCountryFlags(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Country Info", val);

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

  const getFlagValues = (e) => {
    // console.log(e.isoTwo);
    url = e.countryFlag;
    setGroupFlag(baseURL + url);
    setActivityDetails({ ...activityDetails, iso2: e.isoTwo });
    setGroupCodes({ ...groupCodes, countryCode: e.isoTwo });
    // console.log(activityDetails.iso2);
    setIsBlocking(true);
    setCountrydropdownMenu(false);
  };

  const CountryDropdown = () => {
    setCountrydropdownMenu(!countrydropdownMenu);
  };

  useEffect(() => {
    if (reducerSelectedActivity) {
      setActivityDetails({
        ...activityDetails,
        searchable: reducerSelectedActivity.data.searchable,
        name: reducerSelectedActivity.data.name,
        description: reducerSelectedActivity.data.description,
        key: reducerSelectedActivity.data.key,
        documentID: reducerSelectedActivity.data.documentID,
        countryCode: reducerSelectedActivity.data.countryCode,
      });

      // console.log("activityDetails in useEffect", activityDetails);
    }
    // console.log(
    //   "reducerSelectedActivity in useEffect",
    //   reducerSelectedActivity
    // );
  }, [reducerSelectedActivity]);

  useEffect(() => {
    getFlagsData();
  }, [flagValue]);

  useEffect(() => {
    if (!firstLoad) {
      // console.log("firstLoad triggered");
      setFirstLoad(true);
      getActivityDataAPI();
    }
  }, [firstLoad]);

  const updateActivity = (e) => {
    // console.log("update Activity", e);
    setIsLoading(true);
    if (groupCodes.base64Result != null) {
      uploadActivityPicture();
    } else {
      callUpdateActivityApi(groupCodes.pictureDocumentID);
    }
  };

  const uploadActivityPicture = () => {
    // console.log("Calling an API");
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
        // console.log(val.data);
        if (val.data.documentID != null) {
          let item = {
            date: Date.now(),
            documentId: val.data.documentId,
            image: activityImageData.base64,
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
          callUpdateActivityApi(val.data.documentID);
        } else {
          alert.show("Group creation failed");
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
  const callUpdateActivityApi = (documentID) => {
    const config = JSON.stringify({
      countryCode: groupCodes.countryCode,
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: activityDetails.key,
      name: activityDetails.name,
      description: activityDetails.description,
      searchable: activityDetails.searchable,
      configurations: config,
    });
    // console.log("Params", params);

    updateActivitiesAPI(params, userToken, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        if (val.data) {
          setIsLoading(false);
          setIsBlocking(false);

          var index = reducerMyActivities.findIndex(
            (x) => x.key === reducerSelectedActivity.data.key
          );
          if (index === -1) {
          } else {
            let activityItem = reducerMyActivities;
            let item = { ...activityItem[index] };

            item.name = activityDetails.name;
            item.description = activityDetails.description;
            item.searchable = activityDetails.searchable;
            item.base64 = activityImageData.base64;
            item.countrySvg = groupFlag;

            activityItem[index] = item;

            dispatch({
              type: "SET_MY_ACTIVITIES",
              reducerMyActivities: activityItem,
            });

            alert.show("Activity Updated Successfully");
            history.push("/destinations/my-activities");
          }
          // console.log(val.data);
        } else {
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
  };

  if (activityLoader) {
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
    <div className="viewActivity">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      <div className="notes__top">
        <ChevronLeft
          onClick={() => history.push("/destinations/my-activities")}
        />
        <h3 className="notes__heading">View Activities</h3>
      </div>

      <div className="viewActivity__container">
        <div className="midDetail__activities">
          <div className="midDetail__activities__left">
            <div className="activityNameDiv">
              <h5>Activity Name</h5>
              <div className="inputDiv">
                <input
                  type="text"
                  placeholder="Write name here."
                  value={activityDetails.name}
                  onChange={changeTitle}
                />
              </div>
            </div>

            <div className="activityNameDiv">
              <h5>Activity Details</h5>
              <div className="inputDivDetail">
                <textarea
                  type="text"
                  placeholder="Write name here."
                  value={activityDetails.description}
                  onChange={changeDetails}
                />
              </div>
            </div>
          </div>
          <div className="midDetail_activities_right">
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

            <div className="activities__containerImage">
              {!activityImageData.base64 ? (
                <Oval color="#00BFFF" height={80} width={80} />
              ) : (
                <img
                  className="activityImage"
                  src={activityImageData.base64}
                  alt=""
                  onClick={handleImageOpen}
                />
              )}

              <Modal
                open={openImage}
                onClose={handleImageClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <img
                    style={{ borderRadius: "12px" }}
                    src={activityImageData.base64}
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
                <Cropper
                  inputImg={photoUrl}
                  // onClose={handleClose}
                  onClose={handleCropperClose}
                  onDone={handleDone}
                  mimeType={mimeType}
                />
              </Modal>
            </div>

            {!groupFlag ? (
              <Oval color="#00BFFF" height={20} width={20} />
            ) : (
              <div className="activities__fieldInputs">
                {!groupFlag || countrydropdownMenu ? (
                  <div className="ProfileData__fieldInputs">
                    <Dropdown
                      name="location"
                      title="Select location"
                      searchable={[
                        "Search for location",
                        "No matching location",
                      ]}
                      list={flagValue}
                      // list={locations}
                      onChange={getFlagValues}
                    />
                    <Close
                      onClick={CountryDropdown}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : (
                  <img
                    className="activities__countryFlagSvg"
                    src={groupFlag}
                    alt=""
                    onClick={CountryDropdown}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="viewActivities__activityDetails">
          <div className="groupMid__details">
            <div className="ProfileData__fieldInputs"></div>
          </div>
        </div>

        <div className="myActivities__actionButtons">
          <div className="myActivities__createButton">
            <button
              className="megaButton__activity"
              onClick={() => updateActivity(activityDetails)}
            >
              Update Activities
              <Avatar style={{ backgroundColor: "#22b0ea" }}>
                <SettingsSuggest style={{ color: "white" }} />
              </Avatar>
            </button>
          </div>
          <div className="myActivities__createButton">
            <button
              className="megaButton__activityDelete"
              // onClick={() => deleteActivityButton(activityDetails.key)}
              onClick={() => deleteActivityButton(activityDetails.key)}
            >
              Delete Activities
              <Avatar style={{ backgroundColor: "#ee378a" }}>
                <DeleteForever style={{ color: "white" }} />
              </Avatar>
            </button>
          </div>
        </div>
      </div>

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={activityDetails.key}
          state="activity"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}

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

export default ViewActivities;
