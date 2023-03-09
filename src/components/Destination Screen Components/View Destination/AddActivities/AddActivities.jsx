import { useSelector } from "react-redux";
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

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const activitiesState = useSelector(activitiesSelector);
  const getActivitiesQueryState = useGetActivitiesQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });

  const checkActivityAlreadyInDestination = (activity) => {
    return Boolean(
      destinationsState.singleDestinationsData[
        destinationsState.selectedSingleDestination.key
      ].activitiesData.find((act) => act.key === activity.key)
    );
  };

  return (
    <div className="view-destination__add-activities">
      <div className="view-destination__add-activities-items">
        {getActivitiesQueryState.isFetching ? (
          Array.from({ length: 6 }).map((v, i) => {
            return (
              <Shimmer
                width={230}
                height={130}
                className="view-destination__add-activities-shimmer"
              />
            );
          })
        ) : getActivitiesQueryState.isError ? (
          <p>{getActivitiesQueryState.error}</p>
        ) : activitiesState.activities.length === 0 ? (
          <p>No Activities</p>
        ) : (
          activitiesState.activities.map((activity) => {
            return (
              <div className="view-destination__add-activities-image-container">
                <div
                  className="view-destination__add-activities-card-container"
                  onClick={() => setActivityToAdd(activity)}
                >
                  <MiniActivitiesCard data={activity} />
                </div>

                {checkActivityAlreadyInDestination(activity) && (
                  <div className="view-destination__add-activities-image-overlay">
                    <Check className="view-destination__add-activities-check-icon" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
