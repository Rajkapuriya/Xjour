import React, { useEffect, useState } from "react";
import "./MyConnections.css";
import { Box, Tab, Tabs } from "@mui/material";
import PeopleSection from "./People Section/PeopleSection";
import GroupsSection from "./Groups Section/GroupsSection";
import {
  getDocumentByName,
  getPrivateDocument,
  myMembersAPI,
  retrieveAllMetaGroupAPI,
} from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";
import { UNAUTH_KEY } from "../../../assets/constants/Contants";

function MyConnections() {
  const [isConnectSection, setIsConnectSection] = useState(false);
  const [myConnectionsArray, setMyConnectionsArray] = useState([]);
  const [groupArrayData, setGroupArrayData] = useState([]);
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsConnectSection(!isConnectSection);
  };

  const myMembersConnection = () => {
    setMyConnectionsArray([]);
    myMembersAPI(userToken, reducerVisitorID).then(function (val) {
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
              // console.log(myConnectionsArray.length);
              myConnectionsArray.push(connectionVal);
              // console.log(myConnectionsArray.length);

              if (
                connectionDataVal.countryCode !== null ||
                connectionDataVal.countryCode !== ""
              ) {
                getFlagURL(
                  connectionDataVal.countryCode,
                  myConnectionsArray.length - 1,
                  4
                );
              }
              if (
                connectionDataVal.documentID !== null ||
                connectionDataVal.documentID !== ""
              ) {
                getImageByDocumentId(
                  connectionDataVal.documentID,
                  myConnectionsArray.length - 1,
                  6
                );
              }
              dispatch({
                type: "SET_MY_CONNECTION_PEOPLE",
                reducerMyConnectionPeople: myConnectionsArray,
              });
              // console.log(
              //   "reducerMyConnectionsPeople",
              //   reducerMyConnectionPeople
              // );
            }
          }
        } else {
          dispatch({
            type: "SET_MY_CONNECTION_PEOPLE",
            reducerMyConnectionPeople: myConnectionsArray,
          });
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

  const initGroupValue = () => {
    setGroupArrayData([]);
    // console.log("retrieving group Data", groupArrayData);
    retrieveAllMetaGroupAPI(userToken, reducerVisitorID).then(function (val) {
      if (val) {
        if (val.data) {
          // console.log("retrieving group aPi", val.data);
          // setGroupArrayData(val.data);

          var info = val.data;

          // console.log("retrieving group aPi", info);
          for (var key in info) {
            var i = Object.keys(info).indexOf(key);
            // console.log("Index:" + i);
            const groupVal = {
              name: info[key].name,
              key: info[key].pk,
              description: info[key].description,
              countrySvg: null,
              base64: null,
              searchable: info[key].searchable,
            };

            groupArrayData.push(groupVal);

            // console.log("groupArrayData", groupArrayData);
            // console.log("flag Data", info[key].configurations);
            var configurations = JSON.parse(info[key].configurations);
            // console.log("Test Confid:" + configurations);
            if (configurations != null) {
              const groupDataVal = {
                countryCode: configurations.countryCode,
                documentID: configurations.pictureDocumentID,
              };

              if (
                groupDataVal.countryCode !== null ||
                groupDataVal.countryCode !== ""
              ) {
                getFlagURL(groupDataVal.countryCode, i, 1);
              }
              if (
                groupDataVal.documentID !== null ||
                groupDataVal.documentID !== ""
              ) {
                getImageByDocumentId(groupDataVal.documentID, i, 1);
              }
            }
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
  };

  const getFlagURL = (data, index, state) => {
    getDocumentByName(userToken, data, reducerVisitorID).then(function (val) {
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
  };

  const getImageByDocumentId = (id, index, status) => {
    // console.log("Calling image API for ID:", id);
    getPrivateDocument(userToken, id, reducerVisitorID).then(function (val) {
      if (val) {
        // console.log("this is Image val", val);

        if (val.data !== null) {
          const imageFile = val.data.dataBase64;
          const mimeType = val.data.mimeType;
          let srcValue = `data:${mimeType};base64,${imageFile}`;

          if (status === 6) {
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

  useEffect(() => {
    // console.log("My member Api just called");
    myMembersConnection();
    initGroupValue();
  }, []);

  return (
    <div className="myConnections">
      <h3 className="myConnections__heading">My Connections</h3>
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
        {!isConnectSection ? <PeopleSection /> : <GroupsSection />}
      </div>
    </div>
  );
}

export default MyConnections;
