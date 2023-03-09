import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "../endpoints/memories";

const initialState = {
  memoriesPerPage: 4,
  memoriesPageNumber: 0,
  memoriesScrollState: {
    items: [],
    hasMore: true,
  },
  memories: [],
  memoryImages: [],
  memoryVideos: [],
  memoryDocuments: [],
};

const memories = createSlice({
  name: "memories",
  initialState,
  reducers: {
    setMemoriesPerPage: (state, action) => {
      state.memoriesPerPage = action.payload;
    },
    setMemoriesPageNumber: (state, action) => {
      state.memoriesPageNumber = action.payload;
    },
    setMemoriesScrollState: (state, action) => {
      state.memoriesScrollState = action.payload;
    },
    setMemories: (state, action) => {
      state.memories = action.payload;
    },
    setMemoryImages: (state, action) => {
      state.memoryImages = action.payload;
    },
    setMemoryVideos: (state, action) => {
      state.memoryVideos = action.payload;
    },
    setMemoryDocuments: (state, action) => {
      state.memoryDocuments = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.getMemories.matchFulfilled,
      (state, action) => {
        console.log(
          "%caction in getMemories fulfilled:",
          "background-color:deeppink;color:white;",
          action
        );
        const { memories, memoryImages, memoryVideos, memoryDocuments } =
          action.payload;

        let newMemories = [...state.memories, ...memories];
        let newMemoryImages = [...state.memoryImages, ...memoryImages];
        let newMemoryVideos = [...state.memoryVideos, ...memoryVideos];
        let newMemoryDocuments = [...state.memoryDocuments, ...memoryDocuments];

        state.memoriesScrollState = {
          ...state.memoriesScrollState,
          items: newMemoryImages,
        };

        if (
          memories.length === 0 ||
          memories.length % state.memoriesPerPage !== 0
        ) {
          state.memoriesScrollState = {
            ...state.memoriesScrollState,
            hasMore: false,
          };
        }

        state.memories = newMemories;
        state.memoryImages = newMemoryImages;
        state.memoryVideos = newMemoryVideos;
        state.memoryDocuments = newMemoryDocuments;
      }
    );
  },
});

export const {
  setMemoriesPerPage,
  setMemoriesPageNumber,
  setMemoriesScrollState,
  setMemories,
  setMemoryImages,
  setMemoryVideos,
  setMemoryDocuments,
} = memories.actions;
export default memories.reducer;
export const memoriesSelector = (state) => state.memories;
