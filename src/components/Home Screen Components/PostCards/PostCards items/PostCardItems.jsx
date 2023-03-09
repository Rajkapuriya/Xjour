import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";

import "./PostCardItems.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};
function PostCardItems({ image, title, description, data, index }) {
  const [{ userToken }, dispatch] = useStateValue();
  const [selectedPostCard, setSelectedPostCard] = useState([]);

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const moveToViewPostcard = () => {
    selectedPostCard.push({
      index: index,
      base64: data.base64,
      description: data.description,
      documentID: data.documentID,
      name: data.name,
      pk: data.pk,
      searchable: data.searchable,
    });
    // console.log("SelectedPostcard Data", selectedPostCard);
    dispatch({
      type: "SET_SELECTED_POSTCARD",
      reducerSelectedPostcard: selectedPostCard[0],
    });
    history.push("/postcard/view-postcard");
  };

  return (
    <div className="postCardItems">
      {!image ? (
        <div onClick={handleOpen} className="postCardItems__container">
          <p className="postCardItems__title--without-bgImage">{title}</p>
        </div>
      ) : (
        <div
          onClick={handleOpen}
          className="postCardItems__container"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
          }}
        >
          {/* <img src={image} alt="" /> */}
          <p className="postCardItems__title">{title}</p>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="postCardItems__modal">
            <div className="postCardItems__modalDetails">
              <h1>{title}</h1>
              <p>{description}</p>
              <div className="postCardItems__modalButtons">
                <button
                  className="primaryButtonActive"
                  onClick={moveToViewPostcard}
                >
                  Update Postcard
                </button>
                {/* <button className="primaryButtonActive">delete Postcard</button> */}
              </div>
            </div>

            <img src={image} alt="" />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default PostCardItems;
