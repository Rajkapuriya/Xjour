import React, { useEffect, useState } from "react";
import { keyframes } from "styled-components";
import { useAlert } from "react-alert";
import { useStateValue } from "../../../../../config/context api/StateProvider";
import { useHistory } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";

function NoteCardsHome() {
  const [{ userToken, reducerNotes, reducerAllNotes }, dispatch] =
    useStateValue();
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchData, setDispatchData] = useState(false);
  const [notesName, setNotesName] = useState([]);

  // const [selectedNotesData, setSelectedNotesData] = useState({
  //   name: title,
  //   pk: pk,
  //   description: description,
  //   searchable: searchable,
  //   index: index,
  // });

  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    if (reducerAllNotes) {
      setLoadingSpinner(false);
      for (var key in reducerAllNotes) {
        // console.log(reducerAllNotes[key].name, "reducerAllNotes");
        if (reducerAllNotes[key].name) {
          notesName.push({
            name: reducerAllNotes[key].name,
            description: reducerAllNotes[key].description,
            pk: reducerAllNotes[key].pk,
            pictureDocumentID: reducerAllNotes[key].pictureDocumentID,
            // searchable: reducerAllNotes[key].searchable,
          });
          setNotesName(notesName.slice());
        }
      }
      // console.log("reducerAllNotes", reducerAllNotes);
    } else {
      setLoadingSpinner(true);
      setNotesName([]);
    }
    // console.log("notesName", notesName);
  }, [reducerAllNotes]);

  const moveToSelectedNotes = () => {
    // dispatch({
    //   type: "SET_NOTES",
    //   reducerNotes: selectedNotesData,
    // });
    // console.log("move to selected notes ");
    history.push("/destinations/selected-notes");
  };

  return (
    <>
      {notesName?.map((v, i) => (
        <div className="noteCards">
          <div className="noteCards__detail" onClick={moveToSelectedNotes}>
            <div className="detail__title">
              <h5 className="title">{v.name}</h5>
            </div>
            <div className="detail__description"></div>
          </div>

          <div className="noteCards__image">
            <IconButton>
              <Avatar style={{ backgroundColor: "#ee378a" }}>
                <Visibility style={{ color: "white" }} />
              </Avatar>
            </IconButton>
          </div>
        </div>
      ))}
    </>
  );
}

export default NoteCardsHome;
