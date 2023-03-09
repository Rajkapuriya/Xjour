
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {  useRouteMatch } from "react-router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './AnnotationDialog.css'
import MuiModal from "../Atoms/MuiModal/MuiModal";
import Button from "../Atoms/Button/Button";
import { Add } from "@mui/icons-material";
import {
    addBase64File,
    deleteDMSDocument,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";
import { Box, Modal, Autocomplete, TextField, Chip, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Divider, Typography } from "@mui/material";
import ImageBoxImages from "components/Memories Screen Components/Memories Imags/ImageBox/ImageBox Images/ImageBoxImages"
import "react-image-crop/dist/ReactCrop.css";
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import Cropper from "components/Cropper/Cropper";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "assets/constants/Contants";
import { getAnnotationDetail, addAnnotations, repositionAnnotation } from "config/authentication/AuthenticationApi";
import ImageUploaderBox from "components/Image Uploader Box/ImageUploaderBox";
import validator from "validator";
import { MuiAccordion } from "components/MuiComponents/MuiComponents";
import DeleteAnnotationItemModal from "./DeleteAnnotationItemModal/DeleteAnnotationItemModal";
import Dropdown from "components/Atoms/Dropdown/Dropdown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditAnnotationItemModal from "./EditAnnotationItemModal/EditAnnotationItemModel";
import DisplayAnnotationImages from "./DisplayAnnotationImages/DisplayAnnotationImages";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};
export default function AnnotationDialog(props) {
    const routeMatch = useRouteMatch();
    const groupKey = routeMatch.params.groupKey;
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [{ userToken, reducerMemoryImages, reducerVisitorID }, dispatch] =
        useStateValue();
    const [uploadImage, setUploadImage] = useState(null);
    const [mimeType, setMimeType] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const alert = useAlert();
    const [annotationFieldDetail, setAnnotationFieldDetail] = useState({
        headline: "",
        description: "",
        tag: "",
        images: "",
        link: "",
        rating: ""
    });
    const [annotationDetail, setAnnotationDetail] = useState([])
    const [annotationItemsExpanded, setAnnotationItemsExpanded] = useState([]);
    const [finalAnnotationDetail, setFinalAnnotationDetail] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const [memoryImages, setMemoryImages] = useState([]);
    // const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
    const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
    const [selectedAnnotationItem, setSelectedAnnotationItem] = useState();
    const [clickedImg, setClickedImg] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);

    const [showImageUploader, setShowImageUploader] = useState(false);
    const inputRef = useRef(null);
    const memImgWrapper = useRef(null);
    const [modals, setModals] = useState({
        isDeleteAnnotationItemModalOpen: false,
        isUpdateAnnotatioItemModalOpen: false,

    });
    const dropdownAnnotationItemTypeToModalTypeMap = useMemo(() => {
        return {
            deleteAnnotationItem: "isDeleteAnnotationItemModalOpen",
            update: "isUpdateAnnotatioItemModalOpen",
        };
    }, []);
    const handleModalToggle = useCallback(
        (type) => {
            const modalType = dropdownAnnotationItemTypeToModalTypeMap[type];

            if (!modalType) {
                return;
            }

            setModals((prev) => ({
                ...prev,
                [modalType]: !prev[modalType],
            }));
        },
        [dropdownAnnotationItemTypeToModalTypeMap]
    );
    const handleRemoveAnnotation = (AnnotationKey, index) => {
        setSelectedAnnotationItem(finalAnnotationDetail[index]);

        handleModalToggle("deleteAnnotationItem");
    };

    const renderModal = useMemo(() => {
        let modalKey;
        for (const [key, value] of Object.entries(modals)) {
            if (value === true) {
                modalKey = key;
            }
        }

        const modalToReturn = {
            isDeleteAnnotationItemModalOpen: (
                <DeleteAnnotationItemModal
                    isOpen={modals.isDeleteAnnotationItemModalOpen}
                    handleModalToggle={() => handleModalToggle("deleteAnnotationItem")}
                    annotationItemToDelete={selectedAnnotationItem}
                />
            ), isUpdateAnnotatioItemModalOpen: (
                <EditAnnotationItemModal
                    modalTitle="Update Annotation Item"
                    isOpen={modals.isUpdateAnnotatioItemModalOpen}
                    handleModalToggle={() => handleModalToggle("update")}
                    annotationItemToUpdate={selectedAnnotationItem}
                />
            ),
        };

        return modalToReturn[modalKey];
    }, [
        modals,
        selectedAnnotationItem,
        handleModalToggle,
    ]);

    const handleAnnotationItemEllipsisClick = (event, dataValue) => {
        setAnchorEl(event.target);
        setSelectedAnnotationItem(dataValue);
    };

    const onDropdownItemClick = (event, item, index) => {
        const itemType = item.name.toLowerCase();

        handleModalToggle(itemType);

        setAnchorEl(null);
    };
    const handleDropdownClose = () => {
        setAnchorEl(null);
    };
    // const scrollImages = (scrollOffset) => {
    //   console.log("button Pressed");
    //   memImgWrapper.current.scrollTop += scrollOffset;
    // };
    const {
        annotationDialog, setAnnotationDialog
    } = props;

    //Retrieve annotation data
    const getAnnotationData = () => {
        const params = {
            fObjectKey: parseInt(groupKey),
            fObjectType: "groups"
        };
        getAnnotationDetail(params, userToken, reducerVisitorID).then(function (val) {
            if (val) {
                if (val?.data) {
                    setAnnotationDetail(Object.entries(val?.data));
                    debugger;
                }
            } else if (val.status === UNAUTH_KEY) {
                localStorage.setItem("user-info-token", 0);
                dispatch({
                    type: "SET_USER_TOKEN",
                    reducerUserToken: 0,
                });
            }
        });
    }

    useEffect(() => {
        getAnnotationData();
    }, [])
    const handleAnnotationDetailExpansion = (annotationKey) => {

        console.log("Printing annotationExpanded", annotationItemsExpanded);
        console.log("Printing finalannotation", finalAnnotationDetail);

        let data = annotationItemsExpanded.map((dataValue, i) => {
            if (dataValue.pk === annotationKey) {
                return { status: !dataValue.status, pk: annotationKey };
            }
            else {
                return dataValue;
            }
        })
        setAnnotationItemsExpanded(data);
        debugger;
    };


    useEffect(() => {
        let data = annotationDetail.map(([key, dataValue], i) => {
            return dataValue;
        })
        let value = data.sort((a, b) => {
            return a.orderPosition - b.orderPosition;
        });
        console.log("Printing AnnotationDetail", value === data);
        let annotationexpand = value.map((dataValue, i) => {
            return { pk: dataValue.pk, status: false };
        })
        setAnnotationItemsExpanded(annotationexpand);
        setFinalAnnotationDetail(value);
    }, [annotationDetail])
    const handleDragEnd = async (result) => {
        console.log(
            "%conDragEnd result:",
            "background-color:darkseagreen;",
            result,
        );
        if (!result.destination) {
            return;
        }
        const {
            destination: { index: destinationIndex },
            source: { index: sourceIndex },
        } = result;
        debugger;


        if (sourceIndex === destinationIndex) {
            return;
        }

        let restAnnotationDetailToMove;
        restAnnotationDetailToMove = destinationIndex - sourceIndex
        let params = {
            annotationKey: finalAnnotationDetail[sourceIndex].pk,
            position: restAnnotationDetailToMove
        }
        debugger;
        repositionAnnotation(params, userToken, reducerVisitorID).then(function (val) {
            if (val) {
                if (val?.data) {
                    getAnnotationData();
                    debugger;
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
    const handleAddAnnotation = (annontationType) => {
        if (annontationType === "link") {
            if (validator.isURL(annotationFieldDetail[annontationType])) {
                setAnnotationFieldDetail({
                    ...annotationFieldDetail,
                    link: annotationFieldDetail[annontationType]
                })
                debugger;
            } else {
                alert.show("Enter valid Link");
                return;
            }
        }
        let params = {}
        if (annontationType === "image") {
            params = {
                fObjectKey: parseInt(groupKey),
                fObjectType: "groups",
                type: annontationType,
                jsonValue: JSON.stringify({ pictureDocumentID: memoryImagesTwo[0].documentId }),
                orderPosition: -1
            }
        }
        else if (annontationType === "images") {
            let imagesId = [...new Set(memoryImagesTwo.map((item) => item?.documentId))];
            params = {
                fObjectKey: parseInt(groupKey),
                fObjectType: "groups",
                type: annontationType,
                jsonValue: JSON.stringify({ images: imagesId }),
                orderPosition: -1
            }
        }
        else {
            params = {
                fObjectKey: parseInt(groupKey),
                fObjectType: "groups",
                type: annontationType,
                textValue: annotationFieldDetail[annontationType],
                orderPosition: -1
            }
        }
        addAnnotations(params, userToken, reducerVisitorID).then(function (val) {
            if (val) {
                if (val?.data) {
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
    }



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
        const imageVal = { image: e, date: Date.now() };
        memoryImages.push(imageVal);
        uploadMemoryImage(e);
        setOpen(false);
        setShowImageUploader(false);
    };

    // const initMemoryImagesUpdated = () => {
    //   setMemoryImagesTwo(reducerMemoryImages);
    //   console.log("Updated Array:", memoryImagesTwo);
    // };
    // useEffect(() => {
    //   console.log(userToken);
    //   //initMemoriesImage();
    //   initMemoryImagesUpdated();
    // }, [reducerMemoryImages]);

    const imageHandleChange = (event) => {
        debugger;
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
        debugger;
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

    if (isLoading) {
        return (
            <div className="screenLoader">
                <Oval color="#00BFFF" height={80} width={80} />
            </div>
        );
    }

    return (
        <MuiModal
            isModalOpen={annotationDialog.isOpen}
            modalTitle="Annotation Dialog"
            modalHeaderIcon={<EditIcon />}
            closeModalHandler={() => setAnnotationDialog({ ...annotationDialog, isOpen: false })}
            modalHeight="90vh"
            modalWidth="90%"
        >
            {renderModal}
            <div className="add-new-list-item-modal">
                <Box
                    id="add-new-list-item-modal__form"
                    className="add-new-list-item-modal__form"
                    component="form"
                    noValidate
                    autoComplete="off"
                >
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Headline</InputLabel>
                        <OutlinedInput
                            value={annotationFieldDetail.headline}
                            onChange={(e) => setAnnotationFieldDetail((prev) => ({
                                ...prev,
                                headline: e.target.value
                            }))
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                        edge="end"
                                    >
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <ArrowRightAltRoundedIcon onClick={() => handleAddAnnotation("headline")} />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Headline"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Description</InputLabel>
                        <OutlinedInput
                            value={annotationFieldDetail.description}
                            onChange={(e) => setAnnotationFieldDetail((prev) => ({
                                ...prev,
                                description: e.target.value
                            }))
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                        edge="end"
                                    >
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <ArrowRightAltRoundedIcon onClick={() => handleAddAnnotation("description")} />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Description"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel >Hyperlink</InputLabel>
                        <OutlinedInput
                            value={annotationFieldDetail.link}
                            onChange={(e) => setAnnotationFieldDetail((prev) => ({
                                ...prev,
                                link: e.target.value
                            }))
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                        // onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <ArrowRightAltRoundedIcon onClick={() => handleAddAnnotation("link")} />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Hyperlink"
                        />
                    </FormControl>
                    <TextField
                        value={annotationFieldDetail.rating}
                        onChange={(e) => {
                            console.log(e.target.value);
                            if (validator.isFloat(e.target.value)) {
                                setAnnotationFieldDetail((prev) => ({
                                    ...prev,
                                    rating: e.target.value
                                }))
                            }
                            if (e.target.value == "") {
                                setAnnotationFieldDetail((prev) => ({
                                    ...prev,
                                    rating: e.target.value
                                }))
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    edge="end"
                                >
                                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <ArrowRightAltRoundedIcon onClick={() => handleAddAnnotation("rating")} />
                                </IconButton>
                            ),
                        }}
                        label="Rating"
                    />
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Tags</InputLabel>
                        <OutlinedInput
                            value={annotationFieldDetail.tag}
                            onChange={(e) => setAnnotationFieldDetail((prev) => ({
                                ...prev,
                                tag: e.target.value
                            }))
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                        edge="end"
                                    >
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <ArrowRightAltRoundedIcon onClick={() => handleAddAnnotation("tag")} />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Tags"
                        />
                    </FormControl>
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
                            <Button onClick={() => memoryImagesTwo.length > 1 ? handleAddAnnotation("images") : handleAddAnnotation("image")}>Save</Button>
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
                    <DragDropContext
                        onDragEnd={(result) => {
                            handleDragEnd(result)
                        }
                        }
                    >
                        <Droppable droppableId={`${Date.now()}`}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        display: "grid",
                                        rowGap: "12px",
                                        width: "100%",
                                        position: "relative !important"
                                    }}
                                >
                                    {finalAnnotationDetail.length > 0 && finalAnnotationDetail.map((dataValue, index) => {
                                        let imagesData = JSON.parse(dataValue?.jsonValue)
                                        return (
                                            <div>
                                                <Draggable
                                                    key={dataValue.pk}
                                                    draggableId={`annotationKey-${dataValue.pk}`}
                                                    index={index}
                                                    className="raj"
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <MuiAccordion
                                                                expanded={annotationItemsExpanded[index].status}
                                                                accordionHeading={dataValue.type}
                                                                headerRemoveIcon={true}
                                                                handlers={{
                                                                    handleAccordionExpansion: () => {
                                                                        handleAnnotationDetailExpansion(dataValue.pk)
                                                                    },
                                                                    handleHeaderRemoveIconClick: () => {
                                                                        handleRemoveAnnotation(dataValue.pk, index);
                                                                    }
                                                                }}
                                                                additionalAccordionProps={{
                                                                    className: "annotation-group-items__annotation-item",
                                                                }}
                                                                additionalAccordionSummaryProps={{
                                                                    className: "annotation-group-items__annotation-item-header",
                                                                }}
                                                                additionalExpandIconProps={{
                                                                    className:
                                                                        "annotation-group-items__annotation-item-expand-icon",
                                                                }}
                                                                additionalMoreVertIconProps={{
                                                                    className:
                                                                        "annotation-group-items__annotation-item-ellipsis",
                                                                    onClick: (event) =>
                                                                        handleAnnotationItemEllipsisClick(event, dataValue),
                                                                }}
                                                                additionalAccordionHeadingProps={{
                                                                    className:
                                                                        "annotation-group-items__annotation-item-heading",
                                                                }}
                                                                additionalAccordionRemoveIconProps={{
                                                                    className:
                                                                        "annotation-group-items__annotation-item-remove-icon",
                                                                }}
                                                                accordionDetails={
                                                                    <>
                                                                        {dataValue.textValue && <Box className="annotation_data_field">
                                                                            <Typography className="annotation_type_heading">
                                                                                TextValue
                                                                            </Typography>
                                                                            <Typography >
                                                                                {dataValue.textValue || "-"}
                                                                            </Typography>
                                                                        </Box>}
                                                                        {dataValue.numericValue > 0 && <Box className="annotation_data_field">
                                                                            <Typography className="annotation_type_heading">
                                                                                Numeric Value
                                                                            </Typography>
                                                                            <Typography >
                                                                                {dataValue.numericValue || "-"}
                                                                            </Typography>
                                                                        </Box>}
                                                                        {dataValue?.type === "image" && <Box>
                                                                            <DisplayAnnotationImages
                                                                                imageId={imagesData.pictureDocumentID}
                                                                            />
                                                                        </Box>}
                                                                        {dataValue?.type === "images" && <Box>
                                                                            {imagesData.images.map((imageId) => {
                                                                                return <DisplayAnnotationImages
                                                                                    imageId={imageId}
                                                                                />
                                                                            })
                                                                            }
                                                                        </Box>}
                                                                    </>
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </div>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Dropdown
                        anchorEl={anchorEl}
                        handlers={{
                            onDropdownItemClick,
                            onCloseHandler: handleDropdownClose,
                        }}
                        menuItems={[
                            { name: "Update", icon: EditOutlinedIcon },
                        ]}
                    />
                </Box>
            </div>
        </MuiModal >
    );
}
