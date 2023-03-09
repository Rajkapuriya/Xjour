import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./apiSlice";

import activities from "./reducers/activities";
import amenities from "./reducers/amenities";
import destinations from "./reducers/destinations";
import memberConnections from "./reducers/memberConnections";
import memories from "./reducers/memories";
import metaGroups from "./reducers/metaGroups";
import notes from "./reducers/notes";
import otherGroups from "./reducers/otherGroups";
import postcards from "./reducers/postcards";
import stories from "./reducers/stories";
import todos from "./reducers/todos";

const store = configureStore({
  reducer: {
    activities,
    amenities,
    destinations,
    memberConnections,
    memories,
    metaGroups,
    notes,
    otherGroups,
    postcards,
    stories,
    todos,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
