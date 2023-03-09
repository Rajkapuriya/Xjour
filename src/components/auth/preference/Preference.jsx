import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";

import { ChevronRight } from "@mui/icons-material";

import "./Preference.css";

import {
  greetings,
  preferActivity,
  preferDestination,
} from "assets/strings/Strings";
import { UNAUTH_KEY } from "assets/constants/Contants";

import {
  userUpdateActivityPrefs,
  userUpdateDestPrefs,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  useUpdateActivityPreferencesMutation,
  useUpdateDestinationPreferencesMutation,
} from "store/endpoints/users";

import ButtonAtom from "components/Atoms/Button/Button";
import PreferenceItem from "./PreferenceItem";

function Preference() {
  const history = useHistory();
  const alert = useAlert();

  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();

  const [updateDestinationPrefs, updateDestinationPrefsQueryState] =
    useUpdateDestinationPreferencesMutation();
  const [updateActivityPrefs, updateActivityPrefsQueryState] =
    useUpdateActivityPreferencesMutation();

  const [isUpdating, setIsUpdating] = useState(false);
  const [destinations, setDestinations] = useState([
    { value: "Coastal", status: true },
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
      status: false,
    },
    {
      value: "Outdoor",
      status: false,
    },
    {
      value: "Art",
      status: false,
    },
    {
      value: "Music",
      status: false,
    },
    {
      value: "Technology",
      status: false,
    },
    {
      value: "Social",
      status: false,
    },
    {
      value: "Adventure",
      status: false,
    },
    {
      value: "Gaming",
      status: false,
    },
  ]);
  console.log(activities, destinations);

  const onActivityItemPress = (index, value, status) => {
    // console.log("initial values >", index, value, status);
    // console.log(activities[index].status);

    const activityVal = { value: value, index: index, status: !status };
    // console.log("new Values >", activityVal);
    const newActivtyVal = [...activities];

    newActivtyVal[index] = activityVal;

    setActivities(newActivtyVal);
  };

  const onDestinationItemPress = (index, value, status) => {
    const destinationVal = { value: value, index: index, status: !status };
    // console.log("new Values >", activityVal);
    const newDestinationVal = [...destinations];

    newDestinationVal[index] = destinationVal;

    setDestinations(newDestinationVal);
  };

  const updateDestinationActivity = async () => {
    setIsUpdating(true);

    const proms = [
      updateDestinationPrefs({
        data: destinations,
        userToken,
        reducerVisitorID,
      }),
      updateActivityPrefs({ data: activities, userToken, reducerVisitorID }),
    ];

    const promsResult = await Promise.allSettled(proms);
    console.log(
      "%cpromsResult:",
      "background-color:red;color:white;",
      promsResult
    );

    setIsUpdating(false);
    history.push("/profile");
  };

  return (
    <div className="preference">
      {isUpdating ? (
        <div className="preference__updating-loader-container">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <div className="preference__container">
          <div className="preference__heading">
            <h2>{greetings}</h2>
          </div>
          <div className="preference__destinations">
            <h5>{preferDestination}</h5>

            <div className="preference__destinations-buttons">
              {destinations.map((v, index) => (
                <PreferenceItem
                  value={v.value}
                  index={index}
                  status={v.status}
                  pressHandler={onDestinationItemPress}
                />
              ))}
            </div>
          </div>
          <div className="preference__activities">
            <h5>{preferActivity}</h5>

            <div className="preference__activities-buttons">
              {activities.map((v, index) => (
                <PreferenceItem
                  key={v + index}
                  value={v.value}
                  index={index}
                  status={v.status}
                  pressHandler={onActivityItemPress}
                />
              ))}
            </div>
          </div>

          <div className="preference__button-container">
            <div className="preference__button">
              <ButtonAtom
                variant="filled"
                onClick={() => updateDestinationActivity()}
              >
                Continue
                <ChevronRight />
              </ButtonAtom>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preference;
