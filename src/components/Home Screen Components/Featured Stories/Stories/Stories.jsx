import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Buffer } from "buffer";

import "./Stories.css";

import { useStateValue } from "../../../../config/context api/StateProvider";

import { Avatar } from "@mui/material";

function Stories({ data, index }) {
  const [{ reducerDefaultPictures }, dispatch] = useStateValue();
  const [collapsibleButton, setCollapsibleButton] = useState(false);
  const [quillValue, setQuillValue] = useState(null);
  const [userImageDetails, setUserImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [userGroupDetails, setUserGroupDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });

  useEffect(() => {
    if (data?.description !== null) {
      const decoder = Buffer.from(data?.description, "base64").toString(
        "UTF-8"
      );
      setQuillValue(decoder);
      // console.log("quillData decoder", decoder);
    }
    // console.log("quillData", data);
    // console.log("quillValue", quillValue);
  }, [data.description]);

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

      setUserImageDetails({
        ...userImageDetails,
        base64: reducerDefaultPictures[5].base64Value,
        base64DocumentID: reducerDefaultPictures[5].documentID,
      });
      setUserGroupDetails({
        ...userGroupDetails,
        base64: reducerDefaultPictures[1].base64Value,
        base64DocumentID: reducerDefaultPictures[1].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  return (
    <div className="stories">
      <div className="stories__container">
        <div className="container__header">
          <div className="container__header__nameImage">
            <Avatar className="userPhoto" src={data.base64} alt="Abc" />
            <h5>{data.firstName}</h5>
            <h5>{data.lastName}</h5>
          </div>
          <div>
            {data.countrySvg ? (
              <img
                className="stories__containerFlag"
                src={data.countrySvg}
                alt=""
              />
            ) : (
              <div className="groupLists__msg">
                <Oval color="#00BFFF" />
              </div>
            )}
          </div>
        </div>
        <div className="container__caption">
          <p>{data.caption}</p>
        </div>
        <div className="container__image">
          {quillValue ? (
            <ReactQuill
              theme="snow"
              // formats="none"
              modules={{ toolbar: false }}
              value={quillValue}
              onChange={setQuillValue}
              readOnly
            />
          ) : (
            // <img src={data.quillValue} readOnly className="postImage" />
            <div className="groupLists__msg">
              <Oval color="#00BFFF" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stories;
