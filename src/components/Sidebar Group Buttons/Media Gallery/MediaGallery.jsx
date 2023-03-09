import React, { useState } from "react";
import { Oval } from "react-loader-spinner";

import "./MediaGallery.css";

import ImagePlaceholder from "assets/images/image-placeholder.jpg";

import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Close, KeyboardReturn } from "@mui/icons-material";

function MediaGallery({ data, index, deleteItem, clickFunction }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);

  const hideItem = () => {
    // console.log(0);
    handleCloseDeleteConfirmation();
  };

  const confirmDelete = (data, index) => {
    handleCloseDeleteConfirmation();
    clickFunction(data, index);
  };

  return (
    <>
      {!data.base64 ? (
        <div className="media-gallery__image-placeholder-container">
          <img
            src={ImagePlaceholder}
            alt="Media placeholder"
            className="media-gallery__image-placeholder"
          />
        </div>
      ) : (
        <div className="media-gallery">
          <img
            className="media-gallery__image"
            src={!data.base64 ? data.image : data.base64}
            alt={data.base64}
          />

          {deleteItem && (
            <div
              className="media-gallery__delete"
              // onClick={() => deleteItem(data, index)}
            >
              <Close onClick={handleOpenDeleteConfirmation} />
            </div>
          )}
          <Dialog
            onClose={handleCloseDeleteConfirmation}
            open={openDeleteConfirmation}
          >
            <DialogTitle>Are you sure you want to delete this?</DialogTitle>
            <List sx={{ pt: 0 }} className="dialogList">
              <ListItem button onClick={() => confirmDelete(data, index)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[500], color: "red"[600] }}>
                    <Close style={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Delete" style={{ color: "red" }} />
              </ListItem>

              <ListItem
                button
                onClick={hideItem}
                // onClick={() => handleCloseDeleteConfirmation()}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#22b0ea", color: "#22b0ea" }}>
                    <KeyboardReturn style={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Hide" />
              </ListItem>
            </List>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default MediaGallery;
