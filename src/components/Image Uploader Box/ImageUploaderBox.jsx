import { useState, useEffect, useRef } from "react";
import { useAlert } from "react-alert";
import uuid from "react-uuid";
import { Oval } from "react-loader-spinner";

import "./ImageUploaderBox.css";

import { MenuOpen, Close, Photo } from "@mui/icons-material";
import { Box, Dialog, DialogContent, Modal } from "@mui/material";
import {
  createBinaryFromURL
} from "config/authentication/AuthenticationApi";
import ButtonAtom from "components/Atoms/Button/Button";
import { UNAUTH_KEY } from "assets/constants/Contants";
import Cropper from "../Cropper/Cropper";
import imageToBase64 from "image-to-base64/browser";
import { useStateValue } from "config/context api/StateProvider";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function ImageUploaderBox({
  title,
  showImageUploader,
  setShowImageUploader,
  handleDone,
  mimeType,
  uploadImageFromPC,
  inputRef,
  getImageData,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, isLoading] = useState(false);
  const [urlValue, setUrlValue] = useState(null);
  const [tempImg, setTempImg] = useState(null);
  const alert = useAlert();
  const [{ userToken, reducerVisitorID }, dispatch] =
    useStateValue();
  const handleClose = (e) => {
    setOpen(false);
  };
  // const inputRef = useRef(null);
  const [openImageUploader, setOpenImageUploader] = useState(false);
  const handleImageUploaderOpen = () => setOpenImageUploader(true);
  const handleImageUploaderClose = (e) => {
    setOpenImageUploader(false);
    setShowImageUploader(false);
  };

  // const uploadImageFromPC = () => {
  //   inputRef.current.click();
  // };

  // console.log("base64Response mimeType", mimeType); // Logs an error if there was one

  const convertURLToBase64 = () => {
    if (urlValue !== null) {
      isLoading(true);
      // console.log("url pasted");
      // console.log("url pasted", urlValue);
      imageToBase64(urlValue) // Image URL
        .then((response) => {
          // console.log("base64Response", response); // "iVBORw0KGgoAAAANSwCAIA..."
          debugger;
          setTempImg(`data:png;base64,${response}`);
          getImageData({ mimeType: "image/jpeg", imageName: uuid() });
          handleOpen();
          isLoading(false);
        })
        .catch((error) => {
          // console.log("base64Response Error", error); // Logs an error if there was one
          isLoading(false);
        });
    } else {
      alert.show("URL field is empty");
    }
  };

  // const convertURLToBase64 = () => {
  //   let params = {
  //     documentName: urlValue,
  //     pk: 0
  //   }
  //   createBinaryFromURL(userToken, params, reducerVisitorID).then(function (val) {
  //     if (val) {
  //       console.log("Updating", val);
  //       if (val.statusText === "OK") {
  //         debugger;
  //       }

  //       if (val.status === UNAUTH_KEY) {
  //         // console.log("Setting to 0");
  //         localStorage.setItem("user-info-token", 0);
  //         dispatch({
  //           type: "SET_USER_TOKEN",
  //           reducerUserToken: 0,
  //         });
  //       }
  //     }
  //   });
  // }
  useEffect(() => {
    if (showImageUploader) {
      handleImageUploaderOpen();
    }
  }, [showImageUploader]);

  // if (loading) {
  //   return (
  //     <div className="screenLoader">
  //       <Oval color="#00BFFF" height={80} width={80} />
  //     </div>
  //   );
  // }

  return (
    <Dialog
      open={openImageUploader}
      onClose={handleImageUploaderClose}
      aria-labelledby="responsive-dialog-title"
      keepMounted
    >
      <div className="dialogueHeader">
        <Close onClick={handleImageUploaderClose} />
        <h2>{title}</h2>
        <div></div>
      </div>

      <DialogContent>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Cropper
              inputImg={tempImg}
              // onClose={handleClose}
              onClose={handleClose}
              onDone={handleDone}
              mimeType={mimeType}
            />
          </Box>
        </Modal>
        <div className="imageUploaderDialogue">
          {loading ? (
            <div className="imageUploaderDialogue__loader">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : (
            <>
              <div className="imageUploaderDialogue__section">
                <div className="inputDiv">
                  <input
                    placeholder="www.xjour.com/pic1"
                    type="text"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                  />
                </div>
                <ButtonAtom variant="filled" onClick={convertURLToBase64}>
                  Paste Picture URL
                </ButtonAtom>

                {/* <button
            className="primaryButtonAlpha"
            onClick={handleDoneURLToBase64}
          >
            Upload Picture
          </button> */}
              </div>

              <div className="imageUploaderDialogue__section">
                <div className="svgDiv">
                  <Photo />
                  {/* <img src="https://cdn-icons-png.flaticon.com/512/3342/3342137.png" /> */}
                </div>
                <ButtonAtom
                  variant="filled"
                  onClick={() => uploadImageFromPC(inputRef)}
                >
                  Import From PC
                </ButtonAtom>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploaderBox;
