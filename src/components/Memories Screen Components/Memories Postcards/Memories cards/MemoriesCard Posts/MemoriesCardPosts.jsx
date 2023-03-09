import React, { useState } from "react";
import "./MemoriesCardPosts.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function MemoriesCardPosts({ image, video }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openImage, setOpenImage] = useState(false);
  const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);

  return (
    <div className="memoriesCardPosts">
      <div className="memoriesCards__body">
        <img
          src={image}
          alt
          className="memoriesCards__image"
          onClick={handleOpenImage}
        />
        <Modal
          open={openImage}
          onClose={handleCloseImage}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <img
              src={image}
              width="500"
              height="500"
              onClick={handleOpenImage}
              controls
            />
          </Box>
        </Modal>

        <div className="videoBox__bodyInside" onClick={handleOpen}>
          <video
            className="videoBox__image"
            src={video}
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
            <video
              src={video}
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

export default MemoriesCardPosts;
