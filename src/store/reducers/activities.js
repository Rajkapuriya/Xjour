import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/activities";

const initialState = {
  activities: [],
};

const activities = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getActivities.matchFulfilled,
      (state, action) => {
        const activities = action.payload;

        console.log("%cactivities:", "background-color:red", activities);

        state.activities = activities;
      }
    );
  },
});

export const { setActivities } = activities.actions;
export default activities.reducer;
export const activitiesSelector = (state) => state.activities;
