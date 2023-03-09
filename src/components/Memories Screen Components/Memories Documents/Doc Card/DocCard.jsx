import { Close, DeleteForever, KeyboardReturn } from "@mui/icons-material";
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
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";

import "./DocCard.css";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
// };

function DocCard({ data, index, onItemClick, deleteItem }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleOpenDeleteConfirmation = () => setOpenDeleteConfirmation(true);
  const handleCloseDeleteConfirmation = () => setOpenDeleteConfirmation(false);

  const confirmDelete = (val, ind) => {
    // console.log("confirm delete", val, ind);
    handleCloseDeleteConfirmation();
    deleteItem(val, ind);
  };

  const HideItem = () => {
    console.log(0);
    handleCloseDeleteConfirmation();
  };
  // if (!data.isLoaded) {
  //   return (
  //     <div className="groupLists__msg">
  //       <Oval color="#00BFFF" />
  //     </div>
  //   );
  // }
  return (
    <div className="docCard">
      <div className="docCard__container">
        <div
          className="docCard__containerName"
          onClick={() => onItemClick(data, index)}
        >
          {!data.isLoaded && <Oval color="#00BFFF" height={20} width={20} />}
          <p>{data.name}</p>
        </div>
        <div className="docCard__DeleteButton">
          <Avatar style={{ backgroundColor: "#ee378a" }}>
            <DeleteForever
              style={{ color: "white" }}
              onClick={handleOpenDeleteConfirmation}
            />
          </Avatar>

          <Dialog
            onClose={handleCloseDeleteConfirmation}
            open={openDeleteConfirmation}
          >
            <DialogTitle>Do you want to Delete this or Hide this?</DialogTitle>
            <List sx={{ pt: 0 }} className="dialogList">
              <ListItem button onClick={() => confirmDelete(data, index)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[500], color: "red"[600] }}>
                    <Close style={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Delete" style={{ color: "red" }} />
              </ListItem>

              <ListItem button onClick={HideItem}>
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
      </div>
    </div>
  );
}

export default DocCard;
