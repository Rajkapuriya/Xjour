import React, { useState, useEffect, useRef } from "react";
import { Add, Close, FilterAlt } from "@mui/icons-material";
import "./MemoriesVideos.css";
import VideoBox from "./VideoBox/VideoBox";

import {
  addBase64File,
  deleteDMSDocument,
} from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";

import { IconButton } from "@mui/material";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";
import ImageUploaderBox from "../../Image Uploader Box/ImageUploaderBox";

function MemoriesVideos() {
  const [{ userToken, reducerMemoryVideos, reducerVisitorID }, dispatch] =
    useStateValue();
  const [uploadVideo, setUploadVideo] = useState(null);
  const [loader, isLoading] = useState(true);
  const [mimeType, setMimeType] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPrev, setVideoPrev] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const alert = useAlert();

  const [memoryVideos, setMemoryVideos] = useState(null);

  const [showImageUploader, setShowImageUploader] = useState(false);
  const inputRef = useRef(null);
  const memVidWrapper = useRef(null);

  // const scrollVideos = (scrollOffset) => {
  // console.log("button Pressed");
  //   memVidWrapper.current.scrollTop += scrollOffset;
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

  useEffect(() => {
    // console.log("reducerMemoryVideos", reducerMemoryVideos);
    if (reducerMemoryVideos) {
      if (reducerMemoryVideos.length > 0) {
        setMemoryVideos(reducerMemoryVideos);
        isLoading(false);
        // console.log("reducerMemoryVideos", reducerMemoryVideos);
      } else {
        isLoading(false);
        setMemoryVideos([]);
        // console.log("reducerMemoryVideos", reducerMemoryVideos);
      }
    }
  }, [reducerMemoryVideos]);

  const videoHandleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log("file Type", event.target.files[0]);
      setMimeType(event.target.files[0].type);
      setVideoName(event.target.files[0].name);

      let reader = new FileReader();
      reader.onload = (e) => {
        setVideoPrev(true);
        setUploadVideo(e.target.result);
        // handleOpen();
      };
      reader.readAsDataURL(event.target.files[0]);
      setVideoUrl(reader);
      // console.log("readerValue", reader);
      // console.log("readerValue", uploadVideo);
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setVideoName(event.imageName);
  };

  const uploadMemoryVideo = (e) => {
    isLoading(true);

    const base64result = uploadVideo.substr(uploadVideo.indexOf(",") + 1);
    // console.log("videoUrl", base64result);

    // console.log("Calling an API");
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: videoName,
      documentName: mimeType + "/" + videoName,
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: base64result,
      versioning: 0,
    });
    // console.log("Params", params);

    addBase64File(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Updating", val);
        alert.show("Video uploaded successfully");
        let item = {
          date: Date.now(),
          documentId: val.data.documentID,
          base64: uploadVideo,
          isLoaded: true,
        };
        if (memoryVideos === undefined || memoryVideos.length === 0) {
          setMemoryVideos([item]);

          isLoading(false);

          dispatch({
            type: "SET_MEMORY_VIDEOS",
            reducerMemoryVideos: [item],
          });
        } else {
          memoryVideos.unshift(item);
          isLoading(false);

          dispatch({
            type: "SET_MEMORY_VIDEOS",
            reducerMemoryVideos: memoryVideos,
          });
        }
        // memoryVideos.unshift(item);
        // isLoading(false);
        // setVideoPrev(false);
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

  const handleDone = (base64result) => {
    uploadMemoryVideo(base64result);
    setShowImageUploader(false);
    setVideoPrev(false);
  };

  // useEffect(() => {

  //   initMemoriesVideo();
  // }, []);

  const closePrev = () => {
    setVideoPrev(false);
    setUploadVideo(null);
  };

  const onItemClick = (i, index) => {
    console.log("onItemClick", i);
    console.log("onItemClick", index);
    deleteDMSDocument(userToken, i.documentId, reducerVisitorID).then(function (
      val
    ) {
      if (val) {
        console.log("delete API response >>", val.data);
        alert.show("Video deleted successfully");

        memoryVideos.splice(index, 1);
        setMemoryVideos([...memoryVideos]);
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

  return (
    <div className="MemoriesVideos" ref={memVidWrapper}>
      <div className="MemoriesVideos__heading">
        <h3>Videos </h3>
        <FilterAlt />
      </div>
      {loader ? (
        <div className="memoryVideos__loader">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
        <div className="MemoriesVideos__latest">
          <div className="MemoriesVideos__images">
            <div className="uploadImageBox">
              <Add onClick={openImageUploaderBox} />
              <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={videoHandleChange}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
            </div>

            {memoryVideos.length <= 0 ? (
              <div className="noImagesText">
                <h3>You have no Videos added </h3>
              </div>
            ) : (
              <>
               
                {memoryVideos.map((v, i) => (
                  <VideoBox data={v} onItemClick={onItemClick} index={i} />
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {videoPrev && (
        <video
          className="VideoInput_video"
          width="100%"
          height={400}
          controls
          src={uploadVideo}
        />
      )}
      {videoPrev && (
        <div className="videoActionButtons">
          <button className="primaryButton" onClick={handleDone}>
            Upload video
          </button>

          <IconButton
            onClick={closePrev}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#ee378a",
              color: "red"[600],
            }}
          >
            <Close style={{ color: "white" }} />
          </IconButton>
        </div>
      )}
      {/* <VideoInput width={400} height={300} /> */}
      {/* <div className="MemoriesVideos__latest">
        <div className="MemoriesVideos__images">
          {data.map((v, i) => (
            <VideoBox video={v.image} />
          ))}
        </div>
      </div> */}

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

export default MemoriesVideos;
