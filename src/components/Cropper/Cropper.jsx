import React, { useEffect, useState } from "react";
import "./Cropper.css";
import ReactCrop from "react-image-crop";
import { IconButton } from "@mui/material";
import { Close, Done } from "@mui/icons-material";
import { useAlert } from "react-alert";

function Cropper({
  inputImg,
  onClose,
  onDone,
  mimeType,
  handleImageUploaderClose,
}) {
  const [src, selectFile] = useState(inputImg);
  const [crop, setCrop] = useState("");

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const alert = useAlert();

  function getCroppedImg() {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    // console.log("Cropped Result", canvas);
    // console.log("Cropped Result", crop);
    // New lines to be added
    // const pixelRatio = window.devicePixelRatio;
    // canvas.width = crop.width * pixelRatio;
    // canvas.height = crop.height * pixelRatio;
    // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    // ctx.imageSmoothingQuality = "high";
    if (crop.height !== 0 || crop.width !== 0) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const base64Image = canvas.toDataURL(mimeType);
      setResult(base64Image);
      // console.log("Cropped Result", base64Image);
    } else {
      alert.show("Area not selected");
    }
  }

  useEffect(() => {
    // console.log("result MimeType", result);
  }, [result]);

  const closeCropper = () => {
    // console.log("close cropper");
    selectFile(null);
    onClose();
    handleImageUploaderClose();
  };
  const doneCropping = () => {
    // console.log("done cropper");
    if (result == null) {
      onDone(src);
      selectFile(null);
      debugger;
      // setOpenImageUploader(false);
    } else {
      selectFile(null);
      onDone(result);
      debugger;
      // setOpenImageUploader(false);
    }
    onClose();
  };

  useEffect(() => {
    // console.log("fileOpen in Cropper", src);
  }, [src]);
  return (
    <div className="cropper">
      {src && (
        <div className="cropper__body">
          {result ? (
            <img src={result} alt="cropped-Image" />
          ) : (
            <ReactCrop
              src={src}
              onImageLoaded={setImage}
              crop={crop}
              onChange={setCrop}
            />
          )}
          <div className="cropper__buttons">
            <button
              className="primaryButtonActive"
              // disabled={!crop}
              onClick={getCroppedImg}
            >
              Crop Image
            </button>
            <div className="closeDoneButtons">
              <IconButton className="doneButton" onClick={doneCropping}>
                <Done />
              </IconButton>
              <IconButton className="closeButton" onClick={closeCropper}>
                <Close
                //  onClick={onClose}
                />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      {/* {result && (
        <div>
          {" "}
          <img src={result} alt="cropped-Image" />
        </div>
      )} */}
    </div>
  );
}

export default Cropper;
