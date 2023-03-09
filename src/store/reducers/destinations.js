import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/destinations";

const initialState = {
  destinations: [],
  destinationsPerPage: 4,
  destinationsPageNumber: 0,
  recentDestinationsScrollState: {
    items: [],
    hasMore: true,
  },
  replacePreviousByPage: false,
  selectedSingleDestination: {},
  singleDestinationsData: {},
};

const destinations = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    setDestinations: (state, action) => {
      state.destinations = action.payload;
    },
    setDestinationsPerPage: (state, action) => {
      state.destinationsPerPage = action.payload;
    },
    setDestinationsPageNumber: (state, action) => {
      state.destinationsPageNumber = action.payload;
    },
    setRecentDestinationsScrollState: (state, action) => {
      state.recentDestinationsScrollState = action.payload;
    },
    setReplacePreviousByPage: (state, action) => {
      state.replacePreviousByPage = action.payload;
    },
    setSelectedSingleDestination: (state, action) => {
      state.selectedSingleDestination = action.payload;
    },
    setSingleDestinationsData: (state, action) => {
      state.singleDestinationsData = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
    resetDestinationState: (state) => {
      state = {
        destinations: [],
        destinationsPerPage: 4,
        destinationsPageNumber: 0,
        recentDestinationsScrollState: {
          items: [],
          hasMore: true,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        extendedApiSlice.endpoints.getDestinations.matchFulfilled,
        (state, action) => {
          const destinations = action.payload;

          let newDestinations;
          if (state.replacePreviousByPage) {
            const oldDestinations = [...state.destinations].slice(
              0,
              state.destinationsPerPage * state.destinationsPageNumber
            );
            newDestinations = [...oldDestinations, ...destinations];
            state.replacePreviousByPage = false;
          } else {
            newDestinations = [...state.destinations, ...destinations];
          }

          state.recentDestinationsScrollState = {
            ...state.recentDestinationsScrollState,
            items: newDestinations,
          };

          if (
            destinations.length === 0 ||
            destinations.length % state.destinationsPerPage !== 0
          ) {
            state.recentDestinationsScrollState = {
              ...state.recentDestinationsScrollState,
              hasMore: false,
            };
          }

          state.destinations = newDestinations;
        }
      )
      .addMatcher(
        extendedApiSlice.endpoints.getSingleDestination.matchFulfilled,
        (state, action) => {
          const singleDestinationData = action.payload;

          state.singleDestinationsData[singleDestinationData.pk] = {
            connectionsData: singleDestinationData.connections,
            activitiesData: singleDestinationData.activities,
            linkedDestinationsData: singleDestinationData.destinations,
            mediaData: singleDestinationData.media,
          };

          state.selectedSingleDestination = {
            ...state.selectedSingleDestination,
          };
        }
      );
  },
});

export const {
  setDestinations,
  setDestinationsPerPage,
  setDestinationsPageNumber,
  setRecentDestinationsScrollState,
  setReplacePreviousByPage,
  setSelectedSingleDestination,
  setSingleDestinationsData,
  setMultiple,
  resetDestinationState,
} = destinations.actions;
export default destinations.reducer;
export const destinationsSelector = (state) => state.destinations;
