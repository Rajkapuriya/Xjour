import { apiSlice } from "../apiSlice";

import {
  getDocumentByName,
  getPrivateDocument,
} from "config/authentication/AuthenticationApi";

const urls = {
  updateDestinationPreferences: "users/profile/updateDestPrefs",
  updateActivityPreferences: "users/profile/updateActivityPrefs",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateDestinationPreferences: builder.mutation({
      query: ({ userToken, reducerVisitorID, data }) => ({
        method: "PUT",
        url: urls.updateDestinationPreferences,
        headers: {
          Finger: reducerVisitorID,
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      }),
    }),
    updateActivityPreferences: builder.mutation({
      query: ({ userToken, reducerVisitorID, data }) => ({
        method: "PUT",
        url: urls.updateActivityPreferences,
        headers: {
          Finger: reducerVisitorID,
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateDestinationPreferencesMutation,
  useUpdateActivityPreferencesMutation,
} = extendedApiSlice;
