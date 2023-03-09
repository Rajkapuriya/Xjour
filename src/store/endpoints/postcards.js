import { apiSlice } from "../apiSlice";

import { getPrivateDocument } from "config/authentication/AuthenticationApi";

const urls = {
  retrievePostcards: "postcards/retrieve",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPostcards: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const postcardsState = api.getState().postcards;

        try {
          const getPostcardsResponse = await fetchWithBQ({
            url: urls.retrievePostcards,
            method: "POST",
            body: {
              page: postcardsState.postcardsPageNumber,
              objectsPerPage: postcardsState.postcardsPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const postcards = getPostcardsResponse.data;

          const _postcards = [];

          for (const key in postcards) {
            const postcardVal = {
              name: postcards[key].name,
              description: postcards[key].description,
              base64: null,
              searchable: postcards[key].searchable,
              pk: postcards[key].pk,
            };

            const configurations = JSON.parse(postcards[key].configurations);

            if (configurations !== null) {
              const postcardImageVal = {
                documentID:
                  configurations?.pictureDocumentID ||
                  configurations?.documentID ||
                  null,
              };

              if (
                postcardImageVal.documentID !== null ||
                postcardImageVal.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    postcardImageVal.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    postcardVal.base64 = srcValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetPrivateDocument error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              _postcards.push(postcardVal);
            }
          }

          return {
            data: {
              postcards: _postcards,
            },
          };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetPostcardsQuery, useLazyGetPostcardsQuery } =
  extendedApiSlice;
