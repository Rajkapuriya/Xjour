import { useMemo, useState, useRef, useEffect } from "react";
import { useAlert } from "react-alert";
import { useStateValue } from "config/context api/StateProvider";
import { Box, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import { MuiTextField } from "components/MuiComponents/MuiComponents";
import Button from "components/Atoms/Button/Button";
import MuiModal from "components/Atoms/Modal/MuiModal";
import validator from "validator";
import { Add } from "@mui/icons-material";
import './EditAnnotationItemModal.css';
import ImageBoxImages from "components/Memories Screen Components/Memories Imags/ImageBox/ImageBox Images/ImageBoxImages";
import Cropper from "components/Cropper/Cropper";
import { UNAUTH_KEY } from "assets/constants/Contants";
import { updateAnnotations } from "config/authentication/AuthenticationApi";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import {
  addBase64File,
  deleteDMSDocument,
} from "config/authentication/AuthenticationApi";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minheight: "40vh",
};
export default function EditAnnotationItemModal(props) {
  const {
    isOpen,
    handleModalToggle,
    modalTitle, annotationItemToUpdate
  } = props;

  const imagesData = JSON.parse(annotationItemToUpdate?.jsonValue);
  const alert = useAlert();
  const [isSaving, setIsSaving] = useState(false);
  const [annotationFieldDetail, setAnnotationFieldDetail] = useState(annotationItemToUpdate);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState();
  const [uploadImage, setUploadImage] = useState(null);
  const [{ userToken, reducerMemoryImages, reducerVisitorID }, dispatch] =
    useStateValue();
  const [isLoading, setIsloading] = useState(false);
  const [clickedImg, setClickedImg] = useState(null);
  const memImgWrapper = useRef(null);
  const inputRef = useRef(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [mimeType, setMimeType] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [memoryImages, setMemoryImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = (e) => {
    // console.log(e);
    setOpen(false);
  };
  useEffect(() => {
    let data = imagesData
      ?.pictureDocumentID ? [{
        documentId: parseInt(imagesData?.pictureDocumentID),
        date: Date.now(),
        image: "",
        isLoaded: true,
      }] :
      imagesData?.images.map((value) => {
        return {
          documentId: parseInt(value),
          date: Date.now(),
          image: "",
          isLoaded: true,
        };
      });
    setMemoryImagesTwo(data);
    setIsEmpty(false);
  }, [])
  const handleDone = (e) => {
    // console.log(e);
    const imageVal = { image: e, date: Date.now() };
    memoryImages.push(imageVal);
    uploadMemoryImage(e);
    setOpen(false);
    setShowImageUploader(false);
  };
  const handleUpdateAnnotation = (annontationType) => {
    let params = {}
    if (annontationType === "link") {
      if (validator.isURL(annotationFieldDetail[annontationType])) {
        setAnnotationFieldDetail({
          ...annotationFieldDetail,
          textValue: annotationFieldDetail[annontationType]
        })
        params = {
          pk: annotationFieldDetail.pk,
          textValue: annotationFieldDetail.textValue
        }
      } else {
        alert.show("Enter valid Link");
        return;
      }
    }
    else if (annontationType === "image") {
      params = {
        pk: annotationFieldDetail.pk,
        jsonValue: JSON.stringify({ pictureDocumentID: memoryImagesTwo[0].documentId }),
      }
    }
    else if (annontationType === "images") {
      let imagesId = [...new Set(memoryImagesTwo.map((item) => item?.documentId))];
      params = {
        pk: annotationFieldDetail.pk,
        jsonValue: JSON.stringify({ images: imagesId }),
      }
    }
    else {
      params = {
        pk: annotationFieldDetail.pk,
        textValue: annotationFieldDetail.textValue
      }
    }
    console.log("Printing Params", params);
    updateAnnotations(params, userToken, reducerVisitorID).then(function (val) {
      handleModalToggle();
      if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });

    //Image update 
  }
  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.image);
    debugger;
    // console.log("item", item);
    // console.log("index", index);
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
  const uploadImageFromPC = (e) => {
    // console.log("uploadImageFromPC", e);
    inputRef.current.click();
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
    // console.log("Params", params);

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
        // console.log("memoryImagesTwoArray", memoryImagesTwo);
        if (memoryImagesTwo === undefined || memoryImagesTwo.length === 0) {
          setMemoryImagesTwo([item]);

          setIsloading(false);

          dispatch({
            type: "SET_MEMORY_IMAGE",
            reducerMemoryImages: [item],
          });
        } else {
          memoryImagesTwo.unshift(item);
          debugger;
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
  const imageHandleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png" || event.target.files[0].type === "image/svg" || event.target.files[0].type === "application/pdf" || event.target.files[0].type === "video/avi" || event.target.files[0].type === "video/mp4" || event.target.files[0].type === "image/tiff") {
        setMimeType(event.target.files[0].type);
      }
      else {
        setMimeType("binary/octet-stream");
      }
      setImageName(event.target.files[0].name);
      let reader = new FileReader();
      reader.onload = (e) => {
        setUploadImage(e.target.result);
        handleOpen();
      };
      reader.readAsDataURL(event.target.files[0]);
      // console.log(reader);
    }
  };

  const getImageData = (event) => {
    setMimeType(event.mimeType);
    setImageName(event.imageName);
  };
  return (
    <MuiModal
      isModalOpen={isOpen}
      closeModalHandler={!isSaving ? () => handleModalToggle() : null}
      modalTitle={modalTitle}
      modalHeaderIcon={<EditIcon />}
      modalHeight="90vh"
      modalWidth="90%"
    >
      {/* <div className="edit-Annotation-item-modal">{renderEditMode}</div> */}
      <Box
        id="edit-Annotation-item-modal__form"
        className="edit-Annotation-item-modal__form"
        component="form"
        noValidate
        autoComplete="off"
        sx={{ padding: "20px" }}
      >
        {annotationFieldDetail.type === "headline" && < MuiTextField
          label="Headline"
          value={annotationFieldDetail.textValue}
          additionalProps={{
            onChange: (e) => setAnnotationFieldDetail((prev) => ({
              ...prev,
              textValue: e.target.value
            })),
            helperText: "Max 50 characters",
          }}
        />}
        {annotationFieldDetail.type === "description" && <MuiTextField
          label="Description"
          value={annotationFieldDetail.textValue}
          additionalProps={{
            onChange: (e) => setAnnotationFieldDetail((prev) => ({
              ...prev,
              textValue: e.target.value
            })),
            helperText: "Max 4000 characters",
            rows: 4,
            multiline: true,
          }}
        />}
        {annotationFieldDetail.type === "link" && <MuiTextField
          label="Hyperlink"
          value={annotationFieldDetail.textValue}
          additionalProps={{
            onChange: (e) => setAnnotationFieldDetail((prev) => ({
              ...prev,
              textValue: e.target.value
            }))
          }
          }
        />}
        {annotationFieldDetail.type === "tag" && <MuiTextField
          label="Tag"
          value={annotationFieldDetail.textValue}
          additionalProps={{
            onChange: (e) => setAnnotationFieldDetail((prev) => ({
              ...prev,
              textValue: e.target.value
            }))
          }
          }
        />}
        {annotationFieldDetail.type === "rating" && <MuiTextField
          label="Rating"
          value={annotationFieldDetail.textValue}
          additionalProps={{
            onChange: (e) => {
              if (validator.isFloat(e.target.value)) {
                setAnnotationFieldDetail((prev) => ({
                  ...prev,
                  textValue: e.target.value
                }))
              }
              if (e.target.value == "") {
                setAnnotationFieldDetail((prev) => ({
                  ...prev,
                  textValue: e.target.value
                }))
              }
            }
          }}
        />}
        {(annotationFieldDetail.type === "image" || annotationFieldDetail.type === "images") &&
          <div className="AnnotationImages" ref={memImgWrapper}>
            {/* <div className="fullScrennScroll__buttons">
        <ArrowUpwardSharp onClick={() => scrollImages(-150)} />
        <ArrowDownward onClick={() => scrollImages(+150)} />
      </div> */}
            <div className="AnnontationImages__heading">
              <h3>Images </h3>
            </div>
            <div className="AnnotationImages__latest">
              <div className="AnnotationImages__images">
                <div className="uploadImageBox">
                  <Add onClick={openImageUploaderBox} />
                  <input
                    ref={inputRef}
                    type="file"
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
                    {memoryImagesTwo.map((v, i) => {
                      return <ImageBoxImages
                        key={i}
                        data={v}
                        index={i}
                        handleClick={handleClick}
                        clickedImg={clickedImg}
                        handelRotationLeft={handelRotationLeft}
                        handelRotationRight={handelRotationRight}
                        onItemClick={onItemClick}
                      />
                    })}
                  </>
                )}
              </div>
              {/* <Button onClick={() => memoryImagesTwo.length > 1 ? handleAddAnnotation("images") : handleAddAnnotation("image")}>Save</Button> */}
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
        }
        {isSaving && (
          <div className="edit-Annotation-item-modal__loader">
            <CircularProgress />
          </div>
        )}

        <div className="edit-Annotation-item-modal__action-buttons">
          <Button
            text="Save"
            variant="filled"
            fontSize="medium"
            isDisabled={isSaving}
            onClick={(event) => handleUpdateAnnotation(annotationItemToUpdate.type)}
          />
          <Button
            text="Cancel"
            fontSize="medium"
            onClick={() => handleModalToggle()}
            isDisabled={isSaving}
          />
        </div>
      </Box>
    </MuiModal>
  );
}
