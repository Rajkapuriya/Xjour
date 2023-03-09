import { Box, Tab, Tabs } from "@mui/material";
// import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../../config/context api/StateProvider";
import ActivitiesSection from "./Activities Section/ActivitiesSection";
import DestinationsSection from "./Destinations Section/DestinationsSection";
import "./Discover.css";

function Discover() {
  const [{ reducerDefaultPictures }, dispatch] =
    useStateValue();
  const [isActivitySection, setIsActivitySection] = useState(false);
  const [value, setValue] = useState(1);
  const [userImageDetails, setUserImageDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });
  const [userGroupDetails, setUserGroupDetails] = useState({
    base64: null,
    base64DocumentID: null,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsActivitySection(!isActivitySection);
  };

  useEffect(() => {
    // console.log("Default Pictures`Array :", reducerDefaultPictures);
    if (reducerDefaultPictures) {
      // console.log("Default Pictures`Array :", reducerDefaultPictures);
      // console.log("Default Pictures Item:", reducerDefaultPictures[1]);

      setUserImageDetails({
        ...userImageDetails,
        base64: reducerDefaultPictures[5].base64Value,
        base64DocumentID: reducerDefaultPictures[5].documentID,
      });
      setUserGroupDetails({
        ...userGroupDetails,
        base64: reducerDefaultPictures[1].base64Value,
        base64DocumentID: reducerDefaultPictures[1].documentID,
      });
    }
  }, [reducerDefaultPictures]);

  return (
    <div className="discover">
      <h3 className="discover__heading">Discover</h3>
      <div className="discover__containerTop">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab className="tabButton" value={1} label="Destinations" />
            <Tab className="tabButton" value={2} label="Activities" />
          </Tabs>
        </Box>
      </div>

      <div className="adiscover__containerMain">
        {!isActivitySection ? (
          <DestinationsSection
            userImageDetails={userImageDetails}
            userGroupDetails={userGroupDetails}
          />
        ) : (
          <ActivitiesSection
            userImageDetails={userImageDetails}
            userGroupDetails={userGroupDetails}
          />
        )}
      </div>
    </div>
  );
}

export default Discover;
