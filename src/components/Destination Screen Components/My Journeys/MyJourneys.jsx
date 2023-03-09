import React, { useEffect, useRef, useState } from "react";
import "./MyJourneys.css";
import JourneyCards from "./Journey Cards/JourneyCards";
import { useHistory } from "react-router";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Oval } from "react-loader-spinner";
import { ChevronLeft } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createJourneyAPI } from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";
import { useAlert } from "react-alert";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  height: "30vh",
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};
function MyJourneys() {
  const [
    { userToken, reducerJournies, reducerDefaultPictures, reducerVisitorID },
    dispatch,
  ] = useStateValue();
  const [switchPage, setSwitchPage] = useState(false);
  const [journeyInfo, setJourneyInfo] = useState({
    name: "",
  });
  const [myJourniesArray, setMyJourniesArray] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState([]);
  const [newJourniesArray, setNewJourniesArray] = useState([]);
  const history = useHistory();
  const alert = useAlert();
  const [redirectNow, setRedirectNow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const myJourneysWrapper = useRef(null);

  // const scrollJourneys = (scrollOffset) => {
  // console.log("button Pressed");
  console.log("reducerJournies", reducerJournies);
  //   myJourneysWrapper.current.scrollTop += scrollOffset;
  // };

  const handleOpen = () => {
    setOpen(true);
    setIsBlocking(false);
  };
  const handleClose = () => setOpen(false);
  let [isBlocking, setIsBlocking] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [userImageDetails, setUserImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [userGroupDetails, setUserGroupDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });

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
    setJourneyInfo({ ...journeyInfo, name: e.target.value });
    setIsBlocking(true);
  };

  const getJourneyData = (v, i) => {
    // console.log("vData", v);
    setSelectedJourney({
      base64: v.base64,
      countrySvg: v.countrySvg,
      description: v.description,
      key: v.key,
      name: v.name,
      departureDate: v.followUpDateTime,
      arrivalDate: v.creationDateTime,
      displayName: v.displayName,
      latitude: v.latitude,
      longitude: v.longitude,
      searchable: v.searchable,
      index: i,
    });
    setSwitchPage(true);
    // console.log("selectedJourney", selectedJourney);
  };

  const createJourney = () => {
    setIsLoading(true);
    if (journeyInfo.name !== "") {
      const params = JSON.stringify({
        name: journeyInfo.name,
      });
      // console.log("Params", params);

      createJourneyAPI(userToken, params, reducerVisitorID).then(function (
        val
      ) {
        if (val) {
          setIsLoading(false);
          setJourneyInfo({ ...journeyInfo, name: "" });
          // console.log("create Journey API", val.data);
          alert.show("Journey created successfully");

          const valData = val.data.joKey;

          setJourneyInfo({
            ...journeyInfo,
            base64: null,
            countrySvg: null,
            description: null,
            documentID: null,
            key: valData,
            searchable: 0,
            latitude: null,
            longitude: null,
            followUpDateTime: null,
            creationDateTime: null,
            startDateTime: null,
            endDateTime: null,
            displayName: null,
            mapZoom: null,
            orderPosition: null,
          });

          let mimeType = "image/svg+xml";
          let svgValue = `data:${mimeType};base64,${val.data}`;

          let obj = {
            key: val.data.joKey,
            name: journeyInfo.name,
            description: null,
            configurations: null,
            base64: null,
            countrySvg: null,
            followUpDateTime: null,
            creationDateTime: null,
          };
          // uploadConnections(val.data.ugKey);
          const newArray = myJourniesArray.concat(obj);
          setNewJourniesArray(newArray);
          // myJourniesArray.push(obj);
          // setDocsData(newArray);
          // console.log("newArray", newArray);
          setRedirectNow(true);
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });

          // if (valData > 0) {
          //   history.push("/destinations/create-journey");
          // }
        }
      });
    } else {
      alert.show("Plase enter a name");
    }
  };

  useEffect(() => {
    console.log("reducerJournies", reducerJournies);
    if (reducerJournies) {
      if (reducerJournies.length > 0) {
        setMyJourniesArray(reducerJournies);
        setIsLoading(false);
        // console.log("reducerJournies", reducerJournies);
      } else {
        setIsLoading(false);
        setMyJourniesArray([]);
        // console.log("reducerJournies", reducerJournies);
      }
    }
  }, [reducerJournies]);

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_JOURNIES",
        reducerJournies: newJourniesArray,
      });
      handleClose();
      // history.push("/destinations/create-journey");
    }
  }, [redirectNow]);

  useEffect(() => {
    if (switchPage) {
      setSwitchPage(false);
      dispatch({
        type: "SET_SELECTED_JOURNEY",
        reducerSelectedJourney: selectedJourney,
      });
      history.push("/destinations/view-journey");
    }
  }, [switchPage]);

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

      setUserImageDetails({
        ...userImageDetails,
        base64: reducerDefaultPictures[5].base64Value,
        base64DocumentID: reducerDefaultPictures[5].documentID,
      });
      setUserGroupDetails({
        ...userGroupDetails,
        base64: reducerDefaultPictures[3].base64Value,
        base64DocumentID: reducerDefaultPictures[1].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  return (
    <div className="myJourneys">
      <div className="myDestination__header">
        <h3>My Journeys</h3>
        <button className="primaryButton" onClick={handleOpen}>
          + CREATE
        </button>
      </div>

      {isLoading ? (
        <div className="myDestination__loader">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
        <>
          {/* <div className="fullScrennScroll__buttons">
            <ArrowUpwardSharp onClick={() => scrollJourneys(-150)} />
            <ArrowDownward onClick={() => scrollJourneys(+150)} />
          </div> */}
          <div className="myJourneys__cards" ref={myJourneysWrapper}>
            {myJourniesArray.length <= 0 ? (
              <div className="myDestinations__empty">
                <h5>No Journeys</h5>
              </div>
            ) : (
              <>
                {[...myJourniesArray].reverse().map((v, i) => (
                  <JourneyCards
                    userGroupDetails={userGroupDetails}
                    key={v + i}
                    data={v}
                    index={i}
                    getJourneyData={getJourneyData}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}

      <Modal
        open={open}
        onClose={!isBlocking ? handleClose : confirmationBox}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal__container">
            <div className="modal__containerTop">
              <ChevronLeft onClick={handleClose} />
              <h3>My Journeys</h3>
            </div>

            <div className="modal__containerMid">
              <div className="groupNameDiv">
                <h5 className="groupMid__h5">Journey Name</h5>
                <div className="inputDiv">
                  <input
                    type="text"
                    placeholder="Write name here."
                    value={journeyInfo.name}
                    onChange={changeTitle}
                  />
                </div>
              </div>
            </div>

            <div className="modal__containerBottom">
              <button className="primaryButtonActive" onClick={createJourney}>
                Create Journey
              </button>
            </div>
          </div>
        </Box>
      </Modal>

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
  );
}

export default MyJourneys;
