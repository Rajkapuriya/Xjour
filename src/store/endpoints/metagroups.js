import { apiSlice } from "../apiSlice";

import {
  getDocumentByName,
  getPrivateDocument,
} from "config/authentication/AuthenticationApi";

const urls = {
  retrieveMetaGroups: "metaGroups/retrieve",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMetaGroups: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const metaGroupsState = api.getState().metaGroups;

        try {
          const getMetaGroupsResponse = await fetchWithBQ({
            url: urls.retrieveMetaGroups,
            method: "POST",
            body: {
              page: metaGroupsState.metaGroupsPageNumber,
              objectsPerPage: metaGroupsState.metaGroupsPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const metaGroups = getMetaGroupsResponse.data;

          const _metaGroups = [];

          for (const key in metaGroups) {
            const groupVal = {
              name: metaGroups[key].name,
              key: metaGroups[key].pk,
              description: metaGroups[key].description,
              countrySvg: null,
              base64: null,
              searchable: metaGroups[key].searchable,
            };

            const configurations = JSON.parse(metaGroups[key].configurations);

            if (configurations !== null) {
              const groupDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              if (
                groupDataVal.documentID !== null ||
                groupDataVal.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    groupDataVal.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    groupVal.base64 = srcValue;
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
                groupDataVal.countryCode !== null ||
                groupDataVal.countryCode !== ""
              ) {
                try {
                  const getDocumentByNameResponse = await getDocumentByName(
                    token,
                    groupDataVal.countryCode,
                    visitorID
                  );

                  if (getDocumentByNameResponse?.data) {
                    const mimeType = "image/svg+xml";
                    const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                    groupVal.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              _metaGroups.push(groupVal);
            }
          }

          return { data: _metaGroups };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetMetaGroupsQuery, useLazyGetMetaGroupsQuery } =
  extendedApiSlice;
