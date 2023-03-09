import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/stories";

const initialState = {
  stories: [],
  storiesPerPage: 2,
  storiesPageNumber: 0,
  featuredStoriesScrollState: {
    items: [],
    hasMore: true,
  },
};

const stories = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setStoriesPerPage: (state, action) => {
      state.storiesPage = action.payload;
    },
    setStoriesPageNumber: (state, action) => {
      state.storiesPageNumber = action.payload;
    },
    setFeaturedStoriesScrollState: (state, action) => {
      state.featuredStoriesScrollState = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getStories.matchFulfilled,
      (state, action) => {
        const stories = action.payload;

        const newStories = [...state.stories, ...stories];

        state.featuredStoriesScrollState = {
          ...state.featuredStoriesScrollState,
          items: newStories,
        };

        if (
          stories.length === 0 ||
          stories.length % state.storiesPerPage !== 0
        ) {
          state.featuredStoriesScrollState = {
            ...state.featuredStoriesScrollState,
            hasMore: false,
          };
        }

        state.stories = newStories;
      }
    );
  },
});

export const {
  setStories,
  setStoriesPerPage,
  setStoriesPageNumber,
  setFeaturedStoriesScrollState,
  setMultiple,
} = stories.actions;
export default stories.reducer;
export const storiesSelector = (state) => state.stories;
