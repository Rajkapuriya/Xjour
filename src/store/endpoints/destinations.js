import { apiSlice } from "../apiSlice";

import {
  getDocumentByName,
  getPrivateDocument,
  readSingleActivityAPI,
  readSingleUserAPI,
  retrieveSingleDestinationAPI,
} from "config/authentication/AuthenticationApi";

const urls = {
  retrieveDestinations: "destinations/retrieve",
  createDestination: "destinations/create",
  updateDestination: "destinations/update",
  deleteDestination(documentID, code) {
    return `destinations/delete/${documentID}/${code}`;
  },
  getSingleDestination(groupKey) {
    return `destinations/read/${groupKey}`;
  },
  addDestinationItem: "destinations/addItem",
  deleteDestinationItem(documentID) {
    return `destinations/deleteItem/${documentID}`;
  },
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const destinationsState = api.getState().destinations;

        console.log(
          "%cdestinationState in mutation:",
          "background-color:red;",
          destinationsState
        );
        try {
          const getDestinationsResponse = await fetchWithBQ({
            url: urls.retrieveDestinations,
            method: "POST",
            body: {
              page: destinationsState.destinationsPageNumber,
              objectsPerPage: destinationsState.destinationsPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const destinations = getDestinationsResponse.data;

          const _destinations = [];

          for (const key in destinations) {
            const destinationVal = {
              configurations: destinations[key].configurations,
              name: destinations[key].name,
              key: destinations[key].pk,
              description: destinations[key].description,
              searchable: destinations[key].searchable,
              latitude: destinations[key].latitude,
              longitude: destinations[key].longitude,
              followUpDateTime: destinations[key].followUpDateTime,
              creationDateTime: destinations[key].creationDateTime,
              displayName: destinations[key].displayName,
              mapZoom: destinations[key].mapZoom,
            };

            const configurations = JSON.parse(destinations[key].configurations);

            if (configurations.DestinationType === "waypoint") {
              destinationVal.type = "waypoint";
            } else {
              destinationVal.base64 = null;
              destinationVal.countrySvg = null;
            }

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

                    destinationVal.base64 = srcValue;
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

                    destinationVal.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              _destinations.push(destinationVal);
            }
          }

          return { data: _destinations };
        } catch (error) {
          return { error };
        }
      },
    }),
    createDestination: builder.mutation({
      query: (params) => ({
        url: urls.createDestination,
        method: "POST",
        body: params.data,
        headers: {
          Finger: params.reducerVisitorID,
          Authorization: `Bearer ${params.userToken}`,
        },
      }),
    }),
    getSingleDestination: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { groupKey, userToken, reducerVisitorID } = arg;

        try {
          const getSingleDestinationResponse = await fetchWithBQ({
            url: urls.getSingleDestination(groupKey),
            method: "GET",
            headers: {
              Finger: reducerVisitorID,
              Authorization: `Bearer ${userToken}`,
            },
          });

          const destinationData = getSingleDestinationResponse.data;

          let base64 = null;
          let countrySvg = null;
          const configurations = JSON.parse(destinationData.configurations);
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
                  userToken,
                  groupDataVal.documentID,
                  reducerVisitorID
                );

                if (getPrivateDocumentResponse?.data) {
                  const imageFile = getPrivateDocumentResponse.data.dataBase64;
                  const mimeType = getPrivateDocumentResponse.data.mimeType;
                  const srcValue = `data:${mimeType};base64,${imageFile}`;

                  base64 = srcValue;
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
                  userToken,
                  groupDataVal.countryCode,
                  reducerVisitorID
                );

                if (getDocumentByNameResponse?.data) {
                  const mimeType = "image/svg+xml";
                  const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                  countrySvg = svgValue;
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

          const destinationComponents = JSON.parse(destinationData.components);
          console.log(
            "%cdestinationComponents:",
            "background-color:red;color:white;",
            destinationComponents
          );
          const memoryKeys = destinationComponents.MEMORIES;
          const activitiesKeys = destinationComponents.ACTIVITY;
          const connectionKeys = destinationComponents.USERCONTACT;
          const destinationKeys = destinationComponents.DESTINATION;

          const media = [];
          for (let key in memoryKeys) {
            const imageValue = {
              docKey: memoryKeys[key].docKey,
              groupItemsKey: memoryKeys[key].groupItemsKey,
              index: media.length,
              base64: null,
              date: null,
            };

            try {
              const getPrivateDocumentResponse = await getPrivateDocument(
                userToken,
                memoryKeys[key].docKey,
                reducerVisitorID
              );

              if (getPrivateDocumentResponse?.data) {
                const imageFile = getPrivateDocumentResponse.data.dataBase64;
                const mimeType = getPrivateDocumentResponse.data.mimeType;
                const srcValue = `data:${mimeType};base64,${imageFile}`;

                imageValue.base64 = srcValue;
                imageValue.date =
                  getPrivateDocumentResponse.data.timestampDocument;
              }
            } catch (error) {
              console.log(
                "%cgetPrivateDocument in getSingleDestination memoryImage error:",
                "background-color:red;color:white;",
                error
              );
            }

            media.push(imageValue);
          }

          const connections = [];
          for (let key in connectionKeys) {
            const connectionValue = {
              entKey: connectionKeys[key].docKey,
              groupItemsKey: connectionKeys[key].groupItemsKey,
              index: connections.length,
              base64: null,
              countrySvg: null,
              firstName: null,
              lastName: null,
            };

            try {
              const readSingleUserAPIResponse = await readSingleUserAPI(
                userToken,
                connectionKeys[key].docKey,
                reducerVisitorID
              );

              const singleUserData = readSingleUserAPIResponse.data;

              if (singleUserData.firstName !== null) {
                connectionValue.firstName = singleUserData.firstName;
                connectionValue.lastName = singleUserData.lastName;
              }

              if (
                singleUserData.avatar_dms_key !== null ||
                singleUserData.avatar_dms_key !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    userToken,
                    singleUserData.avatar_dms_key,
                    reducerVisitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    connectionValue.base64 = srcValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetPrivateDocument in getSingleDestination connections error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              if (
                singleUserData.countryCode !== null ||
                singleUserData.countryCode !== ""
              ) {
                try {
                  const getDocumentByNameResponse = await getDocumentByName(
                    userToken,
                    singleUserData.countryCode,
                    reducerVisitorID
                  );

                  if (getDocumentByNameResponse?.data) {
                    const mimeType = "image/svg+xml";
                    const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                    connectionValue.countrySvg = svgValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetDocumentByName in getSingleDestination connections error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }
            } catch (error) {
              console.log(
                "%creadSingleUserAPIResponse in getSingleDestination error:",
                "background-color:red;color:white;",
                error
              );
            }

            connections.push(connectionValue);
          }

          const activities = [];
          for (let key in activitiesKeys) {
            const activitiesSingleItemValue = {
              name: null,
              key: activitiesKeys[key].docKey,
              groupItemsKey: activitiesKeys[key].groupItemsKey,
              description: null,
              countrySvg: null,
              base64: null,
              index: activities.length,
            };

            try {
              const readSingleActivityAPIResponse = await readSingleActivityAPI(
                userToken,
                activitiesKeys[key].docKey,
                reducerVisitorID
              );

              const singleActivityData = readSingleActivityAPIResponse.data;

              activitiesSingleItemValue.name = singleActivityData.name;
              activitiesSingleItemValue.description =
                singleActivityData.description;

              if (singleActivityData?.configurations) {
                const configurations = JSON.parse(
                  singleActivityData.configurations
                );

                if (singleActivityData.pk !== 1213) {
                  const activityDataValue = {
                    countryCode: configurations?.CountryCode,
                    documentID: configurations?.pictureDocumentID,
                  };

                  if (
                    activityDataValue.countryCode !== null ||
                    activityDataValue.countryCode !== ""
                  ) {
                    try {
                      const getDocumentByNameResponse = await getDocumentByName(
                        userToken,
                        activityDataValue.countryCode,
                        reducerVisitorID
                      );

                      if (getDocumentByNameResponse?.data) {
                        const mimeType = "image/svg+xml";
                        const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                        activitiesSingleItemValue.countrySvg = svgValue;
                      }
                    } catch (error) {
                      console.log(
                        "%cgetDocumentByName in getSingleDestination activities error:",
                        "background-color:red;color:white;",
                        error
                      );
                    }
                  }

                  if (
                    activityDataValue.documentID !== null ||
                    activityDataValue.documentID !== ""
                  ) {
                    try {
                      const getPrivateDocumentResponse =
                        await getPrivateDocument(
                          userToken,
                          activityDataValue.avatar_dms_key,
                          reducerVisitorID
                        );

                      if (getPrivateDocumentResponse?.data) {
                        const imageFile =
                          getPrivateDocumentResponse.data.dataBase64;
                        const mimeType =
                          getPrivateDocumentResponse.data.mimeType;
                        const srcValue = `data:${mimeType};base64,${imageFile}`;

                        activitiesSingleItemValue.base64 = srcValue;
                      }
                    } catch (error) {
                      console.log(
                        "%cgetPrivateDocument in getSingleDestination activities error:",
                        "background-color:red;color:white;",
                        error
                      );
                    }
                  }
                }
              }
            } catch (error) {
              console.log(
                "%creadSingleAcitivityAPI in getSingleDestination error:",
                "background-color:red;color:white;",
                error
              );
            }

            activities.push(activitiesSingleItemValue);
          }

          const destinations = [];
          for (var key in destinationKeys) {
            const destinationSingleItemValue = {
              name: null,
              key: destinationKeys[key].docKey,
              groupItemsKey: destinationKeys[key].groupItemsKey,
              countrySvg: null,
              isLoading: false,
              index: destinations.length,
            };

            try {
              const retrieveSingleDestinationAPIResponse =
                await retrieveSingleDestinationAPI(
                  userToken,
                  destinationKeys[key].docKey,
                  reducerVisitorID
                );

              const singleDestinationData =
                retrieveSingleDestinationAPIResponse.data;

              if (singleDestinationData.name !== null) {
                destinationSingleItemValue.name = singleDestinationData.name;

                if (singleDestinationData?.configurations) {
                  const configurations = JSON.parse(
                    singleDestinationData.configurations
                  );

                  if (
                    configurations.pictureDocumentID !== null ||
                    configurations.pictureDocumentID !== ""
                  ) {
                    try {
                      const getPrivateDocumentResponse =
                        await getPrivateDocument(
                          userToken,
                          configurations.pictureDocumentID,
                          reducerVisitorID
                        );

                      if (getPrivateDocumentResponse?.data) {
                        const imageFile =
                          getPrivateDocumentResponse.data.dataBase64;
                        const mimeType =
                          getPrivateDocumentResponse.data.mimeType;
                        const srcValue = `data:${mimeType};base64,${imageFile}`;

                        destinationSingleItemValue.base64 = srcValue;
                      }
                    } catch (error) {
                      console.log(
                        "%cgetPrivateDocument in getSingleDestination destinations error:",
                        "background-color:red;color:white;",
                        error
                      );
                    }
                  }

                  if (
                    configurations.countryCode !== null ||
                    configurations.countryCode !== ""
                  ) {
                    try {
                      const getDocumentByNameResponse = await getDocumentByName(
                        userToken,
                        configurations.countryCode,
                        reducerVisitorID
                      );

                      if (getDocumentByNameResponse?.data) {
                        const mimeType = "image/svg+xml";
                        const svgValue = `data:${mimeType};base64,${getDocumentByNameResponse.data}`;

                        destinationSingleItemValue.countrySvg = svgValue;
                      }
                    } catch (error) {
                      console.log(
                        "%cgetDocumentByName in getSingleDestination destinations error:",
                        "background-color:red;color:white;",
                        error
                      );
                    }
                  }
                }
              }
            } catch (error) {
              console.log(
                "%cretrieveSingleDestinationAPI error in getSingleDestination:",
                "background-color:red;color:white",
                error
              );
            }

            destinations.push(destinationSingleItemValue);
          }

          const finalData = {
            ...destinationData,
            base64,
            countrySvg,
            description: destinationData.description,
            media,
            connections,
            activities,
            destinations,
          };
          return { data: finalData };
        } catch (error) {
          console.log(
            "%cdestination read error:",
            "background-color:red;color:white;",
            error
          );

          return { error };
        }
      },
      providesTags: ["Destination"],
    }),
    deleteDestination: builder.mutation({
      query: (params) => ({
        url: urls.deleteDestination(params.documentID, params.code),
        method: "DELETE",
        headers: {
          Finger: params.reducerVisitorID,
          Authorization: `Bearer ${params.userToken}`,
        },
      }),
    }),
    addDestinationItem: builder.mutation({
      query: (params) => ({
        url: urls.addDestinationItem,
        method: "POST",
        body: params.data,
        headers: {
          Finger: params.reducerVisitorID,
          Authorization: `Bearer ${params.userToken}`,
        },
      }),
      invalidatesTags: ["Destination"],
    }),
    deleteDestinationItem: builder.mutation({
      query: (params) => ({
        url: urls.deleteDestinationItem(params.documentID),
        method: "DELETE",
        headers: {
          Finger: params.reducerVisitorID,
          Authorization: `Bearer ${params.userToken}`,
        },
      }),
      invalidatesTags: ["Destination"],
    }),
    updateDestination: builder.mutation({
      query: (params) => ({
        url: urls.updateDestination,
        method: "PUT",
        body: params.data,
        headers: {
          Finger: params.reducerVisitorID,
          Authorization: `Bearer ${params.userToken}`,
        },
      }),
      invalidatesTags: ["Destination"],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useLazyGetDestinationsQuery,
  useCreateDestinationMutation,
  useGetSingleDestinationQuery,
  useDeleteDestinationMutation,
  useAddDestinationItemMutation,
  useDeleteDestinationItemMutation,
  useUpdateDestinationMutation,
} = extendedApiSlice;
