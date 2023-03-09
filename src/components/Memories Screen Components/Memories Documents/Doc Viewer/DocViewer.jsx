import React, { useEffect, useState } from "react";
import "./DocViewer.css";
import { useStateValue } from "../../../../config/context api/StateProvider";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ChevronLeft, Download } from "@mui/icons-material";
import { useHistory } from "react-router";
import Base64Downloader from "common-base64-downloader-react";

function DocViewer() {
  const [docFile, setDocFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const history = useHistory();
  const [{  reducerSelectedDocument }, dispatch] = useStateValue();

  const moveToMyDocuments = () => {
    history.push("/memories/documents/");
  };

  useEffect(() => {
    // console.log("reducerSelectedDocument", reducerSelectedDocument);
    setDocFile(reducerSelectedDocument.base64);

    setFileName(reducerSelectedDocument.name);

    // console.log("docFile", docFile);
  }, [reducerSelectedDocument]);

  return (
    <div className="docViewer">
      <div className="docViewer__header">
        <div className="container__topLeft">
          <ChevronLeft onClick={moveToMyDocuments} />
          <h3>Documents</h3>
        </div>
        <div className="container__topRight">
          {docFile && (
            <Base64Downloader
              base64={docFile}
              downloadName={fileName.split(".")[0]}
            >
              <Download />
            </Base64Downloader>
          )}
        </div>
      </div>

      <div
        className="docViewer__file"
        style={
          {
            // border: "1px solid rgba(0, 0, 0, 0.3)",
            // height: "100%",
          }
        }
      >
        {docFile && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
            <Viewer fileUrl={docFile} />
          </Worker>
        )}
       
      </div>
    </div>
  );
}

export default DocViewer;
