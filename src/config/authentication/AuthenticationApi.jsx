import {
  addDestinationItem,
  addJourneyItem,
  addMetaGroupItem,
  addPostcardMember,
  addWayPoint,
  checkEmail,
  createActivities,
  createBase64DMS,
  createDestination,
  createEvent,
  createJourney,
  createMetaGroup,
  createNotes,
  createPostcard,
  deleteActivities,
  deleteDestinationItem,
  deleteDocument,
  deleteEvent,
  deleteEventItem,
  deleteJourneyItem,
  deleteMetaGroup,
  deleteMetaGroupItem,
  deleteNotes,
  deletePostcardMember,
  deleteWayPoint,
  retrieveEmergenciesMap,
  eventAddItem,
  eventUpdateTime,
  getAllActivities,
  getAllMembers,
  getAllMetaGroup,
  getAllNotes,
  getAllPostcards,
  getAllTrip,
  getDMSByName,
  getDMSIDByName,
  getFlagDMS,
  getPublicDMSById,
  getSingleMetaGroup,
  getSingleUser,
  getTripValue,
  hideOrDeleteJourney,
  joiningGroupRequest,
  logIn,
  myMemberConnections,
  profileReadExtension,
  readSingleActivity,
  readSinglePostCard,
  retreiveUserCountry,
  retrieveDestination,
  retrieveEvent,
  retrieveJourney,
  retrieveLocationDetails,
  retrieveMemoryImages,
  updateImageDetail,
  getAnnotations,
  createAnnotations,
  editAnnotations,
  repositionAnnotationCall,
  removeAnnotationItem,
  retrieveSingleDestination,
  retrieveSingleEvent,
  retrieveSingleJourney,
  retrieveSinglePrivateDocument,
  retrieveStories,
  routingForMaps,
  setCountryCode,
  signUp,
  updateActivities,
  updateActivityPrefs,
  updateBase64Avatar,
  updateDestination,
  updateDestPrefs,
  updateEvent,
  updateJourney,
  updateMetaGroupItem,
  createBinary,
  updateNotes,
  updatePassword,
  updatePersonalLocation,
  updatePersonalProfile,
  updatePostcard,
  updateProfileConfigurations,
  validateRegistrationID,
  visibleMembers,
  deleteTodoGroup,
  updateTodoGroup,
  createTodoGroup,
  retrieveAllTodoGroups,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  readTodoItem,
  deleteDestination,
  deletePostcard,
  retrieveAmenitiesMap,
  retrieveAmenitiesClasses,
} from "../../assets/strings/Strings";

import axiosClient from "./apiClient";

function getProduct() {
  return axiosClient.get(checkEmail);
}

function getProfileValue(token, visitorID) {
  return axiosClient.get(profileReadExtension, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

function getAvatarById(token, id, visitorID) {
  return axiosClient.get(getPublicDMSById + id, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

function getPrivateDocument(token, id, visitorID) {
  if (id) {
    return axiosClient.get(retrieveSinglePrivateDocument + id, {
      headers: {
        Finger: visitorID,
        Authorization: `Bearer ${token}`,
        responseType: "arrayBuffer",
      },
    });
  }
}

function getDocumentByName(token, data, visitorID) {
  if (data) {
    return axiosClient.get(getDMSByName + data, {
      headers: {
        Finger: visitorID,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

function getDocumentIDByName(token, data, visitorID) {
  if (data) {
    return axiosClient.get(getDMSIDByName + data, {
      headers: {
        Finger: visitorID,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
//  Country Flags API //

function getCountryFlags(token, visitorID) {
  return axiosClient.get(getFlagDMS, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

function getUserCountryInfo(token, id, visitorID) {
  return axiosClient.get(retreiveUserCountry + id, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
      responseType: "arrayBuffer",
    },
  });
}
//  Country Flags API //

function getMemories(token, visitorID) {
  return axiosClient.get(retrieveMemoryImages, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get AnnotationDetail Detail Api //

function getAnnotationDetail(data, userToken, visitorID) {
  return axiosClient.put(getAnnotations, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// Add Create Annotation Headline Detail Api //

function addAnnotations(data, userToken, visitorID) {
  return axiosClient.post(createAnnotations, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//Update Annotation Detail Api

function updateAnnotations(data, userToken, visitorID) {
  return axiosClient.put(editAnnotations, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}
// Reposition Annotation  Detail Api //

function repositionAnnotation(data, userToken, visitorID) {
  return axiosClient.put(repositionAnnotationCall+`${data.annotationKey}/${data.position}`, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// Delete Annotation Item Detail Api
function deleteAnnotationItem(annotationId, userToken, visitorID) {
  return axiosClient.delete( removeAnnotationItem+annotationId, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// Update MemoryImage Detail Api //

function updateMemoryImageDetail(data, userToken, visitorID) {
  return axiosClient.put(updateImageDetail, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}
//  Retreive meta group  API //
function retrieveAllMetaGroupAPI(token, visitorID) {
  return axiosClient.get(getAllMetaGroup, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  get Activities  API //
function retrieveAllActivities(token, visitorID) {
  return axiosClient.get(getAllActivities, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Single Activity  API //
function readSingleActivityAPI(token, documentID, visitorID) {
  return axiosClient.get(readSingleActivity + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Get Single Member API //
function readSingleUserAPI(token, data, visitorID) {
  return axiosClient.get(getSingleUser + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Single meta group  API //
function retrieveSingleMetaGroupAPI(token, data, visitorID) {
  return axiosClient.get(getSingleMetaGroup + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  get Postcards  API //
function retrieveAllPostcards(token, visitorID) {
  return axiosClient.get(getAllPostcards, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Postcard  API //
function createPostcardAPI(token, data, visitorID) {
  return axiosClient.post(createPostcard, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Postcard  API //
function updatePostcardAPI(data, userToken, visitorID) {
  return axiosClient.put(updatePostcard, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Delete or Hide Postcard API //
function deletePostCardAPI(token, entKey, variant, visitorID) {
  return axiosClient.delete(deletePostcard + entKey, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Add Postcard member API //
function addPostCardMemberAPI(data, userToken, visitorID) {
  return axiosClient.post(addPostcardMember, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Read Single Postcard  //
function readSinglePostCardAPI(userToken, data, visitorID) {
  return axiosClient.get(readSinglePostCard + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Delete Postcard Member API //
function deletePostcardMemberAPI(data, userToken, visitorID) {
  return axiosClient.post(deletePostcardMember, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Joining Group Request //
function groupJoiningRequestAPI(token, data, visitorID) {
  return axiosClient.post(joiningGroupRequest, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

function checkAccount(data, visitorID) {
  return axiosClient.post(checkEmail, data, visitorID, {
    headers: {
      Finger: visitorID,
    },
  });
}

function userSignUp(data, visitorID) {
  return axiosClient.post(signUp, data, visitorID, {
    headers: {
      Finger: visitorID,
    },
  });
}

function userLogIn(data, visitorID) {
  return axiosClient.post(logIn, data, visitorID, {
    headers: {
      Finger: visitorID,
    },
  });
}

function validateID(id, visitorID) {
  return axiosClient.post(validateRegistrationID, id, visitorID, {
    headers: {
      Finger: visitorID,
    },
  });
}

function addBase64File(token, data, visitorID) {
  return axiosClient.post(createBase64DMS, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Country Code  API //

function updateCountryIso(token, data, visitorID) {
  return axiosClient.put(setCountryCode + data, null, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}
//  Profile avatar   API //

function addBase64ProfileAvatar(token, data, visitorID) {
  return axiosClient.post(updateBase64Avatar, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Meta Group  API //
function createMetaGroupAPI(token, data, visitorID) {
  return axiosClient.post(createMetaGroup, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Meta Group  API //
function addMetaGroupItemAPI(token, data, visitorID) {
  return axiosClient.post(addMetaGroupItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Activities  API //
function createActivitiesAPI(token, data, visitorID) {
  return axiosClient.post(createActivities, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Activities  API //
function updateActivitiesAPI(data, userToken, visitorID) {
  return axiosClient.put(updateActivities, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  update User Profile Configurations  API //
function userUpdateProfileConfigurations(data, userToken, visitorID) {
  return axiosClient.put(updateProfileConfigurations, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

function userUpdateDestPrefs(data, userToken, visitorID) {
  return axiosClient.put(updateDestPrefs, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}
function userUpdateActivityPrefs(data, userToken, visitorID) {
  return axiosClient.put(updateActivityPrefs, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

function userUpdatePersonalProfile(data, userToken, visitorID) {
  return axiosClient.put(updatePersonalProfile, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

function userUpdatePersonalLocation(data, userToken, visitorID) {
  return axiosClient.put(updatePersonalLocation, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

function userUpdatePassword(data, userToken, visitorID) {
  return axiosClient.put(updatePassword, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// Update Meta Group API
function updateMetaGroupAPI(data, userToken, visitorID) {
  return axiosClient.put(updateMetaGroupItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//Create createBinaryFromURL Api
function createBinaryFromURL(token, data, visitorID) {
  return axiosClient.post(createBinary,data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

function deleteDMSDocument(token, documentID, visitorID) {
  return axiosClient.delete(deleteDocument + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

// delete Activities API
function deleteActivitiesAPI(token, documentID, varint, visitorID) {
  return axiosClient.delete(deleteActivities + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

// delete Meta Group API
function deleteMetaGroupAPI(token, documentID, variant, visitorID) {
  return axiosClient.delete(deleteMetaGroup + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}
// delete Meta Group Item API
function deleteMetaGroupItemAPI(token, documentID, visitorID) {
  return axiosClient.delete(deleteMetaGroupItem + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  get Notes  API //
function retrieveAllNotes(token, visitorID) {
  return axiosClient.get(getAllNotes, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Postcard  API //
function createNotesAPI(token, data, visitorID) {
  return axiosClient.post(createNotes, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Postcard  API //
function updateNotesAPI(data, userToken, visitorID) {
  return axiosClient.put(updateNotes, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// delete Notes API
function deleteNotesAPI(token, documentID, variant, visitorID) {
  return axiosClient.delete(deleteNotes + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive all members API //
function retrieveAllMembersAPI(token, visitorID) {
  return axiosClient.get(getAllMembers, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  My Member Connections API //
function myMembersAPI(token, visitorID) {
  return axiosClient.get(myMemberConnections, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//   Visible members API //
function visibleMembersAPI(token, visitorID) {
  return axiosClient.get(visibleMembers, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive all Trip API //
function retrieveAllTripAPI(token, visitorID) {
  return axiosClient.get(getAllTrip, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Get Track Value API //
function retrieveTrackValueAPI(token, data, visitorID) {
  return axiosClient.get(getTripValue + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Location Details API //
function retrieveLocationDataAPI(token, data, visitorID) {
  return axiosClient.get(retrieveLocationDetails + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Destination  API //
function createDestinationAPI(token, data, visitorID) {
  return axiosClient.post(createDestination, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Destination  API //
function updateDestinationAPI(data, userToken, visitorID) {
  return axiosClient.put(updateDestination, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// delete  Todo Group API
function deleteDestinationAPI(token, documentID, code, visitorID) {
  return axiosClient.delete(deleteDestination + documentID + "/" + code, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive all Destinations API //
function retrieveAllDestinationsAPI(token, visitorID) {
  return axiosClient.get(retrieveDestination, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Specific Destinations API //
function retrieveSingleDestinationAPI(token, key, visitorID) {
  return axiosClient.get(retrieveSingleDestination + key, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Add Destination Items API //
function addDestinationItemAPI(data, userToken, visitorID) {
  return axiosClient.post(addDestinationItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// delete Destination Items API
function deleteDestinationItemAPI(token, documentID, visitorID) {
  return axiosClient.delete(deleteDestinationItem + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive all Stories API //
function retrieveAllStoriesAPI(token, visitorID) {
  return axiosClient.get(retrieveStories, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  get Calendar Event  API //

function retrieveEventAPI(data, token, visitorID) {
  return axiosClient.post(retrieveEvent, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Calendar Event  API //
function createEventAPI(token, data, visitorID) {
  return axiosClient.post(createEvent, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Calendar Event  API //
function updateEventAPI(data, userToken, visitorID) {
  return axiosClient.put(updateEvent, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// delete Calendar Event API
function deleteEventAPI(token, documentID, variant, visitorID) {
  return axiosClient.delete(deleteEvent + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  add Calendar Event Item  API //

function addEventItemAPI(data, token, visitorID) {
  return axiosClient.post(eventAddItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Calendar Time  API //
function updateEventTimeAPI(data, userToken, visitorID) {
  return axiosClient.put(eventUpdateTime, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Retreive Specific Event API //
function retrieveSingleEventAPI(token, key, visitorID) {
  return axiosClient.get(retrieveSingleEvent + key, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Delete Event Member API //
function deleteEventItemAPI(token, entKey, ugmKey, visitorID) {
  return axiosClient.delete(
    deleteEventItem + entKey + "/" + ugmKey,

    {
      headers: {
        Finger: visitorID,
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

//  Create Journey  API //
function createJourneyAPI(token, data, visitorID) {
  return axiosClient.post(createJourney, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Journey  API //
function updateJourneyAPI(data, userToken, visitorID) {
  return axiosClient.put(updateJourney, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Retreive all Journey API //
function retrieveAllJourneiesAPI(token, visitorID) {
  return axiosClient.get(retrieveJourney, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Specific Journey API //
function retrieveSingleJourneyAPI(token, key, visitorID) {
  return axiosClient.get(retrieveSingleJourney + key, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Add Journey Items API //
function addJourneyItemAPI(data, userToken, visitorID) {
  return axiosClient.post(addJourneyItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// delete Journey Items API
function deleteJourneyItemAPI(token, documentID, visitorID) {
  return axiosClient.delete(deleteJourneyItem + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Add WayPoint Items API //
function addWayPointItemAPI(data, userToken, visitorID) {
  return axiosClient.post(addWayPoint, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Delete WayPoint Items API //
function deleteWayPointItemAPI(userToken, data, visitorID) {
  // console.log("delete waypoint", data);
  return axiosClient.delete(deleteWayPoint + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

//  Delete or Hide Journey API //
function deleteOrHideJourneyAPI(token, entKey, code, visitorID) {
  return axiosClient.delete(hideOrDeleteJourney + entKey + "/" + code, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Routing for Maps API //
function routingForMapsAPI(token, data, visitorID) {
  return axiosClient.post(routingForMaps, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Emergencies Maps API //
function retrieveEmergenciesMapAPI(token, data, visitorID) {
  return axiosClient.post(retrieveEmergenciesMap, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Amenities Maps API //
function retrieveAmenitiesMapAPI(token, data, visitorID) {
  return axiosClient.post(retrieveAmenitiesMap, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Amenities Classes API //
function retrieveAmenitiesClassesAPI(token, data, visitorID) {
  return axiosClient.get(retrieveAmenitiesClasses + data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/json'
    },
    data: { name: "end" },
  });
}

//  Create Todo Group  API //
function createTodoGroupAPI(token, data, visitorID) {
  return axiosClient.post(createTodoGroup, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Todo Group  API //
function updateTodoGroupAPI(data, userToken, visitorID) {
  return axiosClient.put(updateTodoGroup, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// // delete  Todo Group API
function deleteTodoGroupAPI(token, documentID, code, visitorID) {
  return axiosClient.delete(deleteTodoGroup + documentID + "/" + code, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Retreive Todo groups API //
function retrieveAlTodosAPI(token, visitorID) {
  // console.log("token in AuthAPI", token);
  return axiosClient.get(retrieveAllTodoGroups, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  Create Todo Item  API //
function createTodoItemAPI(token, data, visitorID) {
  return axiosClient.post(createTodoItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  update Todo Item  API //
function updateTodoItemAPI(data, userToken, visitorID) {
  // console.log("token in AuthAPI", userToken, data);
  return axiosClient.put(updateTodoItem, data, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${userToken}`,
    },
  });
}

// // delete  Todo Item API
function deleteTodoItemAPI(token, documentID, visitorID) {
  return axiosClient.delete(deleteTodoItem + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

//  read Todo Item API //
function readTodoItemAPI(documentID, token, visitorID) {
  // console.log("token in AuthAPI", token);
  return axiosClient.get(readTodoItem + documentID, {
    headers: {
      Finger: visitorID,
      Authorization: `Bearer ${token}`,
    },
  });
}

export {
  getProduct,
  getProfileValue,
  getAvatarById,
  getPrivateDocument,
  getDocumentByName,
  getDocumentIDByName,
  getCountryFlags,
  getUserCountryInfo,
  getMemories,
  retrieveAllMetaGroupAPI,
  retrieveAllActivities,
  readSingleActivityAPI,
  readSingleUserAPI,
  retrieveSingleMetaGroupAPI,
  retrieveAllPostcards,
  createPostcardAPI,
  updatePostcardAPI,
  deletePostCardAPI,
  addPostCardMemberAPI,
  readSinglePostCardAPI,
  deletePostcardMemberAPI,
  groupJoiningRequestAPI,
  checkAccount,
  userSignUp,
  userLogIn,
  validateID,
  addBase64File,
  updateCountryIso,
  addBase64ProfileAvatar,
  createMetaGroupAPI,
  addMetaGroupItemAPI,
  createActivitiesAPI,
  updateActivitiesAPI,
  userUpdateProfileConfigurations,
  userUpdateDestPrefs,
  userUpdateActivityPrefs,
  userUpdatePersonalProfile,
  userUpdatePersonalLocation,
  userUpdatePassword,
  updateMetaGroupAPI,createBinaryFromURL,
  deleteDMSDocument,
  deleteActivitiesAPI,
  deleteMetaGroupAPI,
  deleteMetaGroupItemAPI,
  retrieveAllNotes,
  createNotesAPI,
  updateNotesAPI,
  deleteNotesAPI,
  retrieveAllMembersAPI,
  myMembersAPI,
  visibleMembersAPI,
  retrieveAllTripAPI,
  retrieveTrackValueAPI,
  retrieveLocationDataAPI,
  createDestinationAPI,
  updateDestinationAPI,
  deleteDestinationAPI,
  retrieveAllDestinationsAPI,
  retrieveSingleDestinationAPI,
  addDestinationItemAPI,
  deleteDestinationItemAPI,
  retrieveAllStoriesAPI,
  updateMemoryImageDetail,
  getAnnotationDetail,
  addAnnotations,updateAnnotations,
  repositionAnnotation,
  deleteAnnotationItem,
  retrieveEventAPI,
  createEventAPI,
  updateEventAPI,
  deleteEventAPI,
  addEventItemAPI,
  updateEventTimeAPI,
  retrieveSingleEventAPI,
  deleteEventItemAPI,
  createJourneyAPI,
  updateJourneyAPI,
  retrieveAllJourneiesAPI,
  retrieveSingleJourneyAPI,
  addJourneyItemAPI,
  deleteJourneyItemAPI,
  addWayPointItemAPI,
  deleteWayPointItemAPI,
  deleteOrHideJourneyAPI,
  routingForMapsAPI,
  retrieveEmergenciesMapAPI,
  retrieveAmenitiesMapAPI,
  retrieveAmenitiesClassesAPI,
  createTodoGroupAPI,
  updateTodoGroupAPI,
  deleteTodoGroupAPI,
  retrieveAlTodosAPI,
  createTodoItemAPI,
  updateTodoItemAPI,
  deleteTodoItemAPI,
  readTodoItemAPI,
};
