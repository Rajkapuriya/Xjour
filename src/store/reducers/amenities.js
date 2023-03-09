import { createSlice } from "@reduxjs/toolkit";

import { extendedApiSlice } from "store/endpoints/amenities";

const initialState = {
  amenitiesClasses: [],
  amenities: [],
  selectedAmenityType: null,
};

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {
    setAmenitiesClasses: (state, action) => {
      state.amenitiesClasses = action.payload;
    },
    setAmenities: (state, action) => {
      state.amenities = action.payload;
    },
    setSelectedAmenityType: (state, action) => {
      state.selectedAmenityType = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedApiSlice.endpoints.retrieveClasses.matchFulfilled,
      (state, action) => {
        let amenitiesClasses = action.payload;
        amenitiesClasses = amenitiesClasses.map((amenityClass) => ({
          ...amenityClass,
          label: amenityClass.name,
        }));

        state.amenitiesClasses = amenitiesClasses;
      }
    );
    builder.addMatcher(
      extendedApiSlice.endpoints.retrieveEnvelope.matchFulfilled,
      (state, action) => {
        const retrievedAmenities = action.payload;

        const _amenities = [];

        for (const key in retrievedAmenities) {
          const amenity = {
            address: retrievedAmenities[key].address,
            distance: retrievedAmenities[key].distance,
            extra: retrievedAmenities[key].extra,
            latitude: retrievedAmenities[key].latitude,
            longitude: retrievedAmenities[key].longitude,
            name: retrievedAmenities[key].name,
            type: retrievedAmenities[key].type,
          };

          _amenities.push(amenity);
        }

        state.amenities = _amenities;
      }
    );
  },
});

export const {
  setAmenitiesClasses,
  setAmenities,
  setSelectedAmenityType,
  setMultiple,
} = amenitiesSlice.actions;
export default amenitiesSlice.reducer;
export const amenitiesSelector = (state) => state.amenities;
