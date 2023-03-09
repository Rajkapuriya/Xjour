import { Add } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import {
  addBase64File,
  deleteDMSDocument,
} from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";
import FilterBy from "../../Filter Component/FilterBy";

import "./MemoriesImages.css";
import { Box, Modal } from "@mui/material";
import ImageBoxImages from "./ImageBox/ImageBox Images/ImageBoxImages";
import "react-image-crop/dist/ReactCrop.css";
// import { Box } from "@mui/system";
import Cropper from "../../Cropper/Cropper";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";
import ImageUploaderBox from "../../Image Uploader Box/ImageUploaderBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function MemoriesImages() {
  const [isLoading, setIsloading] = useState(false);
  const [{ userToken, reducerMemoryImages, reducerVisitorID }, dispatch] =
    useStateValue();
  const [uploadImage, setUploadImage] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const alert = useAlert();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [memoryImages, setMemoryImages] = useState([]);
  // const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);

  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);

  const memImgWrapper = useRef(null);

  // const scrollImages = (scrollOffset) => {
  //   console.log("button Pressed");
  //   memImgWrapper.current.scrollTop += scrollOffset;
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

  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.image);
    // console.log("item", item);
    // console.log("index", index);
  };

  const handelRotationRight = () => {
    // console.log("Right Button Pressed");
    const totalLength = memoryImagesTwo.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = memoryImagesTwo[0].image;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = memoryImagesTwo.filter((item) => {
      return memoryImagesTwo.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].image;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  const handelRotationLeft = () => {
    // console.log("Left Button Pressed");
    const totalLength = memoryImagesTwo.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = memoryImagesTwo[totalLength - 1].image;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = memoryImagesTwo.filter((item) => {
      return memoryImagesTwo.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].image;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  // Image slider and ImageModal Working  //
  

  const uploadMemoryImage = (e) => {
    setIsloading(true);
    const base64result = e.substr(e.indexOf(",") + 1);

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
    console.log("Params", params);
    debugger;

    addBase64File(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("Updating", val);
        if (val.statusText === "OK") {
          alert.show("Image uploaded successfully");
        }
        let item = {
          date: Date.now(),
          documentId: val.data.documentID,
          image: e,
          isLoaded: true,
        };
        console.log("memoryImagesTwoArray", memoryImagesTwo);
        debugger;
        if (memoryImagesTwo === undefined || memoryImagesTwo.length === 0) {
          setMemoryImagesTwo([item]);

          setIsloading(false);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: [item],
          });
        } else {
          memoryImagesTwo.unshift(item);
          setIsloading(false);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: memoryImagesTwo,
          });
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

  const handleClose = (e) => {
    // console.log(e);
    setOpen(false);
  };
  const handleDone = (e) => {
    // console.log(e);
    debugger;
    const imageVal = { image: e, date: Date.now() };
    memoryImages.push(imageVal);
    uploadMemoryImage(e);
    setOpen(false);
    setShowImageUploader(false);
  };

  const initMemoryImagesUpdated = () => {
    setMemoryImagesTwo(reducerMemoryImages);
    console.log("Updated Array:", memoryImagesTwo);
  };
  useEffect(() => {
    console.log(userToken);
    //initMemoriesImage();
    initMemoryImagesUpdated();
  }, [reducerMemoryImages]);

  const imageHandleChange = (event) => {
    debugger;
    if (event.target.files) {
      // console.log("file Type", event.target.files[0]);
      if (event.target.files.length > 1) {
        for (let i = 0; i < event.target.files.length; i++) {
          setMimeType(event.target.files[i].type);
          setImageName(event.target.files[i].name);
          let reader = new FileReader(event.target.files[i]);
          debugger;
          reader.onload = (e) => {
            setUploadImage(e.target.result);
            handleDone(e.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      } 
      else {
        setMimeType(event.target.files[0].type);
        setImageName(event.target.files[0].name);
        let reader = new FileReader();
        reader.onload = (e) => {
          setUploadImage(e.target.result);
          handleOpen();
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setImageName(event.imageName);
  };

  const onItemClick = (i, index) => {
    // console.log("onItemClick", i);
    console.log("onItemClick", i, index);
    console.log("onItemClick memoryImagesTwo", memoryImagesTwo);
    deleteDMSDocument(userToken, i.documentId, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        console.log("delete API response >>", val.data);

        var indexx = memoryImagesTwo.findIndex(
          (x) => x.documentId === i.documentId
        );
        if (indexx === -1) {
          memoryImagesTwo.splice(indexx, 1);
          console.log("checking index", indexx);
        } else {
          // setWayPoints([...wayPoints]);
          console.log("checking index", indexx);
        }

        memoryImagesTwo.splice(index, 1);
        alert.show("Image Deleted successfully");
        // setMemoryImagesTwo([...memoryImagesTwo]);
        dispatch({
          type: "SET_MEMORY_IMAGE",
          reducerMemoryImages: memoryImagesTwo,
        });
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

  useEffect(() => {
    console.log("UseEffect memoryImages:", reducerMemoryImages);
    if (typeof reducerMemoryImages === "undefined") {
      // console.log("You have no Images added!!");
      setIsEmpty(true);
    } else {
      if (reducerMemoryImages.length === 0) {
        // console.log("You have no Images Added!!");
        setIsEmpty(true);
      } else {
        setMemoryImagesTwo(reducerMemoryImages);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerMemoryImages]);

  if (isLoading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="memoriesImages" ref={memImgWrapper}>
      {/* <div className="fullScrennScroll__buttons">
        <ArrowUpwardSharp onClick={() => scrollImages(-150)} />
        <ArrowDownward onClick={() => scrollImages(+150)} />
      </div> */}
      <div className="memoriesImages__heading">
        <h3>Images </h3>
        <FilterBy sortBy={<h5>Date created</h5>} />
      </div>
      <div className="memoriesImages__latest">
        <div className="memoriesImages__images">
          <div className="uploadImageBox">
            <Add onClick={openImageUploaderBox} />
            <input
              ref={inputRef}
              type="file"
              multiple
              className="input-file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={imageHandleChange}
              onClick={(event) => {
                event.target.value = null;
              }}
            />
          </div>

          <Modal
            // open={uploadImage}
            // open={uploadImage !== null}
            open={open}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Cropper
                inputImg={uploadImage}
                // onClose={handleClose}
                onClose={handleClose}
                onDone={handleDone}
                mimeType={mimeType}
              />
            </Box>
          </Modal>

          {isEmpty ? (
            <div className="noImagesText">
              <h3>You have no Images added </h3>
            </div>
          ) : (
            <>
              {memoryImagesTwo.map((v, i) => (

                <ImageBoxImages
                  key={i}
                  data={v}
                  index={i}
                  handleClick={handleClick}
                  clickedImg={clickedImg}
                  handelRotationLeft={handelRotationLeft}
                  handelRotationRight={handelRotationRight}
                  onItemClick={onItemClick}
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

export default MemoriesImages;
