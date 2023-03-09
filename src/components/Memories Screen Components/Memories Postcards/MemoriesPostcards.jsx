import React, { useEffect, useRef, useState } from "react";
import "./MemoriesPostcards.css";
import { Add, ChevronLeft, Edit, FilterAlt } from "@mui/icons-material";

import { useStateValue } from "../../../config/context api/StateProvider";
import PostCardItems from "../../Home Screen Components/PostCards/PostCards items/PostCardItems";
import {
  addBase64File,
  createPostcardAPI,
} from "../../../config/authentication/AuthenticationApi";
import CollapsibleForPostcard from "../../Sidebar Group Buttons/Collapsible Buttons/Collapsible For Postcard/CollapsibleForPostcard";
import PeopleCards from "../../Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import { Box, Modal, Switch } from "@mui/material";
import Cropper from "../../Cropper/Cropper";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";
import dummyPostcard from "../../../assets/images/dummyPostcard.jpg";
import ImageUploaderBox from "../../Image Uploader Box/ImageUploaderBox";

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
function MemoriesPostcards() {
  const [
    { userToken, postcardsData, reducerVisitorID, reducerMemoryImages },
    dispatch,
  ] = useStateValue();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const [postcardArray, setPostcardArray] = useState([]);
  const [postcardDetails, setPostcardDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [docsData, setDocsData] = useState([]);
  const [redirectNow, setRedirectNow] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const handleImageOpen = () => setOpenImage(true);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [connectPeople, setConnectPeople] = useState([]);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [mediaComponent, setMediaComponent] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const alert = useAlert();

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  const memPostcardsWrapper = useRef(null);

  // const scrollPostcards = (scrollOffset) => {
  // console.log("button Pressed");
  //   memPostcardsWrapper.current.scrollTop += scrollOffset;
  // };

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

  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
  };

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  const handleDone = (e) => {
    // const base64result = e.substr(e.indexOf(",") + 1);

    setPostcardDetails({ ...postcardDetails, postcardPicture: e });
    setOpenImage(false);
    setShowImageUploader(false);
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
  // searchable working here //

  const changeSearchable = () => {
    // console.log(postcardDetails.searchable);
    if (postcardDetails.searchable === 0 || postcardDetails.searchable === -1) {
      setPostcardDetails({ ...postcardDetails, searchable: 1 });
      // console.log("setting value to 1");
    } else {
      setPostcardDetails({ ...postcardDetails, searchable: 0 });
      // console.log("setting value to 0");
    }
    // console.log(postcardDetails);
  };
  // searchable working here //
  // working on add postcard
  const label = { inputProps: { "aria-label": "Switch demo" } };

  const createPostcard = () => {
    if (
      postcardDetails.name &&
      postcardDetails.description &&
      postcardDetails.postcardPicture
    ) {
      callCreatePostCardAPIs();
      // openCreatedGroupModal();
      // console.log(postcardDetails);
    } else {
      alert.show("Please fill the required fields");
    }
    // history.push("/create-group");
  };

  const callCreatePostCardAPIs = () => {
    setIsLoading(true);
    uploadPostcardPicture();
  };

  const uploadPostcardPicture = () => {
    const base64result = postcardDetails.postcardPicture.substr(
      postcardDetails.postcardPicture.indexOf(",") + 1
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
        if (val.data.documentID !== null) {
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
          createPostcardAPIFunction(val.data.documentID);
          setOpen(false);
        } else {
          alert.show("Postcard creation failed");
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

  const createPostcardAPIFunction = (documentID) => {
    const config = JSON.stringify({
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      name: postcardDetails.name,
      description: postcardDetails.description,
      configurations: config,
      searchable: postcardDetails.searchable,
    });
    // console.log("Params", params);

    createPostcardAPI(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        setIsLoading(false);
        setPostcardDetails({
          ...postcardDetails,
          name: "",
          description: "",
          postcardPicture: null,
          searchable: 0,
        });
        // console.log("create Postcard API", val.data);

        // const valData = val.data.ugKey;

        let obj = {
          base64: postcardDetails.postcardPicture,
          description: postcardDetails.description,
          documentID: documentID,
          name: postcardDetails.name,
          pk: val.data.ugKey,
          searchable: 1,
        };
        const newArray = postcardsData.concat(obj);
        setDocsData(newArray);
        // console.log("newArray", newArray);
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

  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    if ((v.base64 && v.countrySvg) !== null) {
      var index = connectPeople.findIndex((x) => x.pk === v.pk);
      if (index === -1) {
        connectPeople.push(v);
        setConnectPeople([...connectPeople]);
        // console.log("connectPeople", connectPeople);
      }
    }
  };

  const deleteCardItem = (index) => {
    // console.log(index);

    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };
  // working on add postcard

  useEffect(() => {
    // console.log("UseEffect memoryImages:", postcardsData);
    if (typeof postcardsData === "undefined") {
      // console.log("You have no Images added!!");
      setIsEmpty(true);
    } else {
      if (postcardsData.length === 0) {
        // console.log("You have no Images Added!!");
        setIsEmpty(true);
      } else {
        setPostcardArray(postcardsData);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [postcardsData]);

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_POSTCARDS_DATA",
        postcardsData: docsData,
      });
    }
  }, [redirectNow]);

  return (
    <div className="memoriesPostcards" ref={memPostcardsWrapper}>
      <div className="memoriesPostcards__heading">
        <h3>Postcards </h3>
        <FilterAlt />
      </div>
      <div className="memoriesPostcards__latest">
        <div className="memoriesPostcards__images">
          <div className="uploadImageBox" onClick={handleOpen}>
            <label>
              <Add />
              {/* <input
                // id="file-input"
                type="file"
                className="input-file"
                style={{ display: "none" }}
                // onChange={imageHandleChange}
              /> */}
            </label>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="group__container">
                <div className="groupContainer__top">
                  <ChevronLeft onClick={handleClose} />
                  <h3>Add Post</h3>
                </div>

                <div className="groupContainer__mid">
                  <div className="groupMid__detail">
                    <div className="postcard__bio">
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
                              borderRadius: 130,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              //className="selectedGroupImage"
                              style={{
                                width: 130,
                                height: 130,
                                borderRadius: 150,
                                objectFit: "contain",
                              }}
                              alt=""
                              src={
                                !postcardDetails.postcardPicture
                                  ? dummyPostcard
                                  : postcardDetails.postcardPicture
                              }
                              onClick={
                                postcardDetails.postcardPicture &&
                                handleImageOpen
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
                            <img
                              style={{ borderRadius: "12px" }}
                              src={photoUrl}
                              width="500"
                              height="500"
                              // onClick={handleImageOpen}
                              controls
                              alt=""
                            />
                          </Box>
                        </Modal>

                        <div class="image-upload">
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

                      <div className="searchableToggle">
                        {postcardDetails.searchable === 0 ? (
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

                      <div className="groupNameDiv">
                        <h5 className="groupMid__h5">Name</h5>
                        <div className="inputDiv">
                          <input
                            type="text"
                            placeholder="Write name here."
                            value={postcardDetails.name}
                            onChange={(e) =>
                              setPostcardDetails({
                                ...postcardDetails,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="groupMid__details">
                        <h5 className="groupMid__h5">Description</h5>
                        <div className="inputDivDetail">
                          <textarea
                            type="text"
                            placeholder="Write Description here."
                            value={postcardDetails.description}
                            onChange={(e) =>
                              setPostcardDetails({
                                ...postcardDetails,
                                description: e.target.value,
                              })
                            }
                          />
                          ;
                        </div>
                      </div>
                    </div>

                    <div className="groupMid_detail_groupName"></div>

                    <div className="groupMid_detail_groupDetails"></div>

                    <div className="groupSec">
                      <h5>Postcard Connections</h5>
                      {connectPeople.length <= 0 ? (
                        <p className="addDetails__heading">
                          Please Add Connections{" "}
                        </p>
                      ) : (
                        <div className="groupSec__cards">
                          {connectPeople?.map((v, i) => (
                            <PeopleCards
                              data={v}
                              index={i}
                              deleteItem={deleteCardItem}
                              // handleClick={getConnection}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {collapsibleButton ? (
                  <CollapsibleForPostcard
                    getConnection={getConnection}
                    handleTriggerClose={handleTriggerClose}
                    mediaComponentActive={mediaComponentActive}
                    // onClose={handleTriggerClose}
                  />
                ) : (
                  <div className="groupContainer__bottom">
                    <div className="svg__Icon">
                      <Add onClick={handleTriggerOpen} />
                    </div>
                    <button
                      className="primaryButtonActive"
                      onClick={createPostcard}
                      // disabled={
                      //   (postcardDetails.name ||
                      //     postcardDetails.description ||
                      //     postcardDetails.postcardPicture) == null
                      // }
                    >
                      Create Postcard
                    </button>

                    <div className="emptyDiv"></div>
                  </div>
                )}
              </div>
            </Box>
          </Modal>

          {/* <PostCards postcardsData={postcardsData} /> */}
          {isEmpty ? (
            <div className="noImagesText">
              <h3>You have no Postcards added </h3>
            </div>
          ) : (
            <>
              {/* <div className="fullScrennScroll__buttons">
                <ArrowUpwardSharp onClick={() => scrollPostcards(-150)} />
                <ArrowDownward onClick={() => scrollPostcards(+150)} />
              </div> */}
              {[...postcardArray].reverse().map((v, i) => (
                <PostCardItems
                  key={v + i}
                  image={v.base64}
                  title={v.name}
                  description={v.description}
                  data={v}
                  index={i}
                />
              ))}
            </>
          )}
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
    </div>
  );
}

export default MemoriesPostcards;
