import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useStateValue } from "../../../config/context api/StateProvider";
import "./AddMedia.css";
import AddMediaItem from "./AddMediaItem.jsx";

function AddMedia({ getImage, mediaComponentActive }) {
  const [{ reducerMemoryImages }, dispatch] = useStateValue();
  // const [memoryImages, setMemoryImages] = useState([]);
  const [memoryImages, setMemoryImages] = useState([]);
  const [loader, isLoading] = useState(true);

  useEffect(() => {
    // console.log("reducerMemoryImages", reducerMemoryImages);
    if (reducerMemoryImages) {
      if (reducerMemoryImages.length) {
        setMemoryImages(reducerMemoryImages);
        isLoading(false);
        // console.log("reducerMemoryImages", reducerMemoryImages);
      }
    } else {
      isLoading(false);
      setMemoryImages([]);
      // console.log("reducerMemoryImages", reducerMemoryImages);
    }
  }, [reducerMemoryImages]);

  return (
    <div className="addMedia">
      {/* <h3>Media</h3> */}
      <div className="addMenu__closeButton">
        <Close onClick={mediaComponentActive} style={{ color: "#22b0ea" }} />
        <h3>Close</h3>
      </div>
      {loader ? (
        <div className="collapisible__loader">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <>
          {!memoryImages?.length ? (
            <div className="collapsibleItem__text">
              <h5>No Media</h5>
            </div>
          ) : (
            <>
              {memoryImages?.map((v, i) => (
                <AddMediaItem
                  key={i}
                  data={v}
                  index={i}
                  handleClick={getImage}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AddMedia;
