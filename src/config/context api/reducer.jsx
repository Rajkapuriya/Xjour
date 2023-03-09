
export const initialState = {
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.reducerUser,
      };
    case "SET_USER_TOKEN":
      return {
        ...state,
        userToken: action.reducerUserToken,
      };
    case "SET_MEMORY_IMAGES":
      return {
        ...state,
        memoryImages: action.memoryImages,
      };

    case "SET_USER_IMAGE":
      return {
        ...state,
        reducerUserImage: action.reducerUserImage,
      };

    case "SET_USER_DATA":
      return {
        ...state,
        reducerUserDATA: action.reducerUserDATA,
      };
    case "SET_USER_ACTIVITY":
      return {
        ...state,
        reducerUserActivity: action.reducerUserActivity,
      };
    case "SET_USER_DESTINATION":
      return {
        ...state,
        reducerUserDestination: action.reducerUserDestination,
      };
    case "SET_GROUP_DATA":
      return {
        ...state,
        reducerGroup: action.reducerGroup,
      };

    case "SET_SELECTED_ACTIVITY":
      return {
        ...state,
        reducerSelectedActivity: action.reducerSelectedActivity,
      };

    case "SET_OTHER_GROUP":
      return {
        ...state,
        reducerOtherGroup: action.reducerOtherGroup,
      };

    case "SET_CONNECTION_PEOPLE":
      return {
        ...state,
        reducerConnectionPeople: action.reducerConnectionPeople,
      };
    case "SET_GROUP_PEOPLE":
      return {
        ...state,
        reducerGroupPeople: action.reducerGroupPeople,
      };

    case "SET_MY_CONNECTION_PEOPLE":
      return {
        ...state,
        reducerMyConnectionPeople: action.reducerMyConnectionPeople,
      };

    case "SET_MY_ACTIVITIES":
      return {
        ...state,
        reducerMyActivities: action.reducerMyActivities,
      };

    case "SET_MEMORY_IMAGE":
      return {
        ...state,
        reducerMemoryImages: action.reducerMemoryImages,
      };

    case "SET_POSTCARDS_DATA":
      return {
        ...state,
        postcardsData: action.postcardsData,
      };

    case "SET_SELECTED_POSTCARD":
      return {
        ...state,
        reducerSelectedPostcard: action.reducerSelectedPostcard,
      };

    case "SET_NOTES":
      return {
        ...state,
        reducerNotes: action.reducerNotes,
      };

    case "GET_ALL_NOTES":
      return {
        ...state,
        reducerAllNotes: action.reducerAllNotes,
      };

    case "SET_ALL_NOTES":
      return {
        ...state,
        reducerSetAllNotes: action.reducerSetAllNotes,
      };

    case "CALL-ALL-GROUPS":
      return {
        ...state,
        callGroups: action.callGroups,
        // reducerGroup: null,
      };

    case "SET_USER_AUTHORIZATION":
      return {
        ...state,
        authorized: action.authorized,
        // reducerGroup: null,
      };

    case "SET_REDUCER_EMPTY":
      return {
        state: null,
        reducer: false,
        // reducerGroup: null,
      };

    case "GET_ALL_MEMORIES_DESTINATION":
      return {
        ...state,
        reducerAllMemoriesDestination: action.reducerAllMemoriesDestination,
      };

    case "SELECTED_MEMORIES_DESTINATION":
      return {
        ...state,
        reducerSelectedMemoryDestination:
          action.reducerSelectedMemoryDestination,
      };

    case "SET_MEMORY_DOCUMENTS":
      return {
        ...state,
        reducerMemoryDocuments: action.reducerMemoryDocuments,
      };

    case "SET_SELECTED_DOCUMENT":
      return {
        ...state,
        reducerSelectedDocument: action.reducerSelectedDocument,
      };

    case "SET_MEMORY_VIDEOS":
      return {
        ...state,
        reducerMemoryVideos: action.reducerMemoryVideos,
      };

    case "SET_MY_DESTINATIONS":
      return {
        ...state,
        reducerMyDestinations: action.reducerMyDestinations,
      };

    case "SET_SELECTED_DESTINATION":
      return {
        ...state,
        reducerSelectedDestination: action.reducerSelectedDestination,
      };

    case "SET_STORIES":
      return {
        ...state,
        reducerStories: action.reducerStories,
      };

    case "SET_EVENT":
      return {
        ...state,
        reducerEvent: action.reducerEvent,
      };

    case "SET_USER_DEFAULT_PICTURES":
      return {
        ...state,
        reducerDefaultPictures: action.reducerDefaultPictures,
      };

    case "SET_JOURNIES":
      return {
        ...state,
        reducerJournies: action.reducerJournies,
      };

    case "CREATE_JOURNY":
      return {
        ...state,
        reducerCreateJourny: action.reducerCreateJourny,
      };

    case "SET_SELECTED_JOURNEY":
      return {
        ...state,
        reducerSelectedJourney: action.reducerSelectedJourney,
      };

    case "SET_USER_VISITORID":
      return {
        ...state,
        reducerVisitorID: action.reducerVisitorID,
      };

    case "SET_USER_LOCATION":
      return {
        ...state,
        reducerLatitude: action.latitude,
        reducerLongitude: action.longitude,
      };

    case "SET_EMERGENCY_DATA":
      return {
        ...state,
        reducerEmergencyData: action.reducerEmergencyData,
      };

    case "SET_SIGN_OUT":
      return {
        state: null,
        postcardsData: null,
        reducerGroup: [],
        user: null,
        userToken: null,
        memoryImages: null,
        reducerUserImage: null,
        reducerUserDATA: null,
        reducerSelectedActivity: null,
        reducerOtherGroup: null,
        reducerConnectionPeople: null,
        reducerMemoryImages: [],

        signOut: action.signOut,
      };
    // alert("You are successfully Logout");
    // useHistory.push("/authentication/sign");

    default:
      return state;
  }
};

export default reducer;
