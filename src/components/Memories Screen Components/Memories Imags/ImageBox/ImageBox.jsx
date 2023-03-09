import React, { useState } from "react";
import "./ImageBox.css";
import ImageBoxImages from "./ImageBox Images/ImageBoxImages";

function ImageBox({ data, images }) {
  console.log(data);
  return (
    <div className="imageBox">
      <h5>{data.date}</h5>
      <div className="imageBox__body">
        {images.map((v, i) => (
          <ImageBoxImages image={v.image} />
          // <p>{v.image}</p>
        ))}
      </div>
    </div>
  );
}

export default ImageBox;
