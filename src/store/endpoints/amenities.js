import { apiSlice } from "../apiSlice";

const urls = {
  retrieveClasses: "amenities/classes",
  retrieveEnvelope: "amenities/retrieveEnvelope",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveClasses: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        try {
          const retrieveClassesResponse = await fetchWithBQ({
            url: `${urls.retrieveClasses}/EN`,
            method: "GET",
            body: {
              name: "end",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          return retrieveClassesResponse;
        } catch (error) {
          return { error };
        }
      },
    }),
    retrieveEnvelope: builder.mutation({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID, data } = arg;

        try {
          const retrieveEnvelopeResponse = await fetchWithBQ({
            url: urls.retrieveEnvelope,
            method: "POST",
            body: data,
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          return retrieveEnvelopeResponse;
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useRetrieveEnvelopeMutation, useRetrieveClassesQuery } =
  extendedApiSlice;
