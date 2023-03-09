import { apiSlice } from "../apiSlice";

import { groupTypeKey_metaGroups } from "../../assets/constants/Contants";

import {
  getDocumentByName,
  getPrivateDocument,
} from "config/authentication/AuthenticationApi";

const urls = {
  retrieveOtherGroups: "memberManagement/retrieve",
  myMemberConnections: "memberManagement/myMemberConnections",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOtherGroups: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const otherGroupsState = api.getState().otherGroups;

        try {
          const otherGroupsResponse = await fetchWithBQ({
            url: urls.retrieveOtherGroups,
            method: "POST",
            body: {
              page: otherGroupsState.otherGroupsPageNumber,
              objectsPerPage: otherGroupsState.otherGroupsPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
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
    getMyMemberConnections: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        try {
          const getMyMemberConnectionsResponse = await fetchWithBQ({
            url: urls.myMemberConnections,
            method: "GET",
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const memberConnections = getMyMemberConnectionsResponse.data;

          const _memberConnections = [];
          for (const key in memberConnections) {
            const connectionVal = {
              firstName: memberConnections[key].firstName,
              lastName: memberConnections[key].lastName,
              pk: memberConnections[key].pk,
              entKey: memberConnections[key].entKey,
              countrySvg: null,
              base64: null,
              ugmStatus: memberConnections[key].ugmStatus,
            };

            var configurations = JSON.parse(
              memberConnections[key]?.userconfigurations
            );

            if (
              configurations !== null &&
              configurations.countryCode !== null &&
              configurations.pictureDocumentID !== null
            ) {
              const connectionDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              if (
                connectionDataVal?.countryCode !== null ||
                connectionDataVal?.countryCode !== ""
              ) {
                try {
                  const getDocumentByNameResponse = await getDocumentByName(
                    token,
                    connectionDataVal.countryCode,
                    visitorID
                  );

                  if (getDocumentByNameResponse?.data) {
                    const mimeType = "image/svg+xml";
                    const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                    connectionVal.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName error in memberManagement.js:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              if (
                connectionDataVal?.documentID !== null ||
                connectionDataVal?.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    connectionDataVal.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    connectionVal.base64 = srcValue;
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
            _memberConnections.push(connectionVal);
          }

          return { data: _memberConnections };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useGetOtherGroupsQuery,
  useLazyGetOtherGroupsQuery,
  useGetMyMemberConnectionsQuery,
} = extendedApiSlice;
