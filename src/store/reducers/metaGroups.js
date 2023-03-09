import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/metagroups";

const initialState = {
  metaGroups: [],
  metaGroupsPerPage: 5,
  metaGroupsPageNumber: 0,
  metaGroupsScrollState: {
    items: [],
    hasMore: true,
  },
};

const metaGroups = createSlice({
  name: "metaGroups",
  initialState,
  reducers: {
    setMetaGroups: (state, action) => {
      state.metaGroups = action.payload;
    },
    setMetaGroupsPerPage: (state, action) => {
      state.metaGroupsPerPage = action.payload;
    },
    setMetaGroupsPageNumber: (state, action) => {
      state.metaGroupsPageNumber = action.payload;
    },
    setMetaGroupsScrollState: (state, action) => {
      state.metaGroupsScrollState = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getMetaGroups.matchFulfilled,
      (state, action) => {
        const metaGroups = action.payload;

        const newMetaGroups = [...state.metaGroups, ...metaGroups];

        state.metaGroupsScrollState = {
          ...state.metaGroupsScrollState,
          items: newMetaGroups,
        };

        if (
          metaGroups.length === 0 ||
          metaGroups.length % state.metaGroupsPerPage !== 0
        ) {
          state.metaGroupsScrollState = {
            ...state.metaGroupsScrollState,
            hasMore: false,
          };
        }

        state.metaGroups = newMetaGroups;
      }
    );
  },
});

export const {
  setMetaGroups,
  setMetaGroupsPerPage,
  setMetaGroupsPageNumber,
  setMetaGroupsScrollState,
  setMultiple,
} = metaGroups.actions;
export default metaGroups.reducer;
export const metaGroupsSelector = (state) => state.metaGroups;
