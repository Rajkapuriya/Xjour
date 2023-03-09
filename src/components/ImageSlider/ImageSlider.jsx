import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";

function ImageSlider({ imgs, handleOpen, index }) {
  //   const [current, setCurrent] = useState(0);
  //   const length = images.length;

  //   const nextSlide = () => {
  //     setCurrent(current === length - 1 ? 0 : current + 1);
  //   };

  //   const prevSlide = () => {
  //     setCurrent(current === 0 ? length - 1 : current - 1);
  //   };

  //   if (!Array.isArray(images) || images.length <= 0) {
  //     return null;
  //   }

//   console.log(imgs)
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, []);

  const nextSlide = () => {
    if (imageIndex === imgs.lenght - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex + 1);
    }
  };

  const prevSlide = () => {
    if (imageIndex === imgs.lenght - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex - 1);
    }
  };
  return (
    <div>
      <img
        style={{ borderRadius: "12px" }}
        src={imgs.image}
        width="500"
        height="500"
        onClick={handleOpen}
        controls
      />

      <IconButton onClick={prevSlide}>
        <ArrowLeft />
      </IconButton>
      <IconButton onClick={nextSlide}>
        <ArrowRight />
      </IconButton>
    </div>
  );
}

export default ImageSlider;
