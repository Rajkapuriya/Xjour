import { Add, Close, Edit, ChevronLeft } from "@mui/icons-material";
import { Box, Modal, Switch } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  addBase64File,
  addPostCardMemberAPI,
  deletePostcardMemberAPI,
  getDocumentByName,
  getPrivateDocument,
  readSinglePostCardAPI,
  updatePostcardAPI,
} from "../../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../../config/context api/StateProvider";
import PeopleCards from "../../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import Cropper from "../../../Cropper/Cropper";
import CollapsibleForPostcard from "../../../Sidebar Group Buttons/Collapsible Buttons/Collapsible For Postcard/CollapsibleForPostcard";
import "./ViewPostcard.css";
import { useAlert } from "react-alert";
import { Oval } from "react-loader-spinner";
import { UNAUTH_KEY } from "../../../../assets/constants/Contants";
import { Prompt } from "react-router-dom";
import DeleteOrHideDialogue from "../../../Delete Or Hide Dialogue/DeleteOrHideDialogue";
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

function ViewPostcard() {
  const [
    {
      userToken,
      reducerSelectedPostcard,
      postcardsData,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const history = useHistory();
  const [postcardDetails, setPostcardDetails] = useState([]);
  const alert = useAlert();
  const [openImage, setOpenImage] = useState(false);
  const [postcardArrayData, setPostcardArrayData] = useState(postcardsData);
  const handleImageOpen = () => setOpenImage(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageVal, setImageVal] = useState(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  // const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  // const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [connectPeople, setConnectPeople] = useState([]);
  let [isBlocking, setIsBlocking] = useState(false);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  const [newMemberKeys, setNewMemberKeys] = useState([]);
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

  // console.log("postcardArrayData", reducerSelectedPostcard);

  useEffect(() => {
    setPostcardDetails({
      name: reducerSelectedPostcard?.name,
      description: reducerSelectedPostcard?.description,
      postcardPicture: reducerSelectedPostcard?.base64,
      searchable: reducerSelectedPostcard?.searchable,
      documentID: reducerSelectedPostcard?.documentID,
      pk: reducerSelectedPostcard?.pk,
    });

    getSinglePostCard();
  }, [reducerSelectedPostcard]);

  useEffect(() => {
    // console.log("Connections", connectPeople);
  }, [connectPeople]);

  const getSinglePostCard = () => {
    readSinglePostCardAPI(
      userToken,
      reducerSelectedPostcard.pk,
      reducerVisitorID
    ).then(function (val) {
      if (val) {
        // console.log("Postcard API Response", val.data);
        // console.log("keys", val.data.connections);

        var jsonConnections = JSON.parse(val.data.connections);

        //setConnectPeople(val.data.connections)
        // console.log("JSON keys", jsonConnections);

        for (var keys in jsonConnections) {
          // console.log("Single Connection Value", jsonConnections[keys]);

          const userSingleItem = {
            firstName: jsonConnections[keys].firstname,
            lastName: jsonConnections[keys].lastname,
            base64: "",
            countrySvg: "",
            entKey: jsonConnections[keys].entKey,
            ugmKey: jsonConnections[keys].ugmKey,
          };

          connectPeople.push(userSingleItem);

          // console.log(
          //   "Config",
          //   jsonConnections[keys].configurations.countryCode
          // );

          getImageByDocumentId(
            jsonConnections[keys].configurations.pictureDocumentID,
            connectPeople.length - 1
          );
          getFlagURL(
            jsonConnections[keys].configurations.countryCode,
            connectPeople.length - 1
          );
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

        if (val.data != null) {
          const imageFile = val.data.dataBase64;
          let srcValue = `data:image/jpg;base64, ${imageFile}`;

          let connectItem = connectPeople;
          let item = { ...connectItem[index] };

          item.base64 = srcValue;
          connectItem[index] = item;

          setConnectPeople(connectItem.slice());
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

  const getFlagURL = (data, index, status) => {
    // console.log('Flagid',id);

    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("flagURL Info", val.data);
        if (val.data != null) {
          var mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;

          let connectItem = connectPeople;
          let item = { ...connectItem[index] };

          item.countrySvg = svgValue;
          connectItem[index] = item;

          setConnectPeople(connectItem.slice());
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

  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
  };

  const handleTriggerOpen = () => {
    setCollapsibleButton(true);
  };
  const handleTriggerClose = () => {
    setCollapsibleButton(false);
  };

  const changeTitle = (e) => {
    setPostcardDetails({
      ...postcardDetails,
      name: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDetails = (e) => {
    setPostcardDetails({
      ...postcardDetails,
      description: e.target.value,
    });
    setIsBlocking(true);
  };

  //   // searchable working here //

  const changeSearchable = () => {
    if (postcardDetails.searchable === 0 || postcardDetails.searchable === -1) {
      setPostcardDetails({ ...postcardDetails, searchable: 1 });
      // console.log("setting value to 1");
      setIsBlocking(true);
    } else {
      setPostcardDetails({ ...postcardDetails, searchable: 0 });
      // console.log("setting value to 0");
      setIsBlocking(true);
    }
    // console.log(postcardDetails);
  };
  //   // searchable working here //

  //   // photoURL working here //
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

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  const handleDone = (e) => {
    const base64result = e.substr(e.indexOf(",") + 1);
    setImageVal(base64result);

    setPostcardDetails({
      ...postcardDetails,
      postcardPicture: e,
    });

    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const uploadPostcardPicture = () => {
    // console.log("Calling an API");
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: imageName,
      documentName: mimeType + "/" + imageName,
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: imageVal,
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
            image: postcardDetails.base64,
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
          callUpdatePostcardApi(val.data.documentID);
        } else {
          alert.show("Postcard updated failed");
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

  const updatePostcard = (e) => {
    // if (
    //   (postcardDetails.name || postcardDetails.description || imageVal) ==
    //   null
    // ) {
    // }
    // console.log("update Activity", postcardDetails);
    uploadConnections();
    setIsLoading(true);
    if (imageVal != null) {
      uploadPostcardPicture();
    } else {
      callUpdatePostcardApi(postcardDetails.documentID);
    }
    //  else {
    //   alert("there's no changes to update");
    // }
  };

  const callUpdatePostcardApi = (documentID) => {
    const config = JSON.stringify({
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: postcardDetails.pk,
      name: postcardDetails.name,
      description: postcardDetails.description,
      searchable: postcardDetails.searchable,
      configurations: config,
    });
    // console.log("Params", params);

    updatePostcardAPI(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log(val.data);
          setIsLoading(false);
          setIsBlocking(false);
          alert.show("Postcard updated successfully");

          var index = postcardArrayData.findIndex(
            (x) => x.pk === postcardDetails.pk
          );
          let tempPostcardArrayData = postcardArrayData;
          let item = { ...tempPostcardArrayData[index] };

          item.name = postcardDetails.name;
          item.base64 = postcardDetails.postcardPicture;
          item.description = postcardDetails.description;
          tempPostcardArrayData[index] = item;

          dispatch({
            type: "SET_POSTCARDS_DATA",
            postcardsData: tempPostcardArrayData,
          });
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

  const uploadConnections = () => {
    for (var i = 0; i < newMemberKeys.length; i++) {
      // console.log("NewMembers", newMemberKeys[i]);
      const params = JSON.stringify({
        ugKey: postcardDetails.pk,
        entKey: newMemberKeys[i],
        message: "Join postcard",
      });
      // console.log("parameter", params);

      addPostCardMemberAPI(params, userToken, reducerVisitorID).then(function (
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
        // console.log("member Add", val.data);
      });
    }
    // console.log("New Member keys", newMemberKeys);
  };

  const deletePostcardButton = (key) => {
    // console.log("deleteOrHideConfirmation", key);
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
      setConnectPeople([...connectPeople]);

      newMemberKeys.push(v.entKey);

      // console.log("Member Keys", newMemberKeys);

      // console.log("connectPeople", connectPeople);
    }
  };

  const deleteCardItem = (data, index) => {
    // console.log(index);

    // console.log("Value", connectPeople[index].entKey);

    const indexKeys = newMemberKeys.indexOf(connectPeople[index].entKey);
    if (index > -1) {
      newMemberKeys.splice(indexKeys, 1); // 2nd parameter means remove one item only
    }

    const params = JSON.stringify({
      entKey: connectPeople[index].entKey,
      ugmKey: connectPeople[index].ugmKey,
    });
    // console.log("parameter", params);

    deletePostcardMemberAPI(params, userToken, reducerVisitorID).then(function (
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
      // console.log("member delete", val.data);
    });

    connectPeople.splice(index, 1);

    // console.log("Member Keys", newMemberKeys);

    setConnectPeople([...connectPeople]);
  };

  if (isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="viewPostcard">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />

      <div className="viewPostcard__top">
        <ChevronLeft onClick={() => history.push("/home")} />
        <h3 className="notes__heading">Home</h3>
      </div>

      <div className="viewPostcard__container">
        <div className="viewPostcard__leftSection">
          <div className="groupNameDiv">
            <h5>Postcard Headline</h5>
            <div className="inputDiv">
              <input
                type="text"
                placeholder="Write headline here."
                value={postcardDetails.name}
                onChange={changeTitle}
              />
            </div>
          </div>

          <div className="groupMid__details">
            <h5>Postcard Details</h5>
            <div className="inputDivDetail">
              <textarea
                // rows="4"
                // cols="50"
                type="text"
                placeholder="Write Details here."
                value={postcardDetails.description}
                onChange={changeDetails}
              />
            </div>
          </div>
        </div>

        <div className="viewPostcard__rightSection">
          <div className="searchableToggle">
            {postcardDetails.searchable === 0 ? (
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

          <img
            className="activityImage"
            alt=""
            src={postcardDetails.postcardPicture}
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
                src={postcardDetails.postcardPicture}
                width="500"
                height="500"
                alt=""
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
        </div>
      </div>

      <div className="viewPostcard__connection">
        <h5>Postcard Connections</h5>
        {connectPeople.length <= 0 ? (
          <p className="addDetails__heading">Please Add Connections </p>
        ) : (
          <div className="viewPostcard__connectionCards">
            {connectPeople?.map((v, i) => (
              <PeopleCards
                data={v}
                index={i}
                deleteItem={deleteCardItem}
                clickFunction={deleteCardItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="viewPostcard__actionButtons">
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
          <button
            className="megaButton"
            onClick={() => updatePostcard(postcardDetails.pk)}
          >
            Update Postcard
          </button>
        </div>
        <div className="viewPostcard__bottom">
          <div className="svg__IconRight">
            <Close
              onClick={() => deletePostcardButton(reducerSelectedPostcard.pk)}
            />
          </div>
        </div>
      </div>
      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={reducerSelectedPostcard.pk}
          state="postcard"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}

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

export default ViewPostcard;
