import React, { useState, useEffect } from "react";
import "./ImageBoxImages.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import SimpleDialogBox from "../../../../Dialog Box/SimpleDialogBox";
import { Oval } from "react-loader-spinner";
import { getPrivateDocument,updateMemoryImageDetail } from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";
import { UNAUTH_KEY } from "assets/constants/Contants";
import { MuiTextField } from "components/MuiComponents/MuiComponents";
import Button from "components/Atoms/Button/Button"
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "10px",
  borderRadius: "5px"
};

function ImageBoxImages({
  data,
  onItemClick,
  handleClick,
  index,
  clickedImg,
  handelRotationRight,
  setClickedImg,
  handelRotationLeft,
}) {
  const [
    {
      userToken,
      reducerVisitorID,
    },
    dispatch,
  ] = useStateValue();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [imageDetail, setImageDetail] = useState({
    pk: "",
    documentName: "",
    fileName: "",
    description: "",
    img: "",
    size: "",
    versioning: "",
    timestampRetention: ""
  })
  const handleOpen = () => {
    if (data) {
      console.log("dataImg", data);
      setOpen(true);
      handleClick(data, index, data.documentId);
    }
  };
  useEffect(() => {
    console.log("Printing Image Data", data);
    debugger;
    getPrivateDocument(userToken, data?.documentId, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("this is Image val", val);
        debugger;
        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          let srcValue = `data:image/jpg;base64, ${imageFile}`;
          data.image=srcValue;
          setImageDetail({
            imageDetail, pk: val.data.pk,
            documentName: val.data.documentName,
            description: val.data.description,
            img: srcValue,
            fileName: val.data.fileName,
            size: val.data.size,
            versioning: val.data.versioning,
            timestampRetention: val.data.timestampRetention
          })
        }
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  }, []);

  const handleImageDetailUpdate = ((e) => {
    e.preventDefault();
    const params = {
      pk: imageDetail.pk,
      documentName: imageDetail.documentName,
      description: imageDetail.description,
    };
    updateMemoryImageDetail(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log(val.data);
          alert("Image Detail updated successfully");
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
  })

  const handleFormDetails = (value, key) => {

    if (["documentName", "description"].includes(key)) {
      const limitPerKey = {
        documentName: [
          50,
          () => {
            alert(
              `Max ${limitPerKey[key][0]} characters are allowed for '${key}'!`
            );
          },
        ],
        description: [
          100,
          () => {
            alert(
              `Max ${limitPerKey[key][0]} characters are allowed for '${key}'!`
            );
          },
        ],
      };

      if (value.length > limitPerKey[key][0]) {
        limitPerKey[key][1]();
        return;
      }
    }

    setImageDetail((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  if (data) {
    if (!data.isLoaded) {
      return (
        <div className="ImageBoxImages__loader">
          <Oval color="#00BFFF" />
        </div>
      );
    }
  }
  return (
    <div className="imageBoxImages">
      <div className="imageBoxImages__body">
        <img
          // onError={(e) => (e.target.style.display = "none")}
          src={data?.image}
          alt=""
          className="imageBoxImages__image"
          onClick={handleOpen}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <SimpleDialogBox
              index={index}
              onItemClick={onItemClick}
              dataValue={data}
              modalClose={handleClose}
            />
            {/* {clickedImg && (
              <Modal
                clickedImg={SampleImg}
                handelRotationRight={handelRotationRight}
                setClickedImg={clickedImg}
                handelRotationLeft={handelRotationLeft}
              />
            )} */}
            <Box className="imageDialog">
              {clickedImg && (
                <img
                  style={{ borderRadius: "12px" }}
                  src={imageDetail.img}
                  width="400"
                  height="400"
                  onClick={handleOpen}
                  alt=""
                  controls
                />
              )}
              <Box sx={{
                '& > :not(style)': { m: 1 }
              }}>
                <Box>
                  <Box className="imageDialog_fields">
                    <Typography className="imageDialog_fields_title">FileName:</Typography>
                    <Typography>{imageDetail.fileName}</Typography>
                  </Box>
                  <Box className="imageDialog_fields">
                    <Typography className="imageDialog_fields_title">Size:</Typography>
                    <Typography>{imageDetail.size}</Typography>
                  </Box>
                  <Box className="imageDialog_fields">
                    <Typography className="imageDialog_fields_title">TimestampRetention:</Typography>
                    <Typography>{imageDetail.timestampRetention}</Typography>
                  </Box>
                  <Box className="imageDialog_fields">
                    <Typography className="imageDialog_fields_title">Versioning:</Typography>
                    <Typography>{imageDetail.versioning}</Typography>
                  </Box>
                </Box>
                <MuiTextField
                  label="Document Name"
                  sx={{ width: "300px" }}
                  value={imageDetail.documentName}
                  additionalProps={{
                    onChange: (event) =>
                      handleFormDetails(event.target.value, "documentName"),
                    helperText: "Max 50 characters",
                  }}
                />
                <MuiTextField
                  label="Description"
                  value={imageDetail.description}
                  additionalProps={{
                    onChange: (event) =>
                      handleFormDetails(event.target.value, "description"),
                    helperText: "Max 200 characters",
                    multiline: true,
                    rows: 4,
                  }}
                />
                <Button
                  text="Save"
                  variant="filled"
                  fontSize="medium"
                  onClick={(event) => handleImageDetailUpdate(event)}
                // isDisabled={isSaving}
                />
              </Box>
            </Box>
            <div className="leftRight__buttons">
              <div className="leftButton">
                <IconButton onClick={handelRotationLeft}>
                  <ArrowLeft />
                </IconButton>
              </div>
              <div className="rightButton">
                <IconButton onClick={handelRotationRight}>
                  <ArrowRight />
                </IconButton>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ImageBoxImages;
