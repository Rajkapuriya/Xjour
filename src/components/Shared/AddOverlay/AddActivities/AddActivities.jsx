import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Shimmer } from "react-shimmer";

import "./AddActivities.css";

import { useStateValue } from "config/context api/StateProvider";

import { activitiesSelector } from "store/reducers/activities";
import { destinationsSelector } from "store/reducers/destinations";
import { useGetActivitiesQuery } from "store/endpoints/activities";

import { Check } from "@mui/icons-material";

import MiniActivitiesCard from "components/Destination Screen Components/My Activities/Activities for Create Group Screen/Mini Activities Card/MiniActivitiesCard";

export default function AddActivities(props) {
  const { setActivityToAdd } = props;

  const location = useLocation();
  const isOnViewSingleDestinationPage =
    location.pathname.includes("view-destination");

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const activitiesState = useSelector(activitiesSelector);
  const getActivitiesQueryState = useGetActivitiesQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });
  console.log(
    "%cgetActivitiesQueryState:",
    "background-color:navy;color:white;",
    getActivitiesQueryState
  );

  const renderActivities = useMemo(() => {
    const checkActivityAlreadyInDestination = (activity) => {
      return Boolean(
        destinationsState.singleDestinationsData[
          destinationsState.selectedSingleDestination.key
        ]?.activitiesData.find((act) => act.key === activity.key)
      );
    };

    return activitiesState.activities.map((activity) => {
      return (
        <div className="destination__add-activities-image-container">
          <div
            className="destination__add-activities-card-container"
            onClick={() => setActivityToAdd(activity)}
          >
            <MiniActivitiesCard data={activity} />
          </div>

          {isOnViewSingleDestinationPage &&
            checkActivityAlreadyInDestination(activity) && (
              <div className="destination__add-activities-image-overlay">
                <Check className="destination__add-activities-check-icon" />
              </div>
            )}
        </div>
      );
    });
  }, [
    activitiesState.activities,
    destinationsState.selectedSingleDestination.key,
    destinationsState.singleDestinationsData,
    isOnViewSingleDestinationPage,
    setActivityToAdd,
  ]);

  return (
    <div className="destination__add-activities">
      {getActivitiesQueryState.isFetching ? (
        <div className="destination__add-activities-shimmers-container">
          {Array.from({ length: 6 }).map((v, i) => {
            return (
              <Shimmer
                width={230}
                height={130}
                className="destination__add-activities-shimmer"
              />
            );
          })}
        </div>
      ) : getActivitiesQueryState.isError ? (
        <p className="destination__add-activities-error">
          {getActivitiesQueryState.error}
        </p>
      ) : activitiesState.activities.length === 0 ? (
        <p className="destination__add-activities-no-activities">
          No Activities
        </p>
      ) : (
        <div className="destination__add-activities-items">
          {renderActivities}
        </div>
      )}
    </div>
  );
}
