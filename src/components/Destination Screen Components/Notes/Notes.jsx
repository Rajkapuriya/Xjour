import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Shimmer } from "react-shimmer";

import "./Notes.css";

import { UNAUTH_KEY } from "assets/constants/Contants";

import { deleteNotesAPI } from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import { notesSelector } from "store/reducers/notes";
import {
  useLazyRetrieveNotesQuery,
  useRetrieveNotesQuery,
} from "store/endpoints/notes";

import ButtonAtom from "components/Atoms/Button/Button";
import NoteCards from "./Note Cards/NoteCards";

function Notes() {
  const history = useHistory();
  const alert = useAlert();

  const [{ reducerAllNotes, userToken, reducerVisitorID }, dispatch] =
    useStateValue();

  const notesState = useSelector(notesSelector);
  console.log(
    "%cnotesState:",
    "background-color:green;color:white;",
    notesState
  );

  const [fetchNotes, retrieveNotesQueryState] = useLazyRetrieveNotesQuery();
  console.log(
    "%cretrieveNotesQueryState:",
    "background-color:darkred;color:white;",
    retrieveNotesQueryState
  );

  const firstMount = useRef(true);

  useEffect(() => {
    if (!firstMount.current) {
      fetchNotes({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [notesState.notesPageNumber]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (notesState.notes.length === 0) {
        fetchNotes({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [fetchNotes, notesState.notes.length, reducerVisitorID, userToken]);

  const moveToCreateNote = () => {
    history.push("/destinations/create-note");
  };

  return (
    <div className="notes">
      <header className="notes__header">
        <h1 className="notes__heading">Notes</h1>

        <ButtonAtom onClick={moveToCreateNote}>+ CREATE</ButtonAtom>
      </header>

      <main className="notes__main">
        {retrieveNotesQueryState.isLoading ? (
          <div className="notes__shimmer-container">
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <Shimmer
                  key={i}
                  width={575}
                  height={200}
                  className="notes__shimmer"
                />
              );
            })}
          </div>
        ) : notesState.notes.length <= 0 ? (
          <p className="notes__no-notes-text">No Notes</p>
        ) : (
          <div className="notes__note-cards-container">
            {notesState.notes.map((v, i) => (
              <NoteCards
                data={v}
                index={i}
                pk={v.pk}
                title={v.name}
                description={v.description}
              />
            ))}
          </div>
        )}
        {retrieveNotesQueryState.isError && (
          <div className="notes__fetch-error-container">
            <p className="notes__fetch-error">
              {retrieveNotesQueryState.error}
            </p>
            <ButtonAtom
              variant="filled"
              fontSize="medium"
              onClick={() => {
                fetchNotes();
              }}
            >
              Try Again
            </ButtonAtom>
          </div>
        )}
      </main>
    </div>
  );
}

export default Notes;
