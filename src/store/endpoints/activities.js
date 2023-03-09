import { apiSlice } from "../apiSlice";

import {
  getDocumentByName,
  getPrivateDocument,
} from "config/authentication/AuthenticationApi";

const urls = {
  retrieveActivities: "activities/retrieve",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        try {
          const getActivitiesResponse = await fetchWithBQ({
            url: urls.retrieveActivities,
            method: "GET",
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const activities = getActivitiesResponse.data;

          const _activities = [];

          for (const key in activities) {
            const activitiesVal = {
              name: activities[key].name,
              key: activities[key].pk,
              description: activities[key].description,
              countrySvg: null,
              base64: null,
              searchable: activities[key].searchable,
              documentID: null,
              countryCode: null,
            };

            const configurations = JSON.parse(activities[key].configurations);

            if (configurations !== null) {
              const activitykeyData = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              if (
                activitykeyData?.countryCode !== null ||
                activitykeyData?.countryCode !== ""
              ) {
                try {
                  const getDocumentByNameResponse = await getDocumentByName(
                    token,
                    activitykeyData.countryCode,
                    visitorID
                  );

                  if (getDocumentByNameResponse?.data) {
                    const mimeType = "image/svg+xml";
                    const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                    activitiesVal.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName error in activities.js:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              if (
                activitykeyData?.documentID !== null ||
                activitykeyData?.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    activitykeyData.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    activitiesVal.base64 = srcValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetPrivateDocument error in activities.js:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }
            }

            _activities.push(activitiesVal);
          }

          return { data: _activities };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetActivitiesQuery } = extendedApiSlice;
