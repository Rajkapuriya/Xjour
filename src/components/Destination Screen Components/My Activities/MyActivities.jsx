import { Box, Modal } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";

import { useStateValue } from "../../../config/context api/StateProvider";
import CreateActivities from "./Create Activities/CreateActivities";
import "./MyActivities.css";
import MyActivityCards from "./MyActivity Cards/MyActivityCards";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
function MyActivities() {
  const [{ userToken, reducerMyActivities }, dispatch] = useStateValue();
  const [activitiesArrayData, setActivitiesArrayData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setIsBlocking(false);
  };
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  let [isBlocking, setIsBlocking] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(true);

  const myActivitiesWrapper = useRef(null);

 

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

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

  useEffect(() => {
    if (reducerMyActivities) {
      if (reducerMyActivities.length > 0) {
        setIsloading(false);
        setActivitiesArrayData(reducerMyActivities);
      } else {
        setIsloading(false);
        setActivitiesArrayData([]);
      }
    }
  }, [reducerMyActivities]);

  if (isLoading) {
    return (
      <div className="myDestination__loader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  const createActivityFunction = () => {
    // history.push("/destinations/create-activities");
    handleOpen();
  };

  return (
    <>
      
      <div className="MyActivities">
        <div className="myActivities__header">
          <h3>My Activities</h3>

          <button className="primaryButton" onClick={createActivityFunction}>
            + CREATE
          </button>
        </div>

        {/* {myActivitiesWrapper.current.scrollTop == 0 && (
          )} */}

        <div className="myActivities__cards" ref={myActivitiesWrapper}>
          {[...activitiesArrayData].reverse().map((v, i) => (
            <MyActivityCards key={v + i} data={v} index={i} />
          ))}
        </div>

        <Modal
          open={open}
          onClose={!isBlocking ? handleClose : confirmationBox}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CreateActivities
              handleClose={handleClose}
              setIsBlocking={setIsBlocking}
            />
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
    </>
  );
}

export default MyActivities;
