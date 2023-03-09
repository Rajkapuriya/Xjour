import React, { useState } from "react";
import "./VideoBox.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { PlayArrow } from "@mui/icons-material";
import SimpleDialogBox from "../../../Dialog Box/SimpleDialogBox";
import { Oval } from "react-loader-spinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function VideoBox({ data, onItemClick, index }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    <div className="videoBox">
      <div className="videoBox__body">
        <div className="videoBox__bodyInside" onClick={handleOpen}>
          <video
            className="videoBox__image"
            src={data.base64}
            onClick={handleOpen}
          ></video>
          <PlayArrow className="playArrow" />
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <SimpleDialogBox
              onItemClick={onItemClick}
              dataValue={data}
              modalClose={handleClose}
              index={index}
            />
            <video
              src={data.base64}
              width="500"
              height="500"
              onClick={handleOpen}
              controls
            ></video>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default VideoBox;
