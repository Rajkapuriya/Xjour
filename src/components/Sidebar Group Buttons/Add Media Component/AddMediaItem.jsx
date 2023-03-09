import React from "react";

import { Oval } from "react-loader-spinner";

function ImageBoxImages({ key, data, handleClick, index }) {
  if (data) {
    if (!data.isLoaded) {
      return (
        <div className="addMedia__imageLoader">
          <Oval color="#00BFFF" />;
        </div>
      );
    }
  }
  return (
    <div className="imageBoxImages">
      <img
        //  style={{width:200,height:200,objectFit:'contain'}}
        className="addMedia__image"
        src={data.image}
        onClick={() => handleClick(data, index)}
        alt=""
      />
    </div>
  );
}

export default ImageBoxImages;
