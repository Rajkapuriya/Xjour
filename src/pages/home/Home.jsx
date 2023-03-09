import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import InfiniteScroll from "react-infinite-scroll-component";
import { Shimmer } from "react-shimmer";

import "./Home.css";

import { UNAUTH_KEY } from "assets/constants/Contants";

import {
  addBase64File,
  addPostCardMemberAPI,
  createPostcardAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  destinationsSelector,
  setSelectedSingleDestination,
} from "store/reducers/destinations";
import {
  postcardsSelector,
  setMultiple,
  setPostcardsScrollState,
  setReplacePreviousByPage,
} from "store/reducers/postcards";
import { notesSelector } from "store/reducers/notes";
import { setStoriesPageNumber, storiesSelector } from "store/reducers/stories";
import { useLazyGetStoriesQuery } from "store/endpoints/stories";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Switch,
} from "@mui/material";
import { Add, ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";

import ButtonAtom from "components/Atoms/Button/Button";
import FeaturedStories from "components/Home Screen Components/Featured Stories/FeaturedStories";
import PostCards from "components/Home Screen Components/PostCards/PostCards";
import RecentDestinations from "components/Home Screen Components/Recent Destinations/RecentDestinations";
import RecentNotes from "components/Home Screen Components/Recent Notes/RecentNotes";
import Cropper from "components/Cropper/Cropper";
import PeopleCards from "components/Connect Screen Components/My Connections/People Section/People cards/PeopleCards";
import CollapsibleForPostcard from "components/Sidebar Group Buttons/Collapsible Buttons/Collapsible For Postcard/CollapsibleForPostcard";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import AddOverlay from "components/Shared/AddOverlay/AddOverlay";

import ImagePlaceholder from "assets/images/image-placeholder.jpg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: "auto",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function Home() {
  const storeDispatch = useDispatch();
  const alert = useAlert();

  const [
    {
      userToken,
      postcardsData,
      reducerDefaultPictures,
      reducerVisitorID,
      reducerAllNotes,
      reducerMyDestinations,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const postcardsState = useSelector(postcardsSelector);
  const notesState = useSelector(notesSelector);
  const storiesState = useSelector(storiesSelector);
  console.log("%cstoriesState:", "background-color:silver;", storiesState);
  console.log(
    "%cpostcardsState in home:",
    "background-color:yellow;",
    postcardsState
  );

  const [getStories, storiesQueryState] = useLazyGetStoriesQuery();
  console.log(
    "%cstoriesQueryState:",
    "background-color:lime",
    storiesQueryState
  );

  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const [open, setOpen] = useState(false);
  const [redirectNow, setRedirectNow] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setIsBlocking(false);
  };
  const handleClose = () => setOpen(false);
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const handleImageOpen = () => setOpenImage(true);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);

  // const [postcardArrayData, setPostcardArrayData] = useState([]);
  const [memoryImages, setMemoryImages] = useState([]);
  const [connectPeople, setConnectPeople] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [mediaComponent, setMediaComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPictureSelected, setPictureSelected] = useState(false);
  const history = useHistory();
  let [isBlocking, setIsBlocking] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);
  // var memberKeys = [];

  const [postcardsLeftChevronEnabled, setPostcardsLeftChevronEnabled] =
    useState(false);
  const [postcardsRightChevronEnabled, setPostcardsRightChevronEnabled] =
    useState(false);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver((entries) => {
      console.log(
        "%cpostcards resize observer triggered:",
        "background-color:red;",
        entries
      );
      const postcardsScrollContainer = entries[0].target;
      if (
        postcardsScrollContainer.clientWidth <
        postcardsScrollContainer.scrollWidth
      ) {
        setPostcardsRightChevronEnabled(true);
      } else {
        setPostcardsRightChevronEnabled(false);
      }
    });
  }, []);
  const [postCardWrapperNode, setPostCardWrapperNode] = useState(null);
  const postCardWrapper = useCallback(
    (node) => {
      if (node !== null) {
        setPostCardWrapperNode(node);
        resizeObserver.observe(node);
      }
    },
    [resizeObserver]
  );

  const label = { inputProps: { "aria-label": "Switch demo" } };

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

  const confirmationBox = () => {
    // console.log("confirmationBox");
    handleClickOpen();
  };

  const changeTitle = (e) => {
    setPostcardDetails({
      ...postcardDetails,
      name: e.target.value,
    });
    setIsBlocking(true);
  };

  const changeDescription = (e) => {
    setPostcardDetails({
      ...postcardDetails,
      description: e.target.value,
    });
    setIsBlocking(true);
  };

  // const handleTriggerClick = () => {
  //   setCollapsibleButton(!collapsibleButton);
  // };

  // working for modal function
  const [postcardDetails, setPostcardDetails] = useState({
    name: postcardsData?.name,
    description: postcardsData?.description,
    postcardPicture: postcardsData?.base64,
    searchable: postcardsData?.searchable,
  });

  // searchable working here //

  const changeSearchable = () => {
    // console.log(postcardDetails.searchable);
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
  // searchable working here //

  const handleImageClose = (e) => {
    // console.log(e);
    setOpenImage(false);
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

  const handleCropperClose = (e) => {
    // console.log(e);
    setOpenImageCropper(false);
  };

  const handleDone = (e) => {
    // const base64result = e.substr(e.indexOf(",") + 1);

    setPostcardDetails({ ...postcardDetails, postcardPicture: e });
    setOpenImage(false);
    setPictureSelected(true);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const getImage = (v, i) => {
    // console.log("vData", v, i);

    if (v?.documentId !== memoryImages[i]?.documentId) {
      memoryImages.push(v);
      setMemoryImages([...memoryImages]);
    }
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
        alert.show("Postcard created successfully");

        if (!postcardsState.postcardsScrollState.hasMore) {
          postCardWrapperNode.scrollLeft -= 10;

          storeDispatch(setReplacePreviousByPage(true));
          storeDispatch(
            setPostcardsScrollState({
              ...postcardsState.postcardsScrollState,
              hasMore: true,
            })
          );

          setTimeout(() => {
            postCardWrapperNode.scrollLeft += 140;
          }, 100);
        }

        let obj = {
          base64: postcardDetails.postcardPicture,
          description: postcardDetails.description,
          documentID: documentID,
          name: postcardDetails.name,
          pk: val.data.ugKey,
          searchable: 1,
        };

        uploadConnections(val.data.ugKey);

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

  const uploadConnections = (postCardKey) => {
    for (var i = 0; i < connectPeople.length; i++) {
      // console.log("NewMembers", connectPeople[i]);
      const params = JSON.stringify({
        ugKey: postCardKey,
        entKey: connectPeople[i].entKey,
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
    handleClose();
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
      // console.log(val.data);
      if (val.data.documentID !== null) {
        let item = {
          date: Date.now(),
          documentId: val.data.documentId,
          image: postcardDetails.base64,
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
        createPostcardAPIFunction(val.data.documentID);

        setOpen(false);
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      } else {
        alert.show("Postcard creation failed");
      }
    });
  };

  const callCreatePostCardAPIs = () => {
    setIsLoading(true);
    if (isPictureSelected) {
      uploadPostcardPicture();
    } else {
      createPostcardAPIFunction(postcardDetails.base64DocumentID);
    }
  };

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

  const deleteCardItem = (data, index) => {
    // console.log(index);

    // console.log("Value:", connectPeople[index].entKey);
    connectPeople.splice(index, 1);
    setConnectPeople([...connectPeople]);
  };

  // const getImageByDocumentId = (id, index, status) => {
  //   // console.log("Calling image API for ID:", id);
  //   getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
  //     // console.log("this is Image val", val);

  //     if (val.data !== null) {
  //       const imageFile = val.data.dataBase64;
  //       const mimeType = val.data.mimeType;
  //       let srcValue = `data:${mimeType};base64,${imageFile}`;
  //       if (status === 5) {
  //         let postCardItems = postcardArrayData;
  //         let item = { ...postCardItems[index] };

  //         item.base64 = srcValue;
  //         postCardItems[index] = item;
  //         setPostcardArrayData(postCardItems);
  //         // console.log("Postcard Array ", postcardArrayData);

  //         dispatch({
  //           type: "SET_POSTCARDS_DATA",
  //           postcardsData: postcardArrayData,
  //         });
  //       }
  //     } else if (val.status === UNAUTH_KEY) {
  //       // console.log("Setting to 0");
  //       localStorage.setItem("user-info-token", 0);
  //       dispatch({
  //         type: "SET_USER_TOKEN",
  //         reducerUserToken: 0,
  //       });
  //     } else {
  //       // console.log("document is null");
  //     }
  //   });
  // };

  const getConnection = (v, i) => {
    // console.log("vData", v, i);
    var index = connectPeople.findIndex((x) => x.entKey === v.entKey);
    if (index === -1) {
      connectPeople.push(v);
      setConnectPeople([...connectPeople]);
      // console.log("connectPeople", connectPeople);
    }
  };

  const getDestinationData = (v, i) => {
    // console.log("vData", v);

    history.push(`/destinations/view-destination/${v.key}`);

    // console.log("selectedDestination", selectedDestination);
  };

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[2]);

      setPostcardDetails({
        ...postcardDetails,
        postcardPicture: reducerDefaultPictures[6].base64Value,
        base64DocumentID: reducerDefaultPictures[6].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  useEffect(() => {
    //initPostcardsValue();
    // console.log("postcardDetails", postcardDetails);
  }, []);

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_POSTCARDS_DATA",
        postcardsData: docsData,
      });
    }
  }, [redirectNow]);

  const firstMount = useRef(true);

  useEffect(() => {
    if (!firstMount.current) {
      getStories({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [storiesState.storiesPageNumber, reducerVisitorID, userToken, getStories]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (storiesState.stories.length === 0) {
        getStories({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [reducerVisitorID, userToken, getStories, storiesState.stories.length]);

  return (
    <div className="home">
      <InfiniteScroll
        dataLength={storiesState.featuredStoriesScrollState.items.length}
        next={() =>
          storeDispatch(
            setStoriesPageNumber(storiesState.storiesPageNumber + 1)
          )
        }
        hasMore={storiesState.featuredStoriesScrollState.hasMore}
        loader={
          <div className="home__scroll-more-loader-container">
            <Shimmer
              width={600}
              height={100}
              className="featured-stories__shimmer"
            />
          </div>
        }
        height={"100vh"}
        scrollThreshold={0.8}
        className="home__infinite-scroll"
      >
        <div className="home__root-container">
          <div className="home__container">
            <div className="home__containerHead">
              <h3>Home Sweet Home</h3>
              <ButtonAtom fontSize="medium" onClick={handleOpen}>
                + ADD POST
              </ButtonAtom>
            </div>

            <div className="home__content">
              <PostCards
                postCardWrapper={postCardWrapper}
                postCardWrapperNode={postCardWrapperNode}
                leftChevronEnabled={postcardsLeftChevronEnabled}
                setLeftChevronEnabled={setPostcardsLeftChevronEnabled}
                rightChevronEnabled={postcardsRightChevronEnabled}
                setRightChevronEnabled={setPostcardsRightChevronEnabled}
              />
              <RecentDestinations getDestinationData={getDestinationData} />
              <RecentNotes />
              <FeaturedStories
                storiesQueryState={storiesQueryState}
                getStories={getStories}
              />
            </div>
          </div>

          {/* <Route path="/postcard/view-postcard">
        <ViewPostcard />
      </Route> */}

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
        </div>
      </InfiniteScroll>

      <Modal
        open={open}
        onClose={!isBlocking ? handleClose : confirmationBox}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {isLoading ? (
            <div className="modalLoader">
              <Oval color="#00BFFF" />
            </div>
          ) : (
            <section className="home__add-post-modal">
              <header className="home__add-post-modal-header">
                <ChevronLeft
                  className="home__add-post-modal-chevron-left"
                  onClick={handleClose}
                />
                <h3>Add Post</h3>
              </header>

              <main className="home__add-post-modal-content-container">
                <div className="home__add-post-modal-bio-data">
                  <div className="home__add-post-modal-image-container">
                    <div className="home__add-post-modal-image-wrapper">
                      <img
                        className="home__add-post-modal-image"
                        alt=""
                        src={
                          postcardDetails.postcardPicture || ImagePlaceholder
                        }
                        onClick={
                          postcardDetails.postcardPicture && handleImageOpen
                        }
                      />
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
                          alt=""
                          src={photoUrl}
                          width="500"
                          height="500"
                          // onClick={handleImageOpen}
                          controls
                        />
                      </Box>
                    </Modal>
                    <div class="image-upload">
                      <Edit onClick={openImageUploaderBox} />
                      <input
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

                  <div className="home__add-post-modal-searchable-toggle">
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

                  <div className="home__add-post-modal-name-container">
                    <h5 className="home__add-post-modal-name-heading">Name</h5>
                    <div className="home__add-post-modal-name-input-container">
                      <input
                        type="text"
                        placeholder="Write name here."
                        value={postcardDetails.name}
                        onChange={changeTitle}
                      />
                    </div>
                  </div>

                  <div className="home__add-post-modal-description-container">
                    <h5 className="home__add-post-modal-description-heading">
                      Description
                    </h5>
                    <div className="home__add-post-modal-description-input-container">
                      <textarea
                        className="home__add-post-modal-description-input"
                        placeholder="Write Description here."
                        value={postcardDetails.description}
                        onChange={changeDescription}
                      />
                    </div>
                  </div>
                </div>

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
              </main>

              <AddOverlay
                isOpen={collapsibleButton}
                closeHandler={handleTriggerClose}
                includeAddMedia
                includeAddConnection
                includeAddDestination
                includeAddActivity
              />

              {/* // <CollapsibleForPostcard
                //   getImage={getImage}
                //   getConnection={getConnection}
                //   handleTriggerClose={handleTriggerClose}
                //   mediaComponentActive={mediaComponentActive}
                //   // onClose={handleTriggerClose}
                // /> */}

              <footer className="home__add-post-modal-footer">
                <Add
                  className="home__add-post-modal-add-icon"
                  onClick={handleTriggerOpen}
                />

                <ButtonAtom
                  variant="filled"
                  fontSize="medium"
                  onClick={createPostcard}
                >
                  CREATE POSTCARD
                </ButtonAtom>

                <div></div>
              </footer>
            </section>
          )}
        </Box>
      </Modal>

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

export default withRouter(Home);
