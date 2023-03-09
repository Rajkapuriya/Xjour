import {
  Add,
  FilterAlt,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import {
  addBase64File,
  deleteDMSDocument,
} from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";
import DocCard from "./Doc Card/DocCard";
import { useHistory } from "react-router";
import { useAlert } from "react-alert";
import "./MemoriesDocuments.css";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";

function MemoriesDocuments() {
  const [{ userToken, reducerMemoryDocuments, reducerVisitorID }, dispatch] =
    useStateValue();
  const alert = useAlert();
  const [docFile, setDocFile] = useState("");
  const [mimeType, setMimeType] = useState(null);
  const [docName, setDocName] = useState(null);
  const [base64File, setBase64File] = useState(null);
  const [loader, isLoading] = useState(true);
  const [redirectNow, setRedirectNow] = useState(false);
  const [documentsArray, setDocumentsArray] = useState([]);
  const [docData, setDocData] = useState([]);
  const history = useHistory();
  const memDocWrapper = useRef(null);

  // const scrollDocs = (scrollOffset) => {
  // console.log("button Pressed");
  //   memDocWrapper.current.scrollTop += scrollOffset;
  // };

  useEffect(() => {
    // console.log("reducerMemoryDocuments", reducerMemoryDocuments);
    if (reducerMemoryDocuments) {
      if (reducerMemoryDocuments.length > 0) {
        setDocumentsArray(reducerMemoryDocuments);
        isLoading(false);
        // console.log("reducerMemoryDocuments", reducerMemoryDocuments);
      } else {
        isLoading(false);
        setDocumentsArray([]);
        // console.log("reducerMemoryDocuments", reducerMemoryDocuments);
      }
    }
  }, [reducerMemoryDocuments]);
  useEffect(() => {
    // console.log("documentsArray", documentsArray);
  }, [documentsArray]);

  const deleteItem = (data, index) => {
    isLoading(true);
    // console.log("onItemClick", data);
    // console.log("onItemClick", index);
    deleteDMSDocument(userToken, data.documentId, reducerVisitorID).then(
      function (val) {
        if (val) {
          // console.log("delete API response >>", val.data);
          alert.show("Document Deleted successfully");
          isLoading(false);
          documentsArray.splice(index, 1);
          setDocumentsArray([...documentsArray]);
          dispatch({
            type: "SET_MEMORY_DOCUMENTS",
            reducerMemoryDocuments: documentsArray,
          });
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
    );
  };

  const imageHandleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      isLoading(true);
      setMimeType(event.target.files[0].type);
      setDocName(event.target.files[0].name);
      // console.log("documentFile", event.target.files[0].name);

      let reader = new FileReader();
      reader.onload = (e) => {
        setDocFile(e.target.result);
        // handleOpen();
        // console.log("documentFile", e.target.result);
        // console.log("mimeType", event.target.files[0].type);
        // console.log("docName", docName);

        const base64result = e.target.result.substr(
          e.target.result.indexOf(",") + 1
        );
        setBase64File(base64result);

        uploadToServer(
          event.target.files[0].type,
          event.target.files[0].name,
          base64result,
          e.target.result
        );
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const uploadToServer = (mimeType, name, base64, src) => {
    const params = JSON.stringify({
      pk: 0,
      acl: 7429,
      fileName: name,
      documentName: mimeType + "/" + name,
      mimeType: mimeType,
      timestampDocument: Date.now(),
      dataBase64: base64,
      versioning: 0,
    });
    // console.log("Params", params);

    addBase64File(userToken, params, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Document API Response", val.data);
        alert.show("File Uploaded Successfully");
        isLoading(false);

        let item = documentsArray;
        // const imageFile = val.data.dataBase64;
        // const mimeType = val.data.mimeType;
        let srcValue = `data:${mimeType};base64,${base64}`;

        let obj = {
          src: src,
          date: Date.now(),
          base64: srcValue,
          name: name,
          documentId: val.data.documentID,
          mimeType: mimeType,
          isLoaded: true,
        };
        item.push(obj);

        dispatch({
          type: "SET_MEMORY_DOCUMENTS",
          reducerMemoryDocuments: documentsArray,
        });
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const onItemClick = (data, index) => {
    // console.log("onClick Data", data, index);
    if (data.isLoaded) {
      if (data.mimeType !== "application/pdf") {
        alert.show("Not a PDF File");
      } else {
        setDocData({
          ...docData,
          base64: data.base64,
          date: data.date,
          documentId: data.documentId,
          isLoaded: data.isLoaded,
          mimeType: data.mimeType,
          name: data.name,
          src: data.src,
          index: index,
        });

        setRedirectNow(true);
      }
    } else {
      alert.show("Loading");
    }
  };

  useEffect(() => {
    if (redirectNow) {
      setRedirectNow(false);
      dispatch({
        type: "SET_SELECTED_DOCUMENT",
        reducerSelectedDocument: docData,
      });
      // console.log("move to selected Document ");
      history.push("/memories/documents/doc-viewer");
    }
  }, [redirectNow]);

  useEffect(() => {
    // console.log("documentFile", docFile);
    // console.log("mimeType", mimeType);
    // console.log("docName", docName);
  }, [docFile]);
  return (
    <div className="memoriesDocuments" ref={memDocWrapper}>
      <div className="memoriesDocuments__heading">
        <h3>Documents </h3>
        <FilterAlt />
      </div>

      {loader ? (
        <div className="memoryVideos__loader">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
        <div className="memoriesDocuments__images">
          <div className="uploadImageBox">
            <label>
              <Add />

              <input
                // id="file-input"
                type="file"
                className="input-file"
                // accept="image/*"
                style={{ display: "none" }}
                onChange={imageHandleChange}
              />
            </label>
          </div>

          {documentsArray.length <= 0 ? (
            <div className="noImagesText">
              <h3>You have no Documents added </h3>
            </div>
          ) : (
            <div className="documentsCard__map">
              {/* <div className="fullScrennScroll__buttons">
                <ArrowUpwardSharp onClick={() => scrollDocs(-150)} />
                <ArrowDownward onClick={() => scrollDocs(+150)} />
              </div> */}
              {documentsArray.map((v, i) => (
                <DocCard
                  data={v}
                  index={i}
                  onItemClick={onItemClick}
                  deleteItem={deleteItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MemoriesDocuments;
