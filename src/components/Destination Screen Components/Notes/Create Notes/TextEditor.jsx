import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Prompt } from "react-router-dom";
import { Buffer } from "buffer";

const Editor = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["image", "blockqoute", "code-block"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      ["clean"], // remove formatting button
    ],
  },
};

function TextEditor({ setQuill }) {
  let [isBlocking, setIsBlocking] = useState(false);
  const [value, setValue] = useState("");

  if (value) {
    setQuill(Buffer.from(value).toString("base64"));
  }

  useEffect(() => {
    if (value !== "") {
      setIsBlocking(true);
    } else if (value === "") {
      setIsBlocking(false);
    }
  }, [value]);

  return (
    <>
      <Prompt
        when={isBlocking}
        message={" Are you sure you want to leave this page"}
      />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={Editor}
      />
    </>
  );
}

export default TextEditor;
