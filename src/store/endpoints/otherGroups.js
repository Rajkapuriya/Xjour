import { apiSlice } from "../apiSlice";

import { groupTypeKey_metaGroups } from "../../assets/constants/Contants";

import {
  getDocumentByName,
  getPrivateDocument,
} from "../../config/authentication/AuthenticationApi";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOtherGroups: builder.mutation({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const otherGroupsState = api.getState().otherGroups;

        try {
          const otherGroupsResponse = await fetchWithBQ({
            url: "memberManagement/retrieve",
            method: "POST",
            body: {
              page: otherGroupsState.otherGroupsPageNumber,
              objectsPerPage: otherGroupsState.otherGroupsPerPage,
              sortOrder: "asc",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const otherGroups = otherGroupsResponse.data;

          const _otherGroups = [];

          for (const key in otherGroups) {
            const groupVal = {
              name: otherGroups[key].name,
              key: otherGroups[key].pk,
              description: otherGroups[key].description,
              countrySvg: null,
              base64: null,
            };

            const configurations = JSON.parse(otherGroups[key].configurations);

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
            }
            _otherGroups.push(groupVal);
          }

          return { data: _otherGroups };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetOtherGroupsMutation } = extendedApiSlice;
