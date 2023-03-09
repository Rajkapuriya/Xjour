import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import "./DeleteOrHideDialogue.css";

import { Close, KeyboardReturn } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { red } from "@mui/material/colors";

import { UNAUTH_KEY } from "assets/constants/Contants";

import {
  deleteActivitiesAPI,
  deleteDestinationAPI,
  deleteEventAPI,
  deleteMetaGroupAPI,
  deleteNotesAPI,
  deleteOrHideJourneyAPI,
  deletePostCardAPI,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  notesSelector,
  setMultiple as setNotesMultiple,
} from "store/reducers/notes";
import {
  destinationsSelector,
  setDestinations,
  setMultiple as setDestinationMultiple,
  setRecentDestinationsScrollState,
} from "store/reducers/destinations";
import { useDeleteDestinationMutation } from "store/endpoints/destinations";
import { useDeleteNoteMutation } from "store/endpoints/notes";

function DeleteOrHideDialogue({
  deleteOrHideConfirmation,
  setDeleteOrHideConfirmation,
  keyValue,
  state,
}) {
  const history = useHistory();
  const alert = useAlert();
  const storeDispatch = useDispatch();

  const [
    {
      userToken,
      reducerVisitorID,
      reducerAllNotes,
      reducerMyDestinations,
      reducerGroup,
      reducerMyActivities,
      reducerEvent,
      postcardsData,
    },
    dispatch,
  ] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const notesState = useSelector(notesSelector);

  const [deleteDestination] = useDeleteDestinationMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleCloseDeleteConfirmation = () =>
    setDeleteOrHideConfirmation(false);
  const [isLoading, setIsLoading] = useState(false);

  const HideItem = async () => {
    console.log("calling Hide journey API", keyValue, state);
    if (keyValue !== null) {
      if (state === "journey") {
        console.log("calling delete journey API");
        deleteOrHideJourneyAPI(userToken, keyValue, 0, reducerVisitorID).then(
          function (val) {
            setIsLoading(true);
            console.log("delete API response >>", val.data);

            // newGroupArray.splice(selectedGroup.index, 1);
            // console.log("newGroupArray", newGroupArray);
            // dispatch({
            //   type: "SET_GROUP_DATA",
            //   reducerGroup: newGroupArray,
            // });

            setIsLoading(false);
            alert.show("Journey Hid Successfully");
            handleCloseDeleteConfirmation();
            history.push("/destinations/my-journeys");
          }
        );
      }
      if (state === "postcard") {
        console.log("Array Value", postcardsData);
        // deletePostCardAPI(userToken, keyValue, 0, reducerVisitorID).then(
        //   function (val) {
        //     if (val) {
        //       console.log("hide API response >>", val.statusText);

        //       if (val.statusText == "OK") {
        //         setIsLoading(false);

        //         console.log("Array Value", postcardsData);

        //         var index = postcardsData.findIndex((x) => x.pk === keyValue);
        //         // if (index === 1) {
        //         // }
        //         postcardsData.splice(index, 1);
        //         console.log("Array Value hided", postcardsData);
        //         console.log("Array Value hidedIndex", index);

        //         alert.show("Destination Hid Successfully");

        //         dispatch({
        //           type: "SET_MY_DESTINATIONS",
        //           postcardsData: postcardsData,
        //         });

        //         history.push("/destinations/my-destinations");
        //       }
        //     } else if (val.status == UNAUTH_KEY) {
        //       console.log("Setting to 0");
        //       localStorage.setItem("user-info-token", 0);
        //       dispatch({
        //         type: "SET_USER_TOKEN",
        //         reducerUserToken: 0,
        //       });
        //     }
        //   }
        // );
      }
      if (state === "notes") {
        // deleteOrHideJourneyAPI(userToken, keyValue).then(function (val) {
        //   setIsLoading(true);
        //   console.log("delete API response >>", val.data);
        //   // newGroupArray.splice(selectedGroup.index, 1);
        //   // console.log("newGroupArray", newGroupArray);
        //   // dispatch({
        //   //   type: "SET_GROUP_DATA",
        //   //   reducerGroup: newGroupArray,
        //   // });
        //   setIsLoading(false);
        //   alert.show("Journey Deleted Successfully");
        //   handleCloseDeleteConfirmation();
        //   history.push("/destinations/notes");
        // });
      }
      if (state === "groups") {
        // deleteOrHideJourneyAPI(userToken, keyValue).then(function (val) {
        //   setIsLoading(true);
        //   console.log("delete API response >>", val.data);
        //   // newGroupArray.splice(selectedGroup.index, 1);
        //   // console.log("newGroupArray", newGroupArray);
        //   // dispatch({
        //   //   type: "SET_GROUP_DATA",
        //   //   reducerGroup: newGroupArray,
        //   // });
        //   setIsLoading(false);
        //   alert.show("Journey Deleted Successfully");
        //   handleCloseDeleteConfirmation();
        //   history.push("/destinations/notes");
        // });
      }
      if (state === "destination") {
        setIsLoading(true);
        try {
          await deleteDestination({
            userToken,
            reducerVisitorID,
            documentID: keyValue,
            code: 0,
          });

          const newDestinations = destinationsState.destinations.filter(
            (destination) => destination.key !== keyValue
          );

          storeDispatch(
            setDestinationMultiple({
              destinations: newDestinations,
              recentDestinationsScrollState: {
                ...destinationsState.recentDestinationsScrollState,
                items: newDestinations,
              },
            })
          );

          alert.show("Destination Hidden Successfully!");
          history.push("/destinations/my-destinations");
        } catch (error) {
          alert.show("Error Deleting Destination!");
        } finally {
          setIsLoading(false);
        }
      }
      if (state === "activity") {
        // deleteOrHideJourneyAPI(userToken, keyValue).then(function (val) {
        //   setIsLoading(true);
        //   console.log("delete API response >>", val.data);
        //   // newGroupArray.splice(selectedGroup.index, 1);
        //   // console.log("newGroupArray", newGroupArray);
        //   // dispatch({
        //   //   type: "SET_GROUP_DATA",
        //   //   reducerGroup: newGroupArray,
        //   // });
        //   setIsLoading(false);
        //   alert.show("Journey Deleted Successfully");
        //   handleCloseDeleteConfirmation();
        //   history.push("/destinations/my-destinations");
        // });
      }
      if (state === "event") {
        // deleteOrHideJourneyAPI(userToken, keyValue).then(function (val) {
        //   setIsLoading(true);
        //   console.log("delete API response >>", val.data);
        //   // newGroupArray.splice(selectedGroup.index, 1);
        //   // console.log("newGroupArray", newGroupArray);
        //   // dispatch({
        //   //   type: "SET_GROUP_DATA",
        //   //   reducerGroup: newGroupArray,
        //   // });
        //   setIsLoading(false);
        //   alert.show("Journey Deleted Successfully");
        //   handleCloseDeleteConfirmation();
        //   history.push("/destinations/my-destinations");
        // });
      }
    }

    handleCloseDeleteConfirmation();
    console.log(0);
  };

  const confirmDelete = async () => {
    console.log("calling delete journey API", keyValue, state);
    if (keyValue !== null) {
      if (state === "journey") {
        console.log("calling delete journey API");
        deleteOrHideJourneyAPI(userToken, keyValue, 1, reducerVisitorID).then(
          function (val) {
            setIsLoading(true);
            console.log("delete API response >>", val.data);

            // newGroupArray.splice(selectedGroup.index, 1);
            // console.log("newGroupArray", newGroupArray);
            // dispatch({
            //   type: "SET_GROUP_DATA",
            //   reducerGroup: newGroupArray,
            // });

            setIsLoading(false);
            alert.show("Journey Deleted Successfully");
            handleCloseDeleteConfirmation();
            history.push("/destinations/my-journeys");
          }
        );
      }
      if (state === "postcard") {
        console.log("Array Value", postcardsData);
        deletePostCardAPI(userToken, keyValue, 1, reducerVisitorID).then(
          function (val) {
            if (val) {
              console.log("delete API response >>", val.statusText);

              if (val.statusText === "OK") {
                setIsLoading(false);

                console.log("Array Value", postcardsData);

                var index = postcardsData.findIndex((x) => x.pk === keyValue);
                // if (index === 1) {
                // }
                postcardsData.splice(index, 1);
                console.log("Array Value Deleted", postcardsData);
                console.log("Array Value DeletedIndex", index);

                alert.show("Postcard Deleted Successfully");

                dispatch({
                  type: "SET_POSTCARDS_DATA",
                  postcardsData: postcardsData,
                });

                history.push("/home");
              }
            } else if (val.status === UNAUTH_KEY) {
              console.log("Setting to 0");
              localStorage.setItem("user-info-token", 0);
              dispatch({
                type: "SET_USER_TOKEN",
                reducerUserToken: 0,
              });
            }
          }
        );
      }
      if (state === "notes") {
        setIsLoading(true);

        try {
          await deleteNote({
            token: userToken,
            visitorID: reducerVisitorID,
            noteKey: keyValue,
          });

          const newNotes = notesState.notes.filter(
            (note) => note.pk !== keyValue
          );

          storeDispatch(
            setNotesMultiple({
              notes: newNotes,
              recentNotesScrollState: {
                ...notesState.recentNotesScrollState,
                items: newNotes,
              },
            })
          );

          history.push("/destinations/notes");
          alert.show("Note Deleted Successfully");
        } catch (error) {
          alert.show(
            "%cError Deleting Note!",
            "background-color:red;color:white;",
            error
          );
        } finally {
          setIsLoading(false);
        }
      }
      if (state === "groups") {
        console.log("Array Value", reducerAllNotes);

        deleteMetaGroupAPI(userToken, keyValue, 1, reducerVisitorID).then(
          function (val) {
            if (val) {
              console.log("delete API response >>", val.statusText);

              if (val.statusText === "OK") {
                setIsLoading(false);

                console.log("Array Value", reducerGroup);

                var index = reducerGroup.findIndex((x) => x.key === keyValue);

                reducerGroup.splice(index, 1);
                console.log("Array Value Deleted", reducerGroup);
                console.log("Array Value DeletedIndex", index);

                history.push("/home");
                alert.show("Group Deleted Successfully");

                dispatch({
                  type: "GET_ALL_NOTES",
                  reducerGroup: reducerGroup,
                });
              }
            } else if (val.status === UNAUTH_KEY) {
              console.log("Setting to 0");
              localStorage.setItem("user-info-token", 0);
              dispatch({
                type: "SET_USER_TOKEN",
                reducerUserToken: 0,
              });
            }
          }
        );
      }

      if (state === "destination") {
        setIsLoading(true);
        try {
          await deleteDestination({
            userToken,
            reducerVisitorID,
            documentID: keyValue,
            code: 1,
          });

          const newDestinations = destinationsState.destinations.filter(
            (destination) => destination.key !== keyValue
          );

          storeDispatch(
            setDestinationMultiple({
              destinations: newDestinations,
              recentDestinationsScrollState: {
                ...destinationsState.recentDestinationsScrollState,
                items: newDestinations,
              },
            })
          );

          alert.show("Destination Deleted Successfully!");
          history.push("/destinations/my-destinations");
        } catch (error) {
          alert.show("Error Deleting Destination!");
        } finally {
          setIsLoading(false);
        }
      }

      if (state === "activity") {
        console.log("Array Value", reducerMyActivities);

        deleteActivitiesAPI(userToken, keyValue, 1, reducerVisitorID).then(
          function (val) {
            if (val) {
              console.log("delete API response >>", val.statusText);

              if (val.statusText === "OK") {
                setIsLoading(false);

                console.log("Array Value", reducerMyActivities);

                var index = reducerMyActivities.findIndex(
                  (x) => x.key === keyValue
                );

                reducerMyActivities.splice(index, 1);
                console.log("Array Value Deleted", reducerMyActivities);
                console.log("Array Value DeletedIndex", index);

                history.push("/destinations/my-activities");
                alert.show("Activity Deleted Successfully");

                dispatch({
                  type: "GET_ALL_NOTES",
                  reducerMyActivities: reducerMyActivities,
                });
              }
            } else if (val.status === UNAUTH_KEY) {
              console.log("Setting to 0");
              localStorage.setItem("user-info-token", 0);
              dispatch({
                type: "SET_USER_TOKEN",
                reducerUserToken: 0,
              });
            }
          }
        );
      }
      if (state === "event") {
        console.log("Array Value", reducerEvent);

        deleteEventAPI(userToken, keyValue, 1, reducerVisitorID).then(function (
          val
        ) {
          if (val) {
            console.log("delete API response >>", val.statusText);

            if (val.statusText === "OK") {
              setIsLoading(false);

              console.log("Array Value", reducerEvent);

              var index = reducerEvent.findIndex((x) => x.key === keyValue);

              reducerEvent.splice(index, 1);
              console.log("Array Value Deleted", reducerEvent);
              console.log("Array Value DeletedIndex", index);

              history.push("/home");
              alert.show("Activity Deleted Successfully");

              dispatch({
                type: "GET_ALL_NOTES",
                reducerEvent: reducerEvent,
              });
            }
          } else if (val.status === UNAUTH_KEY) {
            console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        });
      }
    }

    console.log(1);

    // handleCloseDeleteConfirmation();
  };

  return (
    <div className="deleteOrHideDialogue">
      <Dialog
        onClose={() => (isLoading ? null : handleCloseDeleteConfirmation())}
        open={deleteOrHideConfirmation}
      >
        <DialogTitle>Do you want to Delete this or Hide this?</DialogTitle>

        {isLoading ? (
          <div className="delete-hide-dialogue__loader-container">
            <Oval color="#00BFFF" height={60} width={60} />
          </div>
        ) : (
          <>
            <List sx={{ pt: 0 }} className="dialogList">
              <ListItem button onClick={(e) => confirmDelete()}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[500], color: "red"[600] }}>
                    <Close style={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Delete" style={{ color: "red" }} />
              </ListItem>

              <ListItem
                button
                onClick={() => HideItem()}
                // onClick={() => handleCloseDeleteConfirmation()}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#22b0ea", color: "#22b0ea" }}>
                    <KeyboardReturn style={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Hide" />
              </ListItem>
            </List>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default DeleteOrHideDialogue;
