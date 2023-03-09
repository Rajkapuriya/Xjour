import { useState } from "react";
import { Oval } from "react-loader-spinner";

import "./PeopleCards.css";

import AddConnectionIcon from "assets/icons/add-connection-icon.svg";

import {
  Add,
  Chat,
  Close,
  KeyboardReturn,
  MoreVert,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { red } from "@mui/material/colors";

function PeopleCards({
  deleteItem,
  index,
  data,
  handleClick,
  clickFunction,
  contentWrapper,
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
    // console.log(0);
    handleCloseDeleteConfirmation();
  };

  return (
    <div className="people-cards">
      <div className="people-cards__container">
        {handleClick && (
          <div className="tickButton" onClick={() => handleClick(data, index)}>
            <Add />
          </div>
        )}

        <div className="container-body">
          <div className="container-avatar">
            {!data?.base64 ? (
              <Avatar className="container-avatar-placeholder" />
            ) : (
              <Avatar src={data.base64} />
            )}
          </div>

          <div className="container-body__left">
            <div className="container-body__left-top">
              <div className="container-body__name-container">
                <h5>{data?.firstName}</h5>
                <h5>{data?.lastName}</h5>
              </div>

              {!deleteItem ? (
                <MoreVert />
              ) : (
                <Close
                  className="cancleButton"
                  // onClick={() => deleteItem(index)}
                  onClick={handleOpenDeleteConfirmation}
                />
              )}
            </div>
            <div className="container-body__left-right">
              <img src={AddConnectionIcon} alt="Chat" className="chatIcon" />
            </div>
            <div className="container-body__left-bottom">
              <p>{data?.occupation}</p>
              <div className="container-body__left-bottom-location">
                <div className="container-body__current-location-container">
                  <p>Current Loction:</p>
                  <p>{data?.currentLocation}</p>
                </div>

                {!data?.countrySvg ? (
                  <div className="people-cards__flag-placeholder-container"></div>
                ) : (
                  <img src={data?.countrySvg} alt="" className="flag" />
                )}
              </div>
            </div>
          </div>

          {/* <div className="containerBody__right"></div> */}
        </div>
      </div>

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
  );
}

export default PeopleCards;
