import React, { useEffect, useState } from "react";
import TextEditor from "../../../Notes/Create Notes/TextEditor";
import "./DestinationNotes.css";

function DestinationNotes({ setQuill, quillValue }) {
  // console.log("quillValue", quillValue);
  //   useEffect(() => {

  //   },[])

  const [value, setValue] = useState("");

  if (value) {
    setQuill(Buffer.from(value).toString("base64"));
  }

  useEffect(() => {
    if (quillValue) {
      setValue(quillValue);
    }
  }, [quillValue]);

  return (
    <div className="destinationNotes">
      <TextEditor setQuill={setQuill} />
    </div>
  );
}

export default DestinationNotes;
