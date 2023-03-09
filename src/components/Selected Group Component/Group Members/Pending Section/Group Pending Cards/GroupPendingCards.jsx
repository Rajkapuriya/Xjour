import React, { useState } from "react";
import "./GroupPendingCards.css";
import { Close, Done } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import MessageBox from "../../MessageBox/MessageBox";
import { Oval } from "react-loader-spinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function GroupPendingCards({ data, index }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // console.log("key", data.key);

  return (
    <div className="groupPendingCards">
      <div className="groupPendingCards__leftSection" onClick={handleOpen}>
        <div className="groupPendingCards__bottom">
          <div className="groupPendingCards__left">
            {!data.base64 ? (
              <div className="">
                <Oval color="#00BFFF" height={40} width={40} />
              </div>
            ) : (
              <img
                src={!data.base64}
                alt=""
                className="groupPendingCardImage"
              />
            )}
          </div>
          <div className="groupPendingCards__right">
            <div className="groupPendingCards__right">
              <h5>{data.name}</h5>

              {!data.countrySvg ? (
                <div className="">
                  <Oval color="#00BFFF" height={40} width={40} />
                </div>
              ) : (
                <img src={data.countrySvg} alt="" className="flag" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="groupPendingCards__rightSection">
        <div className="groupPendingCards__actionButtons">
          <IconButton className="acceptButton">
            <Done />
          </IconButton>
        </div>
        <div className="groupPendingCards__actionButtons">
          <IconButton className="cancelButton">
            <Close />
          </IconButton>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MessageBox
            data={data}
            index={index}
            handleClose={handleClose}
            selectedGroupKey={data.key}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default GroupPendingCards;
