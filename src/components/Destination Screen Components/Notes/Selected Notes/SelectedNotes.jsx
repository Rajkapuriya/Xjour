import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Prompt, useRouteMatch } from "react-router-dom";
import { useAlert } from "react-alert";
import { Oval } from "react-loader-spinner";
import { Buffer } from "buffer";
import { cloneDeep } from "lodash";
import ReactQuill from "react-quill";

import "./SelectedNotes.css";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.snow.css";

import { UNAUTH_KEY } from "assets/constants/Contants";
import ImagePlaceholder from "assets/images/image-placeholder.jpg";

import { useStateValue } from "config/context api/StateProvider";
import {
  addBase64File,
  updateNotesAPI,
} from "config/authentication/AuthenticationApi";

import {
  notesSelector,
  setMultiple,
  setNotes,
  setRecentNotesScrollState,
} from "store/reducers/notes";
import { useReadNoteQuery, useUpdateNoteMutation } from "store/endpoints/notes";

import { Avatar, Box, Modal } from "@mui/material";
import {
  ChevronLeft,
  Close,
  DeleteForever,
  Edit,
  SettingsSuggest,
} from "@mui/icons-material";

import Cropper from "components/Cropper/Cropper";
import DeleteOrHideDialogue from "components/Delete Or Hide Dialogue/DeleteOrHideDialogue";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import ChevronAtom from "components/Atoms/Chevron/Chevron";
import ToggleBar from "components/Atoms/Toggler/ToggleBar/ToggleBar";
import ToggleBarElement from "components/Atoms/Toggler/ToggleBar/ToggleBarElement";
import ButtonAtom from "components/Atoms/Button/Button";

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
function SelectedNotes() {
  const history = useHistory();
  const alert = useAlert();
  const storeDispatch = useDispatch();
  const routeMatch = useRouteMatch();
  const groupKey = routeMatch.params.groupKey;

  const [
    {
      reducerAllNotes,
      reducerNotes,
      userToken,
      reducerVisitorID,
      reducerMemoryImages,
    },
    dispatch,
  ] = useStateValue();

  const notesState = useSelector(notesSelector);
  console.log(
    "%cnotesState in SelectedNotes:",
    "background-color:darksalmon;",
    notesState
  );

  const readNoteQueryState = useReadNoteQuery({
    token: userToken,
    ugKey: groupKey,
  });
  const [updateNote, updateNoteQueryState] = useUpdateNoteMutation();
  console.log(
    "%creadNoteQueryState:",
    "background-color:orange;",
    readNoteQueryState
  );

  const [noteValue, setNoteValue] = useState(null);
  const [quillValue, setQuillValue] = useState("");
  console.log("%cnoteValue:", "background-color:rgb(0, 211, 148);", noteValue);
  const [updatedValue, setUpdatedValue] = useState(null);
  const [updateOption, setUpdateOption] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [notesCodes, setNotesCodes] = useState([]);

  const [memoryImagesArray, setMemoryImagesArray] =
    useState(reducerMemoryImages);
  const [notesInfo, setNotesInfo] = useState(null);
  let [isBlocking, setIsBlocking] = useState(false);
  const [deleteOrHideConfirmation, setDeleteOrHideConfirmation] =
    useState(false);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (readNoteQueryState.isSuccess) {
      if (readNoteQueryState?.data) {
        const decoder = Buffer.from(
          readNoteQueryState?.data?.description,
          "base64"
        ).toString("UTF-8");

        setNoteValue({ ...readNoteQueryState.data, description: decoder });
        setQuillValue(decoder);

        const configurations = JSON.parse(
          readNoteQueryState.data?.configurations
        );
        if (configurations?.pictureDocumentID) {
          setNotesInfo((prev) => ({
            ...prev,
            pictureDocumentID: configurations.pictureDocumentID,
          }));
        }
      }
    }
  }, [readNoteQueryState?.data, readNoteQueryState.isSuccess]);

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
    setNoteValue((prev) => ({
      ...prev,
      name: e.target.value,
    }));
    setIsBlocking(true);
  };

  const updateQuillValue = () => {
    setIsBlocking(true);
  };

  const updateNotes = () => {
    setUpdatedValue(Buffer.from(quillValue).toString("base64"));
    setUpdateOption(true);
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

    setNotesCodes({ ...notesCodes, base64Result: base64result });
    setOpenImage(false);
    setIsBlocking(true);
    setShowImageUploader(false);

    setNoteValue((prev) => ({
      ...prev,
      base64: e,
    }));
  };

  const callUpdateNotesAPI = async (documentID) => {
    const config = JSON.stringify({
      pictureDocumentID: documentID,
    });
    const params = JSON.stringify({
      pk: noteValue.pk,
      name: noteValue.name,
      searchable: noteValue.searchable,
      configurations: config,
      description: updatedValue,
    });
    // console.log("Params", params);
    try {
      const updateNoteResult = await updateNote({
        token: userToken,
        visitorID: reducerVisitorID,
        data: params,
      });

      if (updateNoteResult?.data) {
        setUpdateOption(false);
        setUpdatedValue(null);
        setIsBlocking(false);

        alert.show("Notes updated successfully");
      }
    } catch (error) {
      console.log(
        "%cupdateNote error:",
        "background-color:red;color:white;",
        error
      );
      alert.show("Update Note Failed!");
    }

    const notes = cloneDeep(notesState.notes);
    const editedNoteIndex = notes.findIndex((note) => note.pk === noteValue.pk);

    if (editedNoteIndex !== -1) {
      notes[editedNoteIndex].name = noteValue.name;
      notes[editedNoteIndex].description = updatedValue;
      notes[editedNoteIndex].base64 = noteValue.base64;
    }

    console.log("%ceditedNotes:", "background-color:lightreen;", notes);
    storeDispatch(
      setMultiple({
        notes,
        recentNotesScrollState: {
          ...notesState.recentNotesScrollState,
          items: notes,
        },
      })
    );

    history.push("/destinations/notes");
  };

  const updateNotesFunction = async () => {
    if (
      updatedValue != null ||
      updatedValue === true ||
      updateOption === true
    ) {
      if (notesCodes.base64Result != null) {
        const params = JSON.stringify({
          pk: 0,
          acl: 7429,
          fileName: imageName,
          documentName: mimeType + "/" + imageName,
          mimeType: mimeType,
          timestampDocument: Date.now(),
          dataBase64: notesCodes.base64Result,
          versioning: 0,
        });
        // console.log("Params", params);

        try {
          const addBase64FileResult = await addBase64File(
            userToken,
            params,
            reducerVisitorID
          );

          callUpdateNotesAPI(addBase64FileResult.data?.documentID);
        } catch (error) {
          console.log(
            "%caddBase64FileResult error in SelectedNotes.jsx:",
            "background-color:red;color:white;",
            error
          );
          alert.show("Notes Base64 File Upload Failed!");
        }

        // addBase64File(userToken, params, reducerVisitorID).then(function (val) {
        //   // console.log("Updating Notes", val.data);
        //   if (val.data != null) {
        //     let item = {
        //       date: Date.now(),
        //       documentId: val.data.documentId,
        //       image: notesInfo.base64,
        //       isLoaded: true,
        //     };
        //     if (
        //       memoryImagesArray === undefined ||
        //       memoryImagesArray.length === 0
        //     ) {
        //       setMemoryImagesArray([item]);

        //       dispatch({
        //         type: "SET_MEMORY_IMAGE",
        //         reducerMemoryImages: [item],
        //       });
        //     } else {
        //       memoryImagesArray.push(item);

        //       dispatch({
        //         type: "SET_MEMORY_IMAGE",
        //         reducerMemoryImages: memoryImagesArray,
        //       });
        //     }
        //     callUpdateNotesAPI(val.data?.documentID);
        //   } else if (val.status === UNAUTH_KEY) {
        //     // console.log("Setting to 0");
        //     localStorage.setItem("user-info-token", 0);
        //     dispatch({
        //       type: "SET_USER_TOKEN",
        //       reducerUserToken: 0,
        //     });
        //   } else {
        //     alert.show("Notes update failed");
        //     setIsLoading(false);
        //   }
        // });
      } else {
        callUpdateNotesAPI(notesInfo?.pictureDocumentID);
      }
    }
  };

  const deleteNotesButton = () => {
    if (deleteOrHideConfirmation === false) {
      setDeleteOrHideConfirmation(true);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    } else if (deleteOrHideConfirmation === true) {
      setDeleteOrHideConfirmation(false);
      // console.log("deleteOrHideConfirmation", deleteOrHideConfirmation);
    }
  };

  useEffect(() => {
    if (updatedValue != null || updateOption === true) {
      updateNotesFunction();
    }
  }, [updatedValue]);

  const changeSearchable = (visibility) => {
    const visibilityTypeToValueMap = {
      private: 0,
      public: 1,
    };

    setNoteValue((prev) => ({
      ...prev,
      searchable: visibilityTypeToValueMap[visibility],
    }));
    setIsBlocking(true);
  };

  if (readNoteQueryState.isLoading || updateNoteQueryState.isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  if (readNoteQueryState.isError) {
    return (
      <div className="selected-notes__fetch-error-container">
        <p className="selected-notes__fetch-error">SOME ERROR OCCURRED</p>
        <p className="selected-notes__fetch-error-text">
          {readNoteQueryState?.error?.message || readNoteQueryState?.error}
        </p>
        <ButtonAtom
          variant="filled"
          fontSize="medium"
          onClick={() => readNoteQueryState.refetch()}
        >
          Try Again
        </ButtonAtom>
      </div>
    );
  }

  if (!noteValue) {
    return <p className="selected-notes__no-data">No Data</p>;
  }

  return (
    <div className="selected-notes">
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />

      <header className="selected-notes__header">
        <div className="selected-notes__header-left">
          <ChevronAtom onClick={() => history.push("/destinations/notes")} />
          <h1 className="selected-notes__heading">View Note</h1>
        </div>

        <div className="selected-notes__header-right">
          <ToggleBar activeIndex={noteValue?.searchable}>
            <ToggleBarElement onClick={() => changeSearchable("private")}>
              PRIVATE
            </ToggleBarElement>
            <ToggleBarElement onClick={() => changeSearchable("public")}>
              PUBLIC
            </ToggleBarElement>
          </ToggleBar>
        </div>
      </header>

      <div className="selected-notes__note-basic-details-container">
        <div className="inputDiv">
          <input
            type="text"
            placeholder="Enter Note Title"
            value={noteValue?.name || ""}
            onChange={changeTitle}
          />
        </div>

        <div className="selected-notes__note-image-container">
          <div className="selected-notes__note-image-upload-container">
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
            src={noteValue?.base64 || ImagePlaceholder}
            alt="Note"
            className="selected-notes__note-image"
            onClick={noteValue?.base64 && handleImageOpen}
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
            src={noteValue?.base64}
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

      <ReactQuill
        theme="snow"
        value={quillValue}
        onChange={setQuillValue}
        onFocus={updateQuillValue}
        modules={Editor}
      />
      {/* <TextEditor setQuill={setQuill} newValue={value}/> */}
      {/* <h3>Selected notes</h3> */}

      <footer className="selected-notes__footer">
        <div></div>

        <ButtonAtom variant="filled" onClick={updateNotes}>
          UPDATE NOTES
        </ButtonAtom>

        <Close
          onClick={() => deleteNotesButton(noteValue?.pk)}
          className="selected-notes__footer-close-icon"
        />
      </footer>

      {deleteOrHideConfirmation && (
        <DeleteOrHideDialogue
          keyValue={noteValue?.pk}
          state="notes"
          deleteOrHideConfirmation={deleteOrHideConfirmation}
          setDeleteOrHideConfirmation={setDeleteOrHideConfirmation}
        />
      )}
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

export default SelectedNotes;
