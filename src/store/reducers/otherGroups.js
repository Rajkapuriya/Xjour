import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/memberManagement";

const initialState = {
  otherGroups: [],
  otherGroupsPerPage: 5,
  otherGroupsPageNumber: 0,
  otherGroupsScrollState: {
    items: [],
    hasMore: true,
  },
};

const otherGroups = createSlice({
  name: "otherGroups",
  initialState,
  reducers: {
    setOtherGroups: (state, action) => {
      state.otherGroups = action.payload;
    },
    setOtherGroupsPerPage: (state, action) => {
      state.otherGroupsPerPage = action.payload;
    },
    setOtherGroupsPageNumber: (state, action) => {
      state.otherGroupsPageNumber = action.payload;
    },
    setOtherGroupsScrollState: (state, action) => {
      state.otherGroupsScrollState = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getOtherGroups.matchFulfilled,
      (state, action) => {
        const otherGroups = action.payload;

        const newOtherGroups = [...state.otherGroups, ...otherGroups];

        state.otherGroupsScrollState = {
          ...state.otherGroupsScrollState,
          items: newOtherGroups,
        };

        if (
          otherGroups.length === 0 ||
          otherGroups.length % state.otherGroupsPerPage !== 0
        ) {
          state.otherGroupsScrollState = {
            ...state.otherGroupsScrollState,
            hasMore: false,
          };
        }

        state.otherGroups = newOtherGroups;
      }
    );
  },
});

export const {
  setOtherGroups,
  setOtherGroupsPerPage,
  setOtherGroupsPageNumber,
  setOtherGroupsScrollState,
  setMultiple,
} = otherGroups.actions;
export default otherGroups.reducer;
export const otherGroupsSelector = (state) => state.otherGroups;
