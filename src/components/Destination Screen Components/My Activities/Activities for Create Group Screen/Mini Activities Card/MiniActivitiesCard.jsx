import { useState } from "react";
import { Oval } from "react-loader-spinner";

import "./MiniActivitiesCard.css";

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

import MiniCardsTopRightOverlay from "components/Shared/MiniCardsTopRightOverlay/MiniCardsTopRightOverlay";

function MiniActivitiesCard({
  data,
  index,
  handleClick,
  clickFunction,
  deleteItem,
}) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);

  const confirmDelete = (data, index) => {
    // console.log("confirm delete", data, index);

    handleCloseDeleteConfirmation();
    clickFunction(data, index);
  };

  const hideItem = () => {
    console.log(0);
    handleCloseDeleteConfirmation();
  };

  return (
    <>
      {/* {clickFunction && (
          <div className="miniActivityCard__closeBtn">
            <Close onClick={handleOpenDeleteConfirmation} />
          </div>
        )} */}
      <div
        className="mini-activities-card"
        onClick={() => {
          handleClick && handleClick(data, index);
        }}
      >
        <div className="mini-activities-card__detail">
          <div className="mini-activities-card__detail-left">
            <h5>{data.name}</h5>
          </div>

          <div className="mini-activities-card__detail-left-bottom">
            {!data.countrySvg ? (
              <div className="mini-activities-card__flag-placeholder-container"></div>
            ) : (
              <img
                src={data.countrySvg}
                className="mini-activities-card__country-flag"
                alt=""
              />
            )}
          </div>
        </div>

        <div className="mini-activities-card__image-container">
          {!data.base64 ? (
            <div className="mini-activities-card__image-placeholder-container">
              <img
                src={ImagePlaceholder}
                alt="Activities placeholder"
                className="mini-activities-card__image-placeholder"
              />
            </div>
          ) : (
            <img
              className="mini-activities-card__image"
              src={data.base64}
              alt=""
            />
          )}

          {deleteItem && (
            // <div
            //   className="mini-activities-card__delete"
            //   onClick={() => deleteItem(data, index)}
            // >
            //   <Close onClick={handleOpenDeleteConfirmation} />
            // </div>
            <MiniCardsTopRightOverlay
              onRemoveClickHandler={handleOpenDeleteConfirmation}
            />
          )}
        </div>
      </div>

      <Dialog
        onClose={handleCloseDeleteConfirmation}
        open={openDeleteConfirmation}
      >
        <DialogTitle>Do you want to Delete this or Hide This?</DialogTitle>
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
    </>
  );
}

export default MiniActivitiesCard;
