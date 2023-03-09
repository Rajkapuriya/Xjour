import { apiSlice } from "../apiSlice";

import { getPrivateDocument } from "config/authentication/AuthenticationApi";

const urls = {
  retrieveNotes: "notes/retrieve",
  readNote(ugKey) {
    // ugKey -> Group Key
    return `notes/read/${ugKey}`;
  },
  createNote: "notes/create",
  updateNote: "notes/update",
  deleteNote(noteKey) {
    return `notes/delete/${noteKey}`;
  },
};

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveNotes: builder.query({
      async queryFn(arg, api, _extraOptions, fetchWithBQ) {
        const { token, visitorID } = arg;

        const notesState = api.getState().notes;

        try {
          const getNotesResponse = await fetchWithBQ({
            url: urls.retrieveNotes,
            method: "POST",
            body: {
              page: notesState.notesPageNumber,
              objectsPerPage: notesState.notesPerPage,
              sortOrder: "asc",
            },
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const notes = getNotesResponse.data;

          const _notes = [];

          for (const key in notes) {
            const notesVal = {
              ...notes[key],
              base64: null,
            };

            const configurations = JSON.parse(notes[key].configurations);

            if (configurations !== null) {
              const notesImageVal = {
                documentID: configurations?.pictureDocumentID,
              };

              if (
                notesImageVal.documentID !== null ||
                notesImageVal.documentID !== ""
              ) {
                try {
                  const getPrivateDocumentResponse = await getPrivateDocument(
                    token,
                    notesImageVal.documentID,
                    visitorID
                  );

                  if (getPrivateDocumentResponse?.data) {
                    const imageFile =
                      getPrivateDocumentResponse.data.dataBase64;
                    const mimeType = getPrivateDocumentResponse.data.mimeType;
                    const srcValue = `data:${mimeType};base64,${imageFile}`;

                    notesVal.base64 = srcValue;
                  }
                } catch (error) {
                  console.log(
                    "%cgetPrivateDocument error:",
                    "background-color:red;color:white;",
                    error
                  );
                }
              }

              _notes.push(notesVal);
            }
          }

          return { data: _notes };
        } catch (error) {
          return { error };
        }
      },
    }),
    readNote: builder.query({
      async queryFn(arg, _api, _extraOptions, fetchWithBBQ) {
        const { token, visitorID, ugKey } = arg;

        try {
          const readNoteResponse = await fetchWithBBQ({
            url: urls.readNote(ugKey),
            method: "GET",
            headers: {
              Finger: visitorID,
              Authorization: `Bearer ${token}`,
            },
          });

          const note = readNoteResponse.data;
          const noteVal = {
            ...note,
            base64: null,
          };

          const configurations = JSON.parse(note.configurations);
          if (configurations !== null) {
            const noteImageVal = {
              documentID: configurations?.pictureDocumentID,
            };

            if (
              noteImageVal.documentID !== null ||
              noteImageVal.documentID !== ""
            ) {
              try {
                const getPrivateDocumentResponse = await getPrivateDocument(
                  token,
                  noteImageVal.documentID,
                  visitorID
                );

                if (getPrivateDocumentResponse?.data) {
                  const imageFile = getPrivateDocumentResponse.data.dataBase64;
                  const mimeType = getPrivateDocumentResponse.data.mimeType;
                  const srcValue = `data:${mimeType};base64,${imageFile}`;

                  noteVal.base64 = srcValue;
                }
              } catch (error) {
                console.log(
                  "%cgetPrivateDocument error in read Note:",
                  "background-color:red;color:white;",
                  error
                );
              }
            }
          }

          return { data: noteVal };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Note"],
    }),
    createNote: builder.mutation({
      query: ({ token, visitorID, data }) => ({
        method: "POST",
        url: urls.createNote,
        headers: {
          Finger: visitorID,
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),
    updateNote: builder.mutation({
      query: ({ token, visitorID, data }) => ({
        method: "PUT",
        url: urls.updateNote,
        headers: {
          Finger: visitorID,
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation({
      query: ({ token, visitorID, noteKey }) => ({
        method: "DELETE",
        url: urls.deleteNote(noteKey),
        headers: {
          Finger: visitorID,
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useRetrieveNotesQuery,
  useLazyRetrieveNotesQuery,
  useReadNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = extendedApiSlice;
