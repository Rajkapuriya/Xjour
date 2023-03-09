import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/notes";

const initialState = {
  notes: [],
  notesPerPage: 5,
  notesPageNumber: 0,
  recentNotesScrollState: {
    items: [],
    hasMore: true,
  },
  replacePreviousByPage: false,
};

const notes = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setNotesPerPage: (state, action) => {
      state.notesPerPage = action.payload;
    },
    setNotesPageNumber: (state, action) => {
      state.notesPageNumber = action.payload;
    },
    setRecentNotesScrollState: (state, action) => {
      state.recentNotesScrollState = action.payload;
    },
    setReplacePreviousByPage: (state, action) => {
      state.replacePreviousByPage = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.retrieveNotes.matchFulfilled,
      (state, action) => {
        const notes = action.payload;

        let newNotes;
        if (state.replacePreviousByPage) {
          const oldNotes = [...state.notes].slice(
            0,
            state.notesPerPage * state.notesPageNumber
          );
          newNotes = [...oldNotes, ...notes];
          state.replacePreviousByPage = false;
        } else {
          newNotes = [...state.notes, ...notes];
        }

        state.recentNotesScrollState = {
          ...state.recentNotesScrollState,
          items: newNotes,
        };

        if (notes.length === 0 || notes.length % state.notesPerPage !== 0) {
          state.recentNotesScrollState = {
            ...state.recentNotesScrollState,
            hasMore: false,
          };
        }

        state.notes = newNotes;
      }
    );
  },
});

export const {
  setNotes,
  setNotesPerPage,
  setNotesPageNumber,
  setRecentNotesScrollState,
  setReplacePreviousByPage,
  setMultiple,
} = notes.actions;
export default notes.reducer;
export const notesSelector = (state) => state.notes;
