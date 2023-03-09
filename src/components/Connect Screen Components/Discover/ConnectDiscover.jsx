import React, { useState, useEffect } from "react";
import "./ConnectDiscover.css";
import { Box, Tab, Tabs } from "@mui/material";
import DiscoverPeople from "./Discover People/DiscoverPeople";
import DiscoverGroups from "./Discover Groups/DiscoverGroups";
import {
  getDocumentByName,
  getPrivateDocument,
  retrieveAllMembersAPI,
  visibleMembersAPI,
} from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";
import {
  groupTypeKey_metaGroups,
  UNAUTH_KEY,
} from "../../../assets/constants/Contants";

function ConnectDiscover() {
  const [isConnectSection, setIsConnectSection] = useState(false);
  const [otherConnectionsArray, setOtherConnectionsArray] = useState([]);
  const [otherGroupsArray, setOtherGroupsArray] = useState([]);
  const [{ userToken, reducerConnectionPeople, reducerVisitorID }, dispatch] =
    useStateValue();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsConnectSection(!isConnectSection);
  };

  useEffect(() => {
    initMemberConnections();
    initDiscoverGroups();
  }, []);

  const initMemberConnections = () => {
    setOtherConnectionsArray([]);
    visibleMembersAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log("retrieving Members Connection Data", val.data);

          var info = val.data;

          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            var groupType = info[key].groupType;
            var owner = info[key].owner;

            const connectionVal = {
              firstName: info[key].firstName,
              lastName: info[key].lastName,
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
                  connectionDataVal.countryCode,
                  otherConnectionsArray.length - 1,
                  3
                );
              }

              if (
                connectionDataVal.documentID !== null ||
                connectionDataVal.documentID !== ""
              ) {
                getImageByDocumentId(
                  connectionDataVal.documentID,
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

  const initDiscoverGroups = () => {
    setOtherGroupsArray([]);
    retrieveAllMembersAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log("retrieving Members Data", val.data);
          var info = val.data;

          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
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
                countryCode: configurations.countryCode,
                documentID: configurations.pictureDocumentID,
              };

              // console.log(otherGroupsArray.length);
              otherGroupsArray.push(groupVal);
              // console.log(otherGroupsArray.length);
              if (
                groupDataVal.countryCode !== null ||
                groupDataVal.countryCode !== ""
              ) {
                getFlagURL(
                  groupDataVal.countryCode,
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
                  groupDataVal.documentID,
                  otherGroupsArray.length - 1,
                  2
                );
              }

              dispatch({
                type: "SET_OTHER_GROUP",
                reducerOtherGroup: otherGroupsArray,
              });
              // console.log("Other Groups Data", otherGroupsArray);
            }
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

  const getFlagURL = (data, index, state) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
      console.log("flagURL Info", val.data);
      if (val.data != null) {
        var mimeType = "image/svg+xml";
        let svgValue = `data:${mimeType};base64,${val.data}`;

        if (state = 3) {
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
        } else if (state === 2) {
          let groupItems = otherGroupsArray;
          let item = { ...groupItems[index] };

          item.countrySvg = svgValue;
          groupItems[index] = item;

          setOtherGroupsArray(groupItems);
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

  const getImageByDocumentId = (id, index, status) => {
    // console.log("Calling image API for ID:", id);
    getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
      console.log("this is Image val", val);
      if (val) {
        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          const mimeType = val.data.mimeType;
          let srcValue = `data:${mimeType};base64,${imageFile}`;

          if (status === 3) {
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
          } else if (status === 2) {
            let groupItems = otherGroupsArray;
            let item = { ...groupItems[index] };

            item.base64 = srcValue;
            groupItems[index] = item;
            setOtherGroupsArray(groupItems);

            console.log("Other Groups! ", otherGroupsArray);
          }
        } else {
          // console.log("document is null");
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

  return (
    <div className="connectDiscover">
      <h3 className="myConnections__heading">Discover</h3>
      <div className="myConnections__containerTop">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab className="tabButton" value={1} label="People" />
            <Tab className="tabButton" value={2} label="Groups" />
          </Tabs>
        </Box>
      </div>

      <div className="myConnections__containerMain">
        {!isConnectSection ? <DiscoverPeople /> : <DiscoverGroups />}
      </div>
    </div>
  );
}

export default ConnectDiscover;
