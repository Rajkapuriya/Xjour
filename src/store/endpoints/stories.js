import { apiSlice } from "../apiSlice";

import {
  getDocumentByName,
  getPrivateDocument,
} from "config/authentication/AuthenticationApi";

const urls = {
  retrievePublicStories: "stories/retrievePublic",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const storiesState = api.getState().stories;

        try {
          const getStoriesResponse = await fetchWithBQ({
            url: urls.retrievePublicStories,
            method: "POST",
            body: {
              page: storiesState.storiesPageNumber,
              objectsPerPage: storiesState.storiesPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const stories = getStoriesResponse.data;

          const _stories = [];

          for (const key in stories) {
            const storiesVal = {
              firstName: stories[key].firstName,
              lastName: stories[key].lastName,
              pk: stories[key].pk,
              description: stories[key].description,
              entKey: stories[key].entKey,
              message: stories[key].message,
              name: stories[key].name,
              searchable: stories[key].searchable,
              countrySvg: null,
              base64: null,
            };

            const configurations = JSON.parse(stories[key].userconfigurations);

            if (configurations !== null) {
              const storiesDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              if (
                storiesDataVal.documentID !== null ||
                storiesDataVal.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    storiesDataVal.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    storiesVal.base64 = srcValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetPrivateDocument error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              if (
                storiesDataVal.countryCode !== null ||
                storiesDataVal.countryCode !== ""
              ) {
                try {
                  const getDocumentByNameResponse = await getDocumentByName(
                    token,
                    storiesDataVal.countryCode,
                    visitorID
                  );

                  if (getDocumentByNameResponse?.data) {
                    const mimeType = "image/svg+xml";
                    const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                    storiesVal.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              _stories.push(storiesVal);
            }
          }

          return { data: _stories };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetStoriesQuery, useLazyGetStoriesQuery } = extendedApiSlice;
