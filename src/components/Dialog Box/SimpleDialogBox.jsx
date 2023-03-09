import React, { useState } from "react";
import "./SimpleDialogBox.css";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { red } from "@mui/material/colors";
import { useAlert } from "react-alert";
import { IconButton } from "@mui/material";
import {
  Close,
  DeleteForever,
  Done,
  KeyboardReturn,
} from "@mui/icons-material";

function SimpleDialog({
  index,
  onClose,
  selectedValue,
  open,
  onItemClick,
  dataValue,
  modalClose,
}) {
  const alert = useAlert();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    if (onItemClick && dataValue) {
      onItemClick(dataValue, index);
      onClose(value);
    }
    // alert.show("Successfully deleted");
    modalClose();
  };

  const hideItem = () => {
    console.log(0);
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Do you want to Delete this?</DialogTitle>
      <List sx={{ pt: 0 }} className="dialogList">
        <ListItem button onClick={() => handleListItemClick()}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: red[500], color: red[600] }}>
              <Close style={{ color: "white" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Delete" style={{ color: "red" }} />
        </ListItem>

        <ListItem button onClick={hideItem}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "#22b0ea", color: "#22b0ea" }}>
              <KeyboardReturn style={{ color: "white" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Cancel" />
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function SimpleDialogBox({ onItemClick, dataValue, modalClose, index }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <div className="optionButtons">
        <div className="close__button">
          <IconButton variant="outlined" onClick={modalClose}>
            <KeyboardReturn />
          </IconButton>
        </div>
        <div className="delete__button">
          <IconButton variant="outlined" onClick={handleClickOpen}>
            <DeleteForever />
            {/* <h4>Delete </h4> */}
          </IconButton>
        </div>
      </div>

      <SimpleDialog
        selectedValue={selectedValue}
        onItemClick={onItemClick}
        index={index}
        open={open}
        onClose={handleClose}
        dataValue={dataValue}
        modalClose={modalClose}
      />
    </div>
  );
}

export default SimpleDialogBox;
