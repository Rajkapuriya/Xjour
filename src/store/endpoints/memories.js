import { apiSlice } from "../apiSlice";

import { getPrivateDocument } from "config/authentication/AuthenticationApi";

const urls = {
  retrieveMemories: "dms/retrieve",
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMemories: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const memoriesState = api.getState().memories;

        try {
          const getMemoriesResponse = await fetchWithBQ({
            url: urls.retrieveMemories,
            method: "POST",
            body: {
              page: memoriesState.memoriesPageNumber,
              objectsPerPage: memoriesState.memoriesPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const memories = getMemoriesResponse.data;

          const _memories = [];
          const memoryImages = [];
          const memoryVideos = [];
          const memoryDocuments = [];

          for (let key in memories) {
            const memoryObj = memories[key];

            if (memories[key].pk !== null || memories[key].pk !== "") {
              const mimeTypeOfMemory = memories[key].mimeType;
              const isMimeTypeImage = [
                "image/jpeg",
                "image/jpg",
                "image/png",
              ].includes(mimeTypeOfMemory);
              const isMimeTypeVideo = ["video/avi", "video/mp4"].includes(
                mimeTypeOfMemory
              );

              const memoryData = {};
              memoryData.date = "";
              memoryData.base64 = "";
              memoryData.documentId = memories[key].pk;

              if (isMimeTypeImage) {
                memoryData.image = "";
              } else if (isMimeTypeVideo) {
                memoryData.src = "";
                memoryData.name = memories[key].fileName;
                memoryData.mimeType = memories[key].mimeType;
              } else {
                memoryData.src = "";
                memoryData.name = memories[key].fileName;
                memoryData.mimeType = memories[key].mimeType;
              }

              try {
                const getPrivateDocumentResponse = await getPrivateDocument(
                  token,
                  memories[key].pk,
                  visitorID
                );

                if (getPrivateDocumentResponse?.data) {
                  const imageFile = getPrivateDocumentResponse.data.dataBase64;
                  const mimeType = getPrivateDocumentResponse.data.mimeType;
                  let srcValue = `data:${mimeType};base64,${imageFile}`;

                  memoryData.base64 = srcValue;
                  memoryObj.dataBase64 = srcValue;

                  memoryData.date =
                    getPrivateDocumentResponse.data.timestampDocument;
                  memoryObj.timestampRetention =
                    getPrivateDocumentResponse.data.timestampDocument;

                  if (isMimeTypeImage) {
                    memoryData.image = srcValue;
                  }
                }
              } catch (error) {
                console.log(
                  "%cgetPrivateDocument error in memories.js:",
                  "background-color:red;color:white;",
                  error
                );
              }
              if (isMimeTypeImage) {
                memoryImages.push(memoryData);
              } else if (isMimeTypeVideo) {
                memoryVideos.push(memoryData);
              } else {
                memoryDocuments.push(memoryData);
              }
            }
            _memories.push(memoryObj);
          }

          return {
            data: {
              memories: _memories,
              memoryImages,
              memoryVideos,
              memoryDocuments,
            },
          };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetMemoriesQuery } = extendedApiSlice;
