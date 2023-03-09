import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { usePosition } from "use-position";
import { Oval } from "react-loader-spinner";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import "./App.css";

import {
  groupTypeKey_metaGroups,
  UNAUTH_KEY,
} from "./assets/constants/Contants";
import { defaultPicture } from "./assets/strings/Strings";

import { useStateValue } from "./config/context api/StateProvider";
import {
  getAvatarById,
  getDocumentByName,
  getMemories,
  getPrivateDocument,
  getProfileValue,
  retrieveAllMembersAPI,
  retrieveAllMetaGroupAPI,
  retrieveAllNotes,
  retrieveAllPostcards,
  visibleMembersAPI,
  myMembersAPI,
  retrieveAllActivities,
  retrieveAllStoriesAPI,
  retrieveAllTripAPI,
  retrieveEventAPI,
  getDocumentIDByName,
  retrieveAllJourneiesAPI,
} from "./config/authentication/AuthenticationApi";

import Home from "./pages/home/Home";

import AuthScreen from "./components/auth/AuthScreen";
import AppMainScreen from "./components/AppMainScreen/AppMainScreen";
import Test from "./components/Test/Test";

function App() {
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const [loading, isLoading] = useState(true);

  const [avatarHTML, setAvatarHTML] = useState("");
  const [groupArrayData, setGroupArrayData] = useState([]);
  const [activitiesArrayData, setActivitiesArrayData] = useState([]);
  const [postcardArrayData, setPostcardArrayData] = useState([]);
  const [profileArrayData, setProfileArrayData] = useState([]);

  const [otherGroupsArray, setOtherGroupsArray] = useState([]);
  const [destinationsArray, setDestinationsArray] = useState([]);
  const [storiesArray, setStoriesArray] = useState([]);
  const [destinationArray, setDestinationArray] = useState([]);
  const [eventArray, setEventArray] = useState([]);
  const [journiesArray, setJourniesArray] = useState([]);

  const [myConnectionsArray, setMyConnectionsArray] = useState([]);
  const [notes, setNotes] = useState([]);
  const [otherConnectionsArray, setOtherConnectionsArray] = useState([]);
  const [memoryImagesTwo, setMemoryImagesTwo] = useState([]);
  const [memoryVideos, setMemoryVideos] = useState([]);
  const [memoryDocuments, setMemoryDocuments] = useState([]);

  const [defaultPictures, setDefaultPictures] = useState([]);
  const watch = true;
  const { latitude, longitude } = usePosition(watch, {
    enableHighAccuracy: true,
  });

  const [userBio, setUserBio] = useState({
    firstName: "Peter ",
    lastName: "Krduer",
  });

  const [destinations, setDestinations] = useState([
    { value: "Coastal", status: false },
    {
      value: "Urban",
      status: false,
    },
    {
      value: "Remote",
      status: false,
    },
    {
      value: "Rural",
      status: false,
    },
    {
      value: "Historical",
      status: false,
    },
    {
      value: "Developing",
      status: false,
    },
    {
      value: "Political",
      status: false,
    },
    {
      value: "Cultural",
      status: false,
    },
  ]);

  const [activities, setActivities] = useState([
    {
      value: "Water-based",
      status: true,
    },
    {
      value: "Outdoor",
      status: false,
    },
    {
      value: "Art",
      status: true,
    },
    {
      value: "Music",
      status: false,
    },
    {
      value: "Technology",
      status: true,
    },
    {
      value: "Social",
      status: false,
    },
    {
      value: "Adventure",
      status: true,
    },
    {
      value: "Gaming",
      status: false,
    },
  ]);

  useEffect(() => {
    async function getToken() {
      var user_token = localStorage.getItem("user-info-token");
      if (user_token) {
        console.log("Token is not Null", user_token);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: user_token,
        });
        if (user_token !== null && user_token !== 0) {
          console.log("Token is not 0", user_token);
          const fpPromise = FingerprintJS.load();

          // Get the visitor identifier when you need it.
          const fp = await fpPromise;
          const result = await fp.get();
          console.log("visitorIdd", result.visitorId);
          localStorage.setItem("visitorID", JSON.stringify(result));

          dispatch({
            type: "SET_USER_VISITORID",
            reducerVisitorID: result,
          });
        }
      } else {
        console.log("Token is Null");
        localStorage.setItem("visitorID", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
      isLoading(false);
    }
    getToken();
  }, []);

  useEffect(() => {
    // console.log("Document Name Array", defaultPictures);
  }, [defaultPictures]);

  useEffect(() => {
    // console.log("Profile SVG", profileArrayData);
  }, [profileArrayData]);

  const callGetDocumentByNameAPI = (name, index) => {
    getDocumentByName(userToken, name, reducerVisitorID).then(function (val) {
      if (val) {
        let defaultPictureItem = defaultPictures;
        let item = { ...defaultPictureItem[index] };

        item.base64Value = `data:image/png;base64,${val.data}`;
        defaultPictureItem[index] = item;

        setDefaultPictures(defaultPictureItem);

        if (index === defaultPicture.length - 1) {
          dispatch({
            type: "SET_USER_DEFAULT_PICTURES",
            reducerDefaultPictures: defaultPictures,
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
      // console.log("Document Name Base64:", val.data);
    });
  };

  const callGetDocumentIDByNameAPI = (name, index) => {
    getDocumentIDByName(userToken, name, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Document Name ID:", val.data);

        let defaultPictureItem = defaultPictures;
        let item = { ...defaultPictureItem[index] };

        item.documentID = val.data.documentID;
        defaultPictureItem[index] = item;

        setDefaultPictures(defaultPictureItem);
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const initDefaultPictures = () => {
    for (var i = 0; i < defaultPicture.length; i++) {
      // console.log("Document Name:", defaultPicture[i]);

      const obj = {
        name: defaultPicture[i],
        documentID: "",
        base64Value: "",
      };

      defaultPictures.push(obj);

      callGetDocumentByNameAPI(defaultPicture[i], i);
      callGetDocumentIDByNameAPI(defaultPicture[i], i);
    }
  };

  const initProfileValue = () => {
    // console.log("initProfileValue is called");

    getProfileValue(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("Get profile  respose >", val.data);

        if (val.data) {
          var info = val.data;

          const profileArrayVal = {
            firstName: info.firstName,
            lastName: info.lastName,
            loginName: info.loginName,
            nickName: info.nickName,
            activity: info.activity,
            avatar_dms_key: info.avatar_dms_key,
            birthday: info.birthday,
            eMail: info.eMail,
            searchable: info.searchable,
            configurations: info.configurations,
            countryCode: info.countryCode,
            countrySvg: "",
            destinations: info.destinations,
            pk: info.pk,
          };
          profileArrayData.push(profileArrayVal);
          // setProfileArrayData(profileArrayVal);

          dispatch({
            type: "SET_USER_DATA",
            reducerUserDATA: profileArrayData[0],
          });

          getUserImage(val.data.avatar_dms_key);
          getFlagURL(info?.countryCode, 0, 99);
        } else if (val.status === UNAUTH_KEY) {
          console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
    });
  };

  const getFlagURL = (data, index, state) => {
    // console.log('Flagid',id);
    if (data !== null) {
      getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
        // console.log("flagURL Info", val.data);
        if (val) {
          if (val.data !== null) {
            var mimeType = "image/svg+xml";
            let svgValue = `data:${mimeType};base64,${val.data}`;

            if (state === 1) {
              let groupItems = groupArrayData;
              let item = { ...groupItems[index] };

              item.countrySvg = svgValue;
              groupItems[index] = item;

              setGroupArrayData(groupItems);
              dispatch({
                type: "SET_GROUP_DATA",
                reducerGroup: groupArrayData,
              });

              // console.log("init Values", reducerGroup);

              // console.log("Base 64 vaslue: ", groupArrayData);
            } else if (state === 2) {
              let groupItems = otherGroupsArray;
              let item = { ...groupItems[index] };

              item.countrySvg = svgValue;
              groupItems[index] = item;

              setOtherGroupsArray(groupItems);
              dispatch({
                type: "SET_OTHER_GROUP",
                reducerOtherGroup: otherGroupsArray,
              });

              //console.log("Other Groups!: ", otherGroupsArray);
            } else if (state === 3) {
              let connectionItem = otherConnectionsArray;
              let item = { ...connectionItem[index] };

              item.countrySvg = svgValue;
              connectionItem[index] = item;

              setOtherConnectionsArray(connectionItem);
              dispatch({
                type: "SET_CONNECTION_PEOPLE",
                reducerConnectionPeople: otherConnectionsArray,
              });

              // console.log("Other Connections!: ", otherConnectionsArray);
            } else if (state === 4) {
              let connectionItem = myConnectionsArray;
              let item = { ...connectionItem[index] };

              item.countrySvg = svgValue;
              connectionItem[index] = item;

              setMyConnectionsArray(connectionItem);

              dispatch({
                type: "SET_MY_CONNECTION_PEOPLE",
                reducerMyConnectionPeople: myConnectionsArray,
              });

              // console.log("my Connections!: ", myConnectionsArray);
            } else if (state === 5) {
              let activityItem = activitiesArrayData;
              let item = { ...activityItem[index] };

              item.countrySvg = svgValue;
              activityItem[index] = item;

              setActivitiesArrayData(activityItem);

              dispatch({
                type: "SET_MY_ACTIVITIES",
                reducerMyActivities: activitiesArrayData,
              });
            } else if (state === 6) {
              let destinationItem = destinationsArray;
              let item = { ...destinationItem[index] };

              item.countrySvg = svgValue;
              destinationItem[index] = item;

              setDestinationsArray(destinationItem);

              dispatch({
                type: "SET_MY_DESTINATIONS",
                reducerMyDestinations: destinationsArray,
              });
            } else if (state === 7) {
              let storiesItem = storiesArray;
              let item = { ...storiesItem[index] };

              item.countrySvg = svgValue;

              storiesItem[index] = item;

              setStoriesArray(storiesItem);

              dispatch({
                type: "SET_STORIES",
                reducerStories: storiesArray,
              });
            } else if (state === 8) {
              let eventItem = eventArray;
              let item = { ...eventItem[index] };

              item.countrySvg = svgValue;
              eventItem[index] = item;
              item.countryCode = data;
              setEventArray(eventItem);

              dispatch({
                type: "SET_EVENT",
                reducerEvent: eventArray,
              });
            } else if (state === 9) {
              let journyItem = journiesArray;
              let item = { ...journyItem[index] };

              item.countrySvg = svgValue;
              journyItem[index] = item;
              item.countryCode = data;
              setJourniesArray(journyItem);

              dispatch({
                type: "SET_JOURNIES",
                reducerJournies: journiesArray,
              });
            } else if (state === 99) {
              let profileItem = profileArrayData;
              let item = { ...profileItem[index] };

              item.countrySvg = svgValue;
              profileItem[index] = item;

              setProfileArrayData(profileItem);

              dispatch({
                type: "SET_USER_DATA",
                reducerUserDATA: profileArrayData[0],
              });
            }
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
  };

  // const initEmergenciesMap = () => {
  //   const params = JSON.stringify({
  //     longitude: reducerLongitude,
  //     latitude: reducerLatitude,
  //     range: 4500,
  //   });
  //   console.log("Params", params);

  //   retrieveEmergenciesMapAPI(userToken, params, reducerVisitorID).then(
  //     function (val) {
  //       console.log("retrieving Emergencies Map API", val);
  //       if (val) {
  //         const valData = val.data;
  //         console.log("retrieving API valData", valData);

  //         for (var key in valData) {
  //           var i = Object.keys(valData).indexOf(key);

  //           // const emergencyVal = {
  //           //   address: valData[key].address,
  //           //   distance: valData[key].distance,
  //           //   extra: valData[key].extra,
  //           //   latitude: valData[key].latitude,
  //           //   longitude: valData[key].longitude,
  //           //   name: valData[key].name,
  //           //   type: valData[key].type,
  //           // };

  //           // emergencyArrayData.push(emergencyVal);

  //           const emergencyCoordVal = {
  //             latitude: valData[key].latitude,
  //             longitude: valData[key].longitude,
  //             type: valData[key].type,
  //           };
  //           emergencyCoordsArray.push(emergencyCoordVal);
  //         }

  //         dispatch({
  //           type: "SET_EMERGENCY_DATA",
  //           reducerEmergencyData: emergencyCoordsArray,
  //         });
  //       } else if (val.status == UNAUTH_KEY) {
  //         console.log("Setting to 0");
  //         localStorage.setItem("user-info-token", 0);
  //         dispatch({
  //           type: "SET_USER_TOKEN",
  //           reducerUserToken: 0,
  //         });
  //       }
  //     }
  //   );
  // };

  const getUserImage = (img) => {
    // console.log("this is Avatar Id", img);
    if (img === 245) {
      getAvatarById(userToken, img, reducerVisitorID).then(function (val) {
        // console.log("this is Puclic Avatar Data >", val.data);

        if (val.data !== null) {
          let svgValue = `data:image/svg+xml;utf8,${val.data}`;
          // setAvatarHTML(svgValue);
          // setAvatarHTML((locations) => [...locations, newVal]);

          dispatch({
            type: "SET_USER_IMAGE",
            reducerUserImage: svgValue,
          });
        } else if (val.status === UNAUTH_KEY) {
          console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        } else {
          // console.log("image is null");
        }
      });
    } else {
      getImageByDocumentId(img, -1, -1);
    }
  };

  const getImageByDocumentId = (id, index, status) => {
    // console.log("Calling image API for ID:", id);
    if (id !== null) {
      getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
        //console.log("this is Image val", val);

        if (val) {
          if (val.data) {
            const imageFile = val.data.dataBase64;
            const mimeType = val.data.mimeType;
            let srcValue = `data:${mimeType};base64,${imageFile}`;

            if (status === -1) {
              dispatch({
                type: "SET_USER_IMAGE",
                reducerUserImage: srcValue,
              });
            } else if (status === 2) {
              let groupItems = otherGroupsArray;
              let item = { ...groupItems[index] };

              item.base64 = srcValue;
              groupItems[index] = item;
              setOtherGroupsArray(groupItems);

              dispatch({
                type: "SET_OTHER_GROUP",
                reducerOtherGroup: otherGroupsArray,
              });
              //console.log("Other Groups! ", otherGroupsArray);
            } else if (status === 3) {
              let connectionItem = otherConnectionsArray;
              let item = { ...connectionItem[index] };

              item.base64 = srcValue;
              connectionItem[index] = item;
              setOtherConnectionsArray(connectionItem);
              dispatch({
                type: "SET_CONNECTION_PEOPLE",
                reducerConnectionPeople: otherConnectionsArray,
              });
              // console.log("Other Connections! ", otherConnectionsArray);
            } else if (status === 4) {
              let memoryItem = memoryImagesTwo;
              let item = { ...memoryItem[index] };

              item.image = srcValue;
              item.base64 = srcValue;
              item.isLoaded = true;
              item.date = val.data.timestampDocument;
              item.documentId = val.data.pk;
              memoryItem[index] = item;

              setMemoryImagesTwo(memoryItem.slice());

              // console.log("memoryImagesTwo", memoryImagesTwo);
              // console.log("memoryImagesTwoItem", item);

              dispatch({
                type: "SET_MEMORY_IMAGE",
                reducerMemoryImages: memoryImagesTwo,
              });
            } else if (status === 6) {
              let connectionItem = myConnectionsArray;
              let item = { ...connectionItem[index] };

              item.base64 = srcValue;
              connectionItem[index] = item;
              setMyConnectionsArray(connectionItem);

              dispatch({
                type: "SET_MY_CONNECTION_PEOPLE",
                reducerMyConnectionPeople: myConnectionsArray,
              });
              // console.log("Other Connections! ", myConnectionsArray);
            } else if (status === 7) {
              let activityItem = activitiesArrayData;
              let item = { ...activityItem[index] };

              item.base64 = srcValue;
              activityItem[index] = item;
              setActivitiesArrayData(activityItem);

              dispatch({
                type: "SET_MY_ACTIVITIES",
                reducerMyActivities: activitiesArrayData,
              });
              // console.log("Other Connections! ", myConnectionsArray);
            } else if (status === 8) {
              let destinationItem = destinationsArray;
              let item = { ...destinationItem[index] };

              item.base64 = srcValue;
              destinationItem[index] = item;
              setDestinationsArray(destinationItem);

              dispatch({
                type: "SET_MY_DESTINATIONS",
                reducerMyDestinations: destinationsArray,
              });
              // console.log("Other Connections! ", myConnectionsArray);
            } else if (status === 5) {
              let postCardItems = postcardArrayData;
              let item = { ...postCardItems[index] };

              item.base64 = srcValue;
              postCardItems[index] = item;
              setPostcardArrayData(postCardItems);
              // console.log("Postcard Array ", postcardArrayData);

              dispatch({
                type: "SET_POSTCARDS_DATA",
                postcardsData: postcardArrayData,
              });
            } else if (status === 9) {
              let notesItem = notes;
              // console.log("Custom note Array:", notes);
              let item = { ...notesItem[index] };
              item.base64 = srcValue;
              item.pictureDocumentID = id;
              // console.log("Custom note item:", item);

              notesItem[index] = item;

              setNotes(notesItem.slice());

              dispatch({
                type: "GET_ALL_NOTES",
                reducerAllNotes: notes,
              });

              // setNotes(notesItem.slice());
            } else if (status === 10) {
              let videoItem = memoryVideos;
              let item = { ...videoItem[index] };
              item.base64 = srcValue;
              item.isLoaded = true;
              item.date = val.data.timestampDocument;
              videoItem[index] = item;
              setMemoryVideos(videoItem.slice());

              dispatch({
                type: "SET_MEMORY_VIDEOS",
                reducerMemoryVideos: memoryVideos,
              });
            } else if (status === 11) {
              let documentItem = memoryDocuments;
              let item = { ...documentItem[index] };
              item.base64 = srcValue;
              item.isLoaded = true;
              item.date = val.data.timestampDocument;
              documentItem[index] = item;
              setMemoryDocuments(documentItem.slice());
              dispatch({
                type: "SET_MEMORY_DOCUMENTS",
                reducerMemoryDocuments: memoryDocuments,
              });
            } else if (status === 12) {
              let storiesItem = storiesArray;
              let item = { ...storiesItem[index] };
              item.base64 = srcValue;
              item.date = val.data.timestampDocument;
              storiesItem[index] = item;
              setStoriesArray(storiesItem.slice());
              dispatch({
                type: "SET_STORIES",
                reducerStories: storiesArray,
              });
            } else if (status === 13) {
              let eventItem = eventArray;
              let item = { ...eventItem[index] };
              item.base64 = srcValue;
              // item.date = val.data.timestampDocument;
              eventItem[index] = item;
              item.pictureDocumentID = id;
              setEventArray(eventItem);
              // console.log("eventArray", eventArray);
              dispatch({
                type: "SET_EVENT",
                reducerEvent: eventArray,
              });
            } else if (status === 14) {
              let journeyItem = journiesArray;
              let item = { ...journeyItem[index] };
              item.base64 = srcValue;
              journeyItem[index] = item;
              item.pictureDocumentID = id;
              setJourniesArray(journeyItem);
              // console.log("journiesArray", journiesArray);
              dispatch({
                type: "SET_JOURNIES",
                reducerJournies: journiesArray,
              });
            } else {
              let groupItems = groupArrayData;
              let item = { ...groupItems[index] };

              item.base64 = srcValue;
              groupItems[index] = item;

              setGroupArrayData(groupItems);
              dispatch({
                type: "SET_GROUP_DATA",
                reducerGroup: groupArrayData,
              });
              // console.log("init Values", reducerGroup);
              // }

              // console.log("Group Array ", groupArrayData);
            }

            // console.log("updated base64", groupArrayData);
          } else if (val.status === UNAUTH_KEY) {
            // console.log("Setting to 0");
            localStorage.setItem("user-info-token", 0);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: 0,
            });
          }
        } else {
          console.log("document is null");
        }
      });
    }
  };

  const initMemoriesImage = () => {
    getMemories(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("getMemories >>", val);
        var info = val.data;

        // const keys = Object(info).reverse();
        // console.log("getMemories nonreversed", keys);

        // const reversed = keys.reverse();
        // console.log("getMemories reversed", reversed);

        const reversedKeys = Object.keys(info).reverse();

        // reversedKeys.forEach((key) => {
        //   console.log("getMemories reversed", info[key]); // 👉️ c three, b two, a one

        for (var key in info) {
          // console.log("getMemories reversed loop", info[key]);
          if (
            info[key].mimeType === "image/jpeg" ||
            info[key].mimeType === "image/jpg" ||
            info[key].mimeType === "image/png"
          ) {
            // console.log("Image", info[key].pk);

            var i = Object.keys(info).indexOf(key);

            if (info[key].pk !== null || info[key].pk !== "") {
              const memorySingleItem = {
                image: "",
                date: "",
                base64: "",
                documentId: info[key].pk,
                isLoaded: false,
              };

              memoryImagesTwo.unshift(memorySingleItem);

              getImageByDocumentId(info[key].pk, i, 4);
            }
          } else if (
            info[key].mimeType === "video/avi" ||
            info[key].mimeType === "video/mp4"
          ) {
            const videoSingleItem = {
              src: "",
              date: "",
              base64: "",
              name: info[key].fileName,
              documentId: info[key].pk,
              mimeType: info[key].mimeType,
              isLoaded: false,
            };

            memoryVideos.unshift(videoSingleItem);

            getImageByDocumentId(info[key].pk, memoryVideos.length - 1, 10);
          } else {
            const documentSingleItem = {
              src: "",
              date: "",
              base64: "",
              name: info[key].fileName,
              documentId: info[key].pk,
              mimeType: info[key].mimeType,
              isLoaded: false,
            };
            memoryDocuments.unshift(documentSingleItem);

            getImageByDocumentId(info[key].pk, memoryDocuments.length - 1, 11);
          }
        }
        // });

        dispatch({
          type: "SET_MEMORY_IMAGE",
          reducerMemoryImages: memoryImagesTwo,
        });

        dispatch({
          type: "SET_MEMORY_DOCUMENTS",
          reducerMemoryDocuments: memoryDocuments,
        });

        dispatch({
          type: "SET_MEMORY_VIDEOS",
          reducerMemoryVideos: memoryVideos,
        });
      } else if (val.status === UNAUTH_KEY) {
        console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const initPage = () => {
    // console.log("initpage function called");
    initDefaultPictures();
    initProfileValue();
    // initMemberConnections();
    // myMembersConnection();
    // initActivitiesValue();
    // initDiscoverGroups();
    // initMemoriesImage();
    // initMemoryDestinations();
    // initJournies();
    // initEvents();
    // initEmergenciesMap();
  };

  useEffect(() => {
    // console.log("Custom notes UseEffect", notes);

    dispatch({
      type: "GET_ALL_NOTES",
      reducerAllNotes: notes,
    });
  }, [notes]);

  useEffect(() => {
    // console.log("Custom memoryVideos", memoryVideos);
  }, [memoryVideos]);

  useEffect(() => {
    // console.log("Custom Documents UseEffect", memoryDocuments);
  }, [memoryDocuments]);

  useEffect(() => {
    console.log("Initializing page!");
    setMemoryImagesTwo([]);
    setGroupArrayData([]);
    setOtherConnectionsArray([]);
    setActivitiesArrayData([]);
    setOtherGroupsArray([]);
    setPostcardArrayData([]);
    setMyConnectionsArray([]);
    setProfileArrayData([]);
    setAvatarHTML(null);
    // console.log("initial Array", memoryImagesTwo);
    // console.log("initial Array", groupArrayData);
    // console.log("initial Array", otherConnectionsArray);
    // console.log("initial Array", activitiesArrayData);
    // console.log("initial Array", otherGroupsArray);
    // console.log("initial Array", postcardArrayData);
    // console.log("initial Array", myConnectionsArray);
    console.log("userToken", userToken);
  }, [userToken]);

  useEffect(() => {
    if (
      postcardArrayData.length === 0 &&
      groupArrayData.length === 0 &&
      otherConnectionsArray.length === 0 &&
      activitiesArrayData.length === 0 &&
      otherGroupsArray.length === 0 &&
      memoryImagesTwo.length === 0 &&
      myConnectionsArray.length === 0 &&
      // userToken
      userToken !== 0 &&
      userToken
    ) {
      // console.log("Initializing page with Token!", userToken);
      initPage();
    }
  }, [userToken]);

  const initActivitiesValue = () => {
    retrieveAllActivities(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          console.log("retrieving Activity aPi", val.data);
          var info = val.data;

          // console.log("retrieving Activities aPi", info);
          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            console.log("Index:" + i);

            const activitiesVal = "";

            // console.log("activitiesArrayData", activitiesArrayData);
            //console.log("flag Data", info[key].configurations);
            if (info[key].configurations !== null) {
              // console.log("Retrieving Activity Values");
              var configurations = JSON.parse(info[key].configurations);
              const activitykeyData = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              activitiesVal = {
                name: info[key].name,
                key: info[key].pk,
                description: info[key].description,
                countrySvg: null,
                base64: null,
                documentID: activitykeyData.documentID,
                countryCode: activitykeyData.countryCode,
                searchable: info[key].searchable,
              };

              if (
                activitykeyData.countryCode !== null ||
                activitykeyData.countryCode !== ""
              ) {
                getFlagURL(activitykeyData?.countryCode, i, 5);
              }

              if (
                activitykeyData.documentID !== null ||
                activitykeyData.documentID !== ""
              ) {
                getImageByDocumentId(activitykeyData?.documentID, i, 7);
              }
            } else {
              activitiesVal = {
                name: info[key].name,
                key: info[key].pk,
                description: info[key].description,
                countrySvg: null,
                base64: null,
                documentID: null,
                searchable: info[key].searchable,
              };
            }
            activitiesArrayData.unshift(activitiesVal);
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
        dispatch({
          type: "SET_MY_ACTIVITIES",
          reducerMyActivities: activitiesArrayData,
        });
      }
    });
  };

  const initDiscoverGroups = () => {
    // console.log("retrieving Members Data");
    retrieveAllMembersAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          console.log(
            "%cretrieving Members Data",
            "background-color:pink;",
            val.data
          );

          var info = val.data;

          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            // console.log("Index:" + i);

            var groupType = info[key].groupType;
            var owner = info[key].owner;

            if (groupType === groupTypeKey_metaGroups && owner === 0) {
              const groupVal = {
                name: info[key].name,
                key: info[key].pk,
                description: info[key].description,
                countrySvg: null,
                base64: null,
              };

              var configurations = JSON.parse(info[key].configurations);
              const groupDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              // console.log(otherGroupsArray.length);
              otherGroupsArray.push(groupVal);
              // console.log(otherGroupsArray.length);
              if (
                groupDataVal.countryCode !== null ||
                groupDataVal.countryCode !== ""
              ) {
                getFlagURL(
                  groupDataVal?.countryCode,
                  otherGroupsArray.length - 1,
                  2
                );
              }
              // console.log("Calling API for document ID : ", groupDataVal);
              if (
                groupDataVal.documentID !== null ||
                groupDataVal.documentID !== ""
              ) {
                getImageByDocumentId(
                  groupDataVal?.documentID,
                  otherGroupsArray.length - 1,
                  2
                );
              }
              dispatch({
                type: "SET_OTHER_GROUP",
                reducerOtherGroup: otherGroupsArray,
              });
              // console.log("init Values", reducerOtherGroup);

              // console.log("Other Groups Data", otherGroupsArray);
            }
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
        dispatch({
          type: "SET_OTHER_GROUP",
          reducerOtherGroup: otherGroupsArray,
        });
      }
    });
  };

  const initEvents = () => {
    let now = new Date();
    const backdate = new Date(now.setDate(now.getDate() - 30));
    var milliseconds = backdate.getTime() / 1000;

    // console.log("milliseconds", backdate);
    // console.log("milliseconds", milliseconds);
    const params = JSON.stringify({
      startTime: milliseconds,
    });
    // console.log("Params", params);

    retrieveEventAPI(params, userToken, reducerVisitorID).then(function (val) {
      if (val) {
        console.log("calendar retrieve  aPi", val.data);
        if (val.data) {
          var info = val.data;
          var tempEvent = [];
          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            // // eventArray.push(eventVal);
            // // setEventArray(eventVal);
            // setEventArray((prevState) => [...prevState, eventVal]);
            try {
              // console.log("calendar retrieve Key", info[key]);
              let defaultDateArrival = new Date(info[key].startTime * 1000);
              defaultDateArrival.setDate(defaultDateArrival.getDate() + 3);

              // console.log(
              //   "calendar retrieve aPi startTime",
              //   info[key].startTime * 1000
              // );

              var startTime = new Date(
                info[key].startTime * 1000
              ).toISOString();
              var endTime = new Date(
                info[key].startTime * 1000 + info[key].duration * 1000
              ).toISOString();
              var endTimeMS = info[key].startTime + info[key].duration;

              // console.log("calendar retrieve aPi startTime", startTime);
              // console.log("calendar retrieve aPi endTime", endTime);

              let dateConversion = info[key].startTime + info[key].duration;
              let defaultDateDepartur = new Date(dateConversion * 1000);
              defaultDateDepartur.setDate(defaultDateDepartur.getDate() + 3);

              const eventVal = {
                title: info[key].name,
                startDate: startTime,
                startDateMS: info[key].startTime,
                endDate: endTime,
                endDateMS: endTimeMS,
                pk: info[key].pk,
                description: info[key].description,
                duration: info[key].duration,
                latitude: info[key].latitude,
                longitude: info[key].longitude,
                searchable: info[key].searchable,
              };

              // console.log("calendar retrieve ", eventVal);
              // tempEvent.push(eventVal);
              eventArray.push(eventVal);
              setEventArray(eventArray);
              dispatch({
                type: "SET_EVENT",
                reducerEvent: eventArray,
              });
              var configurations = JSON.parse(info[key].configurations);
              // console.log("Test Confid:", configurations);
              if (configurations !== null) {
                const eventsDataVal = {
                  countryCode: configurations?.countryCode,
                  documentID: configurations?.pictureDocumentID,
                };
                if (
                  eventsDataVal.countryCode !== null ||
                  eventsDataVal.countryCode !== ""
                ) {
                  getFlagURL(eventsDataVal?.countryCode, i, 8);
                }
                if (
                  eventsDataVal.documentID !== null ||
                  eventsDataVal.documentID !== ""
                ) {
                  getImageByDocumentId(eventsDataVal?.documentID, i, 13);
                }
              }
            } catch (e) {}
          }
        }
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  useEffect(() => {
    // console.log("calendar retrieve Array", eventArray);
    // console.log("calendar retrieve  Triggered", eventArray.length);
    if (eventArray.length > 0) {
      // console.log("useEffect Triggered reducerEvent");
      dispatch({
        type: "SET_EVENT",
        reducerEvent: eventArray,
      });
    }
  }, [eventArray]);

  useEffect(() => {
    // console.log("longitude:", longitude, "latitude:", latitude);
    if (longitude !== null || latitude !== null) {
      dispatch({
        type: "SET_USER_LOCATION",
        latitude: latitude,
        longitude: longitude,
      });
    }
  }, [latitude, longitude]);

  const initMemoryDestinations = () => {
    retrieveAllTripAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("retrieving Memory Destinations aPi", val.data);
        if (val.data) {
          var info = val.data;
          for (var key in info) {
            const destinationVal = {
              startTime: info[key].startTime,
              endTime: info[key].endTime,
              msg: info[key].msg,
              pk: info[key].pk,
              tmpStmp: info[key].tmpStmp,
              tracID: info[key].tracID,
              avgMpS: info[key].avgMpS,
              latitude: info[key].lat,
              longitude: info[key].lon,
            };
            destinationArray.push(destinationVal);
            dispatch({
              type: "GET_ALL_MEMORIES_DESTINATION",
              reducerAllMemoriesDestination: destinationArray,
            });
          }
        }

        dispatch({
          type: "GET_ALL_MEMORIES_DESTINATION",
          reducerAllMemoriesDestination: destinationArray,
        });
      } else if (val.status === UNAUTH_KEY) {
        // console.log("Setting to 0");
        localStorage.setItem("user-info-token", 0);
        dispatch({
          type: "SET_USER_TOKEN",
          reducerUserToken: 0,
        });
      }
    });
  };

  const initJournies = () => {
    retrieveAllJourneiesAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          console.log("retrieving Journies Data", val.data);

          var info = val.data;
          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            // console.log("Index:" + i);
            const journeyVal = {
              name: info[key].name,
              key: info[key].pk,
              description: info[key].description,
              countrySvg: null,
              base64: null,
              searchable: info[key].searchable,
              latitude: info[key].latitude,
              longitude: info[key].longitude,
              followUpDateTime: info[key].followUpDateTime,
              creationDateTime: info[key].creationDateTime,
              startDateTime: info[key].startDateTime,
              endDateTime: info[key].endDateTime,
              description: info[key].description,
              displayName: info[key].displayName,
              mapZoom: info[key].mapZoom,
              orderPosition: info[key].orderPosition,
            };

            journiesArray.push(journeyVal);

            var configurations = JSON.parse(info[key].configurations);
            console.log(
              "retrieving Journies Data Test Confid:",
              configurations
            );
            if (configurations) {
              const journeyDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };

              if (
                journeyDataVal?.countryCode &&
                journeyDataVal?.countryCode !== ""
              ) {
                getFlagURL(journeyDataVal?.countryCode, i, 9);
              }
              if (
                journeyDataVal?.documentID &&
                journeyDataVal?.documentID !== ""
              ) {
                getImageByDocumentId(journeyDataVal?.documentID, i, 14);
              }

              console.log(
                "retrieving Journies Data Test Confid:",
                journeyDataVal
              );
            }
            dispatch({
              type: "SET_JOURNIES",
              reducerJournies: journiesArray,
            });

            console.log("retrieving Journies Data ", journiesArray);
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
        dispatch({
          type: "SET_JOURNIES",
          reducerJournies: journiesArray,
        });
      }
    });
  };

  const initMemberConnections = () => {
    visibleMembersAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log("retrieving Visible Members Connection Data", val.data);

          var info = val.data;

          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            var groupType = info[key].groupType;
            var owner = info[key].owner;

            const connectionVal = {
              firstName: info[key].firstName,
              lastName: info[key].lastName,
              entKey: info[key].entKey,
              pk: info[key].pk,
              countrySvg: null,
              base64: null,
              ugmStatus: info[key].ugmStatus,
            };

            var configurations = JSON.parse(info[key]?.userconfigurations);
            if (
              configurations !== null &&
              configurations.countryCode !== null &&
              configurations.pictureDocumentID !== null
            ) {
              const connectionDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };
              // console.log(otherConnectionsArray.length);
              otherConnectionsArray.push(connectionVal);
              // console.log(otherConnectionsArray.length);

              if (
                connectionDataVal.countryCode !== null ||
                connectionDataVal.countryCode !== ""
              ) {
                getFlagURL(
                  connectionDataVal?.countryCode,
                  otherConnectionsArray.length - 1,
                  3
                );
              }

              if (
                connectionDataVal.documentID !== null ||
                connectionDataVal.documentID !== ""
              ) {
                getImageByDocumentId(
                  connectionDataVal?.documentID,
                  otherConnectionsArray.length - 1,
                  3
                );
              }

              dispatch({
                type: "SET_CONNECTION_PEOPLE",
                reducerConnectionPeople: otherConnectionsArray,
              });
              // console.log("reducerConnectionsPeople", reducerConnectionPeople);
            }
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      }
      dispatch({
        type: "SET_CONNECTION_PEOPLE",
        reducerConnectionPeople: otherConnectionsArray,
      });
    });
  };

  const myMembersConnection = () => {
    myMembersAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          console.log("retrieving My Members Connection Data", val.data);

          var info = val.data;

          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            var groupType = info[key].groupType;
            var owner = info[key].owner;

            const connectionVal = {
              firstName: info[key].firstName,
              lastName: info[key].lastName,
              pk: info[key].pk,
              entKey: info[key].entKey,
              countrySvg: null,
              base64: null,
              ugmStatus: info[key].ugmStatus,
            };

            var configurations = JSON.parse(info[key]?.userconfigurations);
            if (
              configurations !== null &&
              configurations.countryCode !== null &&
              configurations.pictureDocumentID !== null
            ) {
              const connectionDataVal = {
                countryCode: configurations?.countryCode,
                documentID: configurations?.pictureDocumentID,
              };
              // console.log(myConnectionsArray.length);
              myConnectionsArray.push(connectionVal);
              // console.log(myConnectionsArray.length);

              if (
                connectionDataVal.countryCode !== null ||
                connectionDataVal.countryCode !== ""
              ) {
                getFlagURL(
                  connectionDataVal?.countryCode,
                  myConnectionsArray.length - 1,
                  4
                );
              }

              if (
                connectionDataVal.documentID !== null ||
                connectionDataVal.documentID !== ""
              ) {
                getImageByDocumentId(
                  connectionDataVal?.documentID,
                  myConnectionsArray.length - 1,
                  6
                );
              }

              dispatch({
                type: "SET_MY_CONNECTION_PEOPLE",
                reducerMyConnectionPeople: myConnectionsArray,
              });
            }
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }

        dispatch({
          type: "SET_MY_CONNECTION_PEOPLE",
          reducerMyConnectionPeople: myConnectionsArray,
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="screenLoader">
        <Oval color="#00BFFF" />
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* <Header /> */}

        <Switch>
          <Route path="/authentication">
            <AuthScreen />
          </Route>
          <Route path="/test/:ID">
            <Test />
          </Route>

          <Route exact path="/">
            <Redirect to="/home" component={Home} />
          </Route>

          <Route path="/">
            <AppMainScreen groupArrayData={groupArrayData} />
          </Route>

          {/* <ProtectedRoutes path="/home" component={Home} auth={isAuth} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
