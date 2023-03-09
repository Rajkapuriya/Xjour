import React, { useState } from "react";
import "./GroupMembersCard.css";
import { Box, Modal } from "@mui/material";
import MessageBox from "../../Group Members/MessageBox/MessageBox";
import { useParams } from "react-router-dom";
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
function GroupMembersCard({ data, index }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  let { groupKey } = useParams();

  const handleClose = () => {
    setOpen(false);
    // console.log("Group Key", groupKey);
  };

  return (
    <div className="groupMembersCard">
      <div className="groupPendingCards__leftSection" onClick={handleOpen}>
        <div className="groupPendingCards__bottom">
          <div className="cardBottom__left">
            {!data.base64 ? (
              <div className="">
                <Oval color="#00BFFF" height={40} width={40} />
              </div>
            ) : (
              <img src={data.base64} alt="" className="groupMemberCardImage" />
            )}
          </div>
          <div className="groupMemberCardBottom__right">
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
            selectedGroupKey={groupKey}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default GroupMembersCard;
