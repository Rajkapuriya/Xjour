import React, { useState } from "react";
import "./ConnectionPeople.css";
import { Avatar, Box, Modal } from "@mui/material";
import ConnectRequestMessageBox from "./Connect Request MessageBox/ConnectRequestMessageBox";
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
function ConnectionPeople({ firstName, lastName, image, pk, flag }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleClose = (v) => {
    setOpen(false);
    // console.log("button just preseed", open);
    // console.log("Group Key", v);
  };
  return (
    <div className="connectionPeople">
      <div className="connectionPeople__container" onClick={handleOpen}>
        <div className="container">
          <div className="containerAvatar">
            {!image ? (
              <div className="">
                <Oval color="#00BFFF" height={40} width={40} />
              </div>
            ) : (
              <Avatar src={image} />
            )}
          </div>

          <div className="container__left">
            <div className="container__leftTop">
              <h5>{firstName}</h5>
              <h5>{lastName}</h5>
              {/* {!deleteItem ? (
                <MoreVert />
              ) : (
                <Close
                  className="cancleButton"
                  onClick={() => deleteItem(index)}
                />
              )} */}
            </div>
            {/* <div className="container__leftRight">
              <Chat className="chatIcon" />
            </div> */}
            <div className="container__leftBottom">
              <div className="container__leftBottomLocation">
                {!flag ? (
                  <div className="">
                    <Oval color="#00BFFF" height={40} width={40} />
                  </div>
                ) : (
                  <img src={flag} alt="" className="flag" />
                )}
              </div>
            </div>
          </div>

          {/* <div className="containerBody__right"></div> */}
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ConnectRequestMessageBox
            firstName={firstName}
            lastName={lastName}
            flag={flag}
            image={image}
            pk={pk}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default ConnectionPeople;
