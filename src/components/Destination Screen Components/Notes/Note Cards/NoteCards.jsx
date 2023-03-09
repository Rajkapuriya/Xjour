import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

import "./NoteCards.css";

import ImagePlaceholder from "assets/images/image-placeholder.jpg";

import { useStateValue } from "config/context api/StateProvider";

import { Close, KeyboardReturn } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import DeleteOrHideDialogue from "components/Delete Or Hide Dialogue/DeleteOrHideDialogue";

function NoteCards({
  title,
  description,
  pk,
  searchable,
  index,
  onDeletePress,
  data,
}) {
  const alert = useAlert();
  const history = useHistory();

  const [{}, dispatch] = useStateValue();

  const [isDeleteOrHideModalOpen, setIsDeleteOrHideModalOpen] = useState(false);

  const [selectedNotesData, setSelectedNotesData] = useState({
    name: title,
    pk: pk,
    description: description,
    searchable: searchable,
    index: index,
    configurations: data.configurations,
    base64: data.base64,
    pictureDocumentID: data.pictureDocumentID,
  });

  const moveToSelectedNotes = (event, { key }) => {
    dispatch({
      type: "SET_NOTES",
      reducerNotes: selectedNotesData,
    });

    history.push(`/destinations/selected-notes/${key}`);
  };

  const deleteNotes = (event) => {
    event.stopPropagation();

    setIsDeleteOrHideModalOpen(true);
  };

  return (
    <>
      <div
        className="note-cards"
        onClick={(event) => moveToSelectedNotes(event, { key: data.pk })}
      >
        <div className="node-cards__detail">
          <p className="node-cards__detail-title">{data.name}</p>
        </div>

        {data?.base64 ? (
          <div
            className="note-cards__image"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${data.base64})`,
              backgroundPosition: "center",
            }}
          ></div>
        ) : (
          <img
            src={ImagePlaceholder}
            alt="Recent note placeholder"
            className="note-cards__image"
          />
        )}

        <div className="note-cards__close-button">
          <Close onClick={deleteNotes} />
        </div>
      </div>

      {isDeleteOrHideModalOpen && (
        <DeleteOrHideDialogue
          keyValue={selectedNotesData.pk}
          state="notes"
          deleteOrHideConfirmation={isDeleteOrHideModalOpen}
          setDeleteOrHideConfirmation={setIsDeleteOrHideModalOpen}
        />
      )}
    </>
  );
}

export default NoteCards;
