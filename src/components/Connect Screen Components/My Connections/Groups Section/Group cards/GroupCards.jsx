import { Chat, MoreVert } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import MessageBox from "../../../../Selected Group Component/Group Members/MessageBox/MessageBox";
import "./GroupCards.css";

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
function GroupCards({ data, index, groupKey }) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    // console.log("Group Key", groupKey);
  };

  return (
    <div className="groupCards__container">
      <div className="groupCards" onClick={handleOpen}>
        <div className="groupCards__top">
          <h5>{data.name}</h5>
          <MoreVert />
        </div>
        <div className="groupCards__bottom">
          <div className="cardBottom__left">
            {!data.base64 ? (
              <div className="">
                <Oval color="#00BFFF" height={40} width={40} />
              </div>
            ) : (
              <img src={data.base64} alt="" className="groupCardImage" />
            )}
          </div>
          <div className="cardBottom__right">
            <div className="cardBottom__rightTop">
              <Chat className="chatIcon" />
            </div>
            <div className="cardBottom__rightBottom">
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
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MessageBox
            data={data}
            index={index}
            handleClose={handleClose}
            selectedGroupKey={groupKey}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default GroupCards;
