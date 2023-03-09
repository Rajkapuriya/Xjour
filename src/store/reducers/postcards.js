import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/postcards";

const initialState = {
  postcards: [],
  postcardsPerPage: 8,
  postcardsPageNumber: 0,
  postcardsScrollState: {
    items: [],
    hasMore: true,
  },
  replacePreviousByPage: false,
};

const postcards = createSlice({
  name: "postcards",
  initialState,
  reducers: {
    setPostcards: (state, action) => {
      state.postcards = action.payload;
    },
    setPostcardsPerPage: (state, action) => {
      state.postcardsPage = action.payload;
    },
    setPostcardsPageNumber: (state, action) => {
      state.postcardsPageNumber = action.payload;
    },
    setPostcardsScrollState: (state, action) => {
      state.postcardsScrollState = action.payload;
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
      extendedApiSlice.endpoints.getPostcards.matchFulfilled,
      (state, action) => {
        const { postcards } = action.payload;

        let newPostcards;
        if (state.replacePreviousByPage) {
          const oldPostcards = [...state.postcards].slice(
            0,
            state.postcardsPerPage * state.postcardsPageNumber
          );
          newPostcards = [...oldPostcards, ...postcards];
          state.replacePreviousByPage = false;
        } else {
          newPostcards = [...state.postcards, ...postcards];
        }

        state.postcardsScrollState = {
          ...state.postcardsScrollState,
          items: newPostcards,
        };

        if (
          postcards.length === 0 ||
          postcards.length % state.postcardsPerPage !== 0
        ) {
          state.postcardsScrollState = {
            ...state.postcardsScrollState,
            hasMore: false,
          };
        } else {
          state.postcardsPageNumber += 1;
        }

        state.postcards = newPostcards;
      }
    );
  },
});

export const {
  setPostcards,
  setPostcardsPerPage,
  setPostcardsPageNumber,
  setPostcardsScrollState,
  setReplacePreviousByPage,
  setMultiple,
} = postcards.actions;
export default postcards.reducer;
export const postcardsSelector = (state) => state.postcards;
