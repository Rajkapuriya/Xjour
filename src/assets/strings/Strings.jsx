import logo from "../../assets/images/logo.png";

// export const baseURL = "https://app.xjour.com";
export const baseURL = "https://xjour-dev.malta1896.startdedicated.de";
//export const baseURL = "http://localhost";
//export const baseURL = "http://192.168.1.186";

export const mapServer = "https://gis.xjour.com/osm/{z}/{x}/{y}.png";
export const checkEmail = "/api/xjour-app/rest/users/checkaccount";
export const signUp = "/api/xjour-app/rest/users/register";
export const logIn = "/api/xjour-app/rest/users/login";
export const profileReadExtension = "/api/xjour-app/rest/users/profile/read";
export const updatePersonalProfile =
  "/api/xjour-app/rest/users/profile/updatePersonal";
export const updatePersonalLocation =
  "/api/xjour-app/rest/users/profile/updateLocation";
export const updatePassword =
  "/api/xjour-app/rest/users/profile/updatePassword";
export const getPublicDMSById = "/api/xjour-app/rest/dms/getPublicDocument/";
export const retrieveMemoryImages = "/api/xjour-app/rest/dms/retrieve";
export const updateImageDetail="/api/xjour-app/rest/dms/update"
export const getAnnotations="/api/xjour-app/rest/annotations/read"
export const createAnnotations="/api/xjour-app/rest/annotations/create"
export const editAnnotations="/api/xjour-app/rest/annotations/update"
export const repositionAnnotationCall="api/xjour-app/rest/annotations/reposition/"
export const removeAnnotationItem="api/xjour-app/rest/annotations/delete/"
export const retrieveSinglePrivateDocument =
  "/api/xjour-app/rest/dms/getDocumentBase64/";
export const createBase64DMS = "/api/xjour-app/rest/dms/createBase64";
export const createBinary="api/xjour-app/rest/dmsImageProxy/create";
export const updateBase64Avatar =
  "/api/xjour-app/rest/users/profile/updateAvatarBase64";
export const deleteDocument = "/api/xjour-app/rest/dms/delete/";
export const getDMSByName =
  "/api/xjour-app/rest/dms/getPublicDocumentByNameB64/";

export const getDMSIDByName =
  "/api/xjour-app/rest/dms/getPublicDocumentIDByName/";

export const getFlagDMS = "/api/xjour-app/rest/geo/countries/retrieve";
export const retreiveUserCountry = "/api/xjour-app/rest/dms/getDocument";

export const setCountryCode =
  "/api/xjour-app/rest/users/profile/updateCountryCode/";

export const updateDestPrefs =
  "/api/xjour-app/rest/users/profile/updateDestPrefs";
export const updateActivityPrefs =
  "/api/xjour-app/rest/users/profile/updateActivityPrefs";
export const validateRegistrationID = "/api/xjour-app/rest/users/validateid";

// Update User Profile Configuration API's
export const updateProfileConfigurations =
  "/api/xjour-app/rest/users/profile/updateConfigurations";

// Group API's
export const createMetaGroup = "/api/xjour-app/rest/metaGroups/create";
export const getAllMetaGroup = "/api/xjour-app/rest/metaGroups/retrieve";
export const addMetaGroupItem = "/api/xjour-app/rest/metaGroups/addItem";
export const getSingleMetaGroup = "/api/xjour-app/rest/metaGroups/read/";
export const deleteMetaGroup = "/api/xjour-app/rest/metaGroups/delete/";
export const deleteMetaGroupItem = "/api/xjour-app/rest/metaGroups/deleteItem/";
export const updateMetaGroupItem = "/api/xjour-app/rest/metaGroups/update";

// For getting single user
export const getSingleUser = "/api/xjour-app/rest/users/profile/read/";

// Activity API's
export const createActivities = "/api/xjour-app/rest/activities/create";
export const getAllActivities = "/api/xjour-app/rest/activities/retrieve";
export const deleteActivities = "/api/xjour-app/rest/activities/delete/";
export const updateActivities = "/api/xjour-app/rest/activities/update";
export const readSingleActivity = "/api/xjour-app/rest/activities/read/";

// Member management API's
export const getAllMembers = "/api/xjour-app/rest/memberManagement/retrieve";
export const myMemberConnections =
  "/api/xjour-app/rest/memberManagement/myMemberConnections";
export const visibleMembers =
  "/api/xjour-app/rest/memberManagement/visibleMembers";
export const joiningGroupRequest =
  "/api/xjour-app/rest/memberManagement/request";

// Postcards API's
export const getAllPostcards = "/api/xjour-app/rest/postcards/retrieve";
export const createPostcard = "/api/xjour-app/rest/postcards/create";
export const updatePostcard = "/api/xjour-app/rest/postcards/update";
export const deletePostcard = "/api/xjour-app/rest/postcards/delete/";
export const readSinglePostCard = "/api/xjour-app/rest/postcards/read/";
export const addPostcardMember = "/api/xjour-app/rest/postcards/addMember";
export const deletePostcardMember =
  "/api/xjour-app/rest/postcards/deleteMember";

// Notes API's
export const getAllNotes = "/api/xjour-app/rest/notes/retrieve";
export const createNotes = "/api/xjour-app/rest/notes/create";
export const updateNotes = "/api/xjour-app/rest/notes/update";
export const deleteNotes = "/api/xjour-app/rest/notes/delete/";
// export const readSingleNote = "/api/xjour-app/rest/activities/read/";

// Notes API's
export const getAllTrip = "/api/xjour-app/rest/tracme/trips/getTripList";
export const getTripValue = "/api/xjour-app/rest/tracme/tracs/getTrac/";

// Location API's
export const retrieveLocationDetails = "/api/xjour-app/rest/maps/retrieve/";

// Destination API's
export const createDestination = "/api/xjour-app/rest/destinations/create";
export const retrieveDestination = "/api/xjour-app/rest/destinations/retrieve";
export const deleteDestination = "/api/xjour-app/rest/destinations/delete/";
export const addDestinationItem = "/api/xjour-app/rest/destinations/addItem";
export const deleteDestinationItem =
  "/api/xjour-app/rest/destinations/deleteItem/";
export const updateDestination = "/api/xjour-app/rest/destinations/update";
export const retrieveSingleDestination =
  "/api/xjour-app/rest/destinations/read/";

// Stories API's
export const retrieveStories = "/api/xjour-app/rest/stories/retrievePublic";

// Calendar API's
export const createEvent = "/api/xjour-app/rest/calendar/create";
export const retrieveEvent = "/api/xjour-app/rest/calendar/retrieve";
export const updateEvent = "/api/xjour-app/rest/calendar/update";
export const deleteEvent = "/api/xjour-app/rest/calendar/delete/";
export const eventAddItem = "/api/xjour-app/rest/calendar/addMember";
export const eventUpdateTime = "/api/xjour-app/rest/calendar/updateTime";
export const retrieveSingleEvent = "/api/xjour-app/rest/calendar/read/";
export const deleteEventItem = "/api/xjour-app/rest/calendar/deleteMember/";

// Journey API's
export const createJourney = "/api/xjour-app/rest/journeys/create";
export const retrieveJourney = "/api/xjour-app/rest/journeys/retrieve";
export const addJourneyItem = "/api/xjour-app/rest/journeys/addItem";
export const deleteJourneyItem = "/api/xjour-app/rest/journeys/deleteItem/";
export const updateJourney = "/api/xjour-app/rest/journeys/update";
export const retrieveSingleJourney = "/api/xjour-app/rest/journeys/read/";
export const addWayPoint = "/api/xjour-app/rest/journeys/addWaypoint";
export const deleteWayPoint = "/api/xjour-app/rest/journeys/deleteWaypoint/";
export const hideOrDeleteJourney = "/api/xjour-app/rest/journeys/delete/";

// Routing for Maps
// export const routingForMaps = "/api/xjour-app/rest/routes/route";
export const routingForMaps = "/api/xjour-app/rest/routes/routedebug";

// Emergency Map API
export const retrieveEmergenciesMap =
  "/api/xjour-app/rest/emergencies/retrieve";

// Amenities Map API
export const retrieveAmenitiesMap =
  "/api/xjour-app/rest/amenities/retrieveEnvelope";

// Amenities Map API
export const retrieveAmenitiesClasses =
  "/api/xjour-app/rest/amenities/classes/";

// Todo Groups API
export const createTodoGroup = "/api/xjour-app/rest/todoGroups/create";
export const retrieveAllTodoGroups = "/api/xjour-app/rest/todoGroups/current";
export const updateTodoGroup = "/api/xjour-app/rest/todoGroups/update/";
export const deleteTodoGroup = "/api/xjour-app/rest/todoGroups/delete/";

// Todo Groups API
export const createTodoItem = "/api/xjour-app/rest/todoGroupItems/create";
export const readTodoItem = "/api/xjour-app/rest/todoGroupItems/read/";
export const updateTodoItem = "/api/xjour-app/rest/todoGroupItems/update/";
export const deleteTodoItem = "/api/xjour-app/rest/todoGroupItems/delete/";

export const brandLogo = logo;
export const passPrompt =
  "Password needs atleast 8 characters, 1 number, 1 symbol, 1upeercase and 1 lowercase";
export const preferDestination = "What kind of destinations do you prefer?";
export const preferActivity = "What type of activities do you prefer?";
export const greetings = "Welcome to X-Jour!";
export const checkYourEmail = "Check your e-mail!";
export const confirmationMail = "We have sent you a confirmation mail.";
export const checkInbox =
  "Check your inbox and click the link in your email to confirm your e-mail address and log into X-Jour!.";

export const defaultPicture = [
  "male",
  "metagroup",
  "note",
  "destination",
  "female",
  "calendar",
  "postcard",
];

export const amenitiesClasses = [
  { name: "e", label: "Emergencies" },
  { name: "a", label: "Airports" },
  { name: "b", label: "Bank" },
  { name: "r", label: "Restaurants" },
  { name: "t", label: "transportation" },
  { name: "h", label: "hotel" },
  { name: "f", label: "fun" },
  { name: "m", label: "monuments" },
  { name: "s", label: "shop" },
  { name: "p", label: "profession" },
  { name: "u", label: "unclassified" },
  { name: "v", label: "vocation" },
  { name: "o", label: "outdoors" },
];
export const defaultRadius = 10;

export const defaultLatitude = 51.1657;
export const defaultLongitude = 10.4515;

//   /rest/users/validateid
// {"registrationID": "ABCXY"}
