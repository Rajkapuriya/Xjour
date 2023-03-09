import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Prompt, useHistory } from "react-router-dom";
import { Oval } from "react-loader-spinner";

import "./CreateNotes.css";

import { UNAUTH_KEY } from "assets/constants/Contants";

import { ImagePlaceholder } from "global/images";

import {
  addBase64File,
  createNotesAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  notesSelector,
  setNotesPageNumber,
  setReplacePreviousByPage,
} from "store/reducers/notes";
import {
  useCreateNoteMutation,
  useLazyRetrieveNotesQuery,
} from "store/endpoints/notes";

import { ChevronLeft, Edit } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";

import TextEditor from "./TextEditor";
import Cropper from "../../../Cropper/Cropper";
import ImageUploaderBox from "../../../Image Uploader Box/ImageUploaderBox";
import ToggleBar from "components/Atoms/Toggler/ToggleBar/ToggleBar";
import ToggleBarElement from "components/Atoms/Toggler/ToggleBar/ToggleBarElement";
import ChevronAtom from "components/Atoms/Chevron/Chevron";
import ButtonAtom from "components/Atoms/Button/Button";

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
function CreateNotes() {
  const history = useHistory();
  const alert = useAlert();
  const storeDispatch = useDispatch();

  const [
    {
      userToken,
      reducerAllNotes,
      reducerDefaultPictures,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();

  const notesState = useSelector(notesSelector);
  console.log(
    "%cnotesState in CreateNotes:",
    "background-color:darksalmon;",
    notesState
  );

  const [fetchNotes, retrieveNotesQueryState] = useLazyRetrieveNotesQuery();
  const [createNote, createNoteQueryState] = useCreateNoteMutation();

  const [quill, setQuill] = useState();
  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const [isLoading, setIsLoading] = useState(false);

  const [openImage, setOpenImage] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const [notesInfo, setNotesInfo] = useState({
    headline: "",
    base64: "",
    description: "",
    searchable: 1,
    configurations: null,
  });
  const [notesImageDetails, setNotesImageDetails] = useState({
    base64: null,
  });
  console.log(
    "%cnotesInfo and notesImageDetails:",
    "background-color:rgb(255, 89, 178);",
    notesInfo,
    notesImageDetails
  );

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

  const changeTitle = (e) => {
    setNotesInfo({
      ...notesInfo,
      headline: e.target.value,
    });
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
    setNotesImageDetails((prev) => ({ ...prev, base64: e }));
    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);
  };

  const callCreateAPI = () => {
    uploadNotesPicture();
  };

  const uploadNotesPicture = async () => {
    const base64result = notesImageDetails.base64.substr(
      notesImageDetails.base64.indexOf(",") + 1
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

    try {
      const addBase64FileResult = await addBase64File(
        userToken,
        params,
        reducerVisitorID
      );

      callCreateNotesAPI(addBase64FileResult.data?.documentID);
    } catch (error) {
      console.log(
        "%caddBase64FileResult error in CreateNotes.jsx:",
        "background-color:red;color:white;",
        error
      );
      alert.show("Notes Base64 File Upload Failed!");
    }

    // addBase64File(userToken, params, reducerVisitorID).then(function (val) {
    //   if (val) {
    //     // console.log(val.data);
    //     if (val.data.documentID != null) {
    //       let item = {
    //         date: Date.now(),
    //         documentId: val.data.documentId,
    //         image: notesImageDetails.base64,
    //         isLoaded: true,
    //       };
    //       if (
    //         memoryImagesArray === undefined ||
    //         memoryImagesArray.length === 0
    //       ) {
    //         setMemoryImagesArray([item]);

    //         dispatch({
    //           type: "SET_MEMORY_IMAGE",
    //           reducerMemoryImages: [item],
    //         });
    //       } else {
    //         memoryImagesArray.push(item);

    //         dispatch({
    //           type: "SET_MEMORY_IMAGE",
    //           reducerMemoryImages: memoryImagesArray,
    //         });
    //       }
    //       callCreateNotesAPI(val.data.documentID);
    //     } else {
    //       setIsLoading(false);
    //       alert.show("Postcard creation failed");
    //     }
    //   } else if (val.status === UNAUTH_KEY) {
    //     // console.log("Setting to 0");
    //     localStorage.setItem("user-info-token", 0);
    //     dispatch({
    //       type: "SET_USER_TOKEN",
    //       reducerUserToken: 0,
    //     });
    //   }
    // });
  };

  const callCreateNotesAPI = async (documentID) => {
    const config = JSON.stringify({
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      name: notesInfo.headline,
      searchable: notesInfo.searchable,
      configurations: config,
      description: quill,
    });
    // console.log("Params", params);

    try {
      await createNote({
        token: userToken,
        visitorID: reducerVisitorID,
        data: params,
      });

      alert.show("Note created successfully");
      history.push("/destinations/notes");

      if (notesState.recentNotesScrollState.hasMore === false) {
        if (notesState.notes.length % notesState.notesPerPage !== 0) {
          storeDispatch(setReplacePreviousByPage(true));
        }

        fetchNotes({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    } catch (error) {
      console.log(
        "%ccreateNote error:",
        "background-color:red;color:white;",
        error
      );
      alert.show("Create Note Failed!");
    }
  };

  const postNow = () => {
    if (quill !== null && notesInfo.headline && notesImageDetails.base64) {
      callCreateAPI();

      setIsLoading(true);
    } else {
      alert.show("Please fill the required fields");
    }
  };

  const changeSearchable = (visibility) => {
    const visibilityTypeToValueMap = {
      private: 0,
      public: 1,
    };

    setNotesInfo((prev) => ({
      ...prev,
      searchable: visibilityTypeToValueMap[visibility],
    }));
  };

  if (isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="create-notes">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      <header className="create-notes__header">
        <div className="create-notes__header-left">
          <ChevronAtom onClick={() => history.go(-1)} />
          <h1 className="create-notes__heading">Create Note</h1>
        </div>
        <div className="create-notes__header-right">
          <ToggleBar activeIndex={notesInfo.searchable}>
            <ToggleBarElement onClick={() => changeSearchable("private")}>
              PRIVATE
            </ToggleBarElement>
            <ToggleBarElement onClick={() => changeSearchable("public")}>
              PUBLIC
            </ToggleBarElement>
          </ToggleBar>
        </div>
      </header>
      <div className="create-notes__note-basic-details-container">
        <div className="inputDiv">
          <input
            type="text"
            placeholder="Enter Note Title"
            value={notesInfo.headline}
            onChange={changeTitle}
          />
        </div>

        <div className="create-notes__note-image-container">
          <div className="create-notes__note-image-upload-container">
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
            src={notesImageDetails?.base64 || ImagePlaceholder}
            onClick={notesImageDetails?.base64 && handleImageOpen}
            alt="Note"
            className="create-notes__note-image"
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
          onClose={handleCropperClose}
          onDone={handleDone}
          mimeType={mimeType}
        />
      </Modal>

      <TextEditor setQuill={setQuill} />

      <footer className="create-notes__footer">
        <ButtonAtom variant="filled" onClick={() => postNow()}>
          POST NOW
        </ButtonAtom>
      </footer>

      {showImageUploader && (
        <ImageUploaderBox
          title="Upload Notes Picture"
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

export default CreateNotes;
