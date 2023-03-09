import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "store/endpoints/memberManagement";

const initialState = {
  memberConnections: [],
};

const memberConnections = createSlice({
  name: "memberConnections",
  initialState,
  reducers: {
    setMemberConnections: (state, action) => {
      state.memberConnections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getMyMemberConnections.matchFulfilled,
      (state, action) => {
        const memberConnections = action.payload;

        state.memberConnections = memberConnections;
      }
    );
  },
});

export const { setMemberConnections } = memberConnections.actions;
export default memberConnections.reducer;
export const memberConnectionsSelector = (state) => state.memberConnections;
