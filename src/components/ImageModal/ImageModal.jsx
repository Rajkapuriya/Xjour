import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import SimpleDialogBox from "../Dialog Box/SimpleDialogBox";
import "./ImageModal.css";

function ImageModal({
  imgs,
  clickedImg,
  setClickedImg,
  handelRotationRight,
  handelRotationLeft,
  onItemClick,
  data,
}) {
  const handleClick = (e) => {
    if (e.target.classList.contains("dismiss")) {
      setClickedImg(null);
    }
  };

  return (
    <>
      <div className="overlay dismiss" onClick={handleClick}>
        <img src={imgs.image} alt="bigger pic" className="modalImage" />
        <span className="dismiss" onClick={handleClick}>
          X
        </span>
        <SimpleDialogBox onItemClick={onItemClick} dataValue={data} />
        <div onClick={handelRotationLeft} className="overlay-arrows_left">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div onClick={handelRotationRight} className="overlay-arrows_right">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageModal;
