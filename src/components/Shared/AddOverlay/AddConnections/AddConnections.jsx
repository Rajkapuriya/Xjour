import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Shimmer } from "react-shimmer";

import "./AddConnections.css";

import { useStateValue } from "config/context api/StateProvider";

import { useGetMyMemberConnectionsQuery } from "store/endpoints/memberManagement";
import { destinationsSelector } from "store/reducers/destinations";
import { memberConnectionsSelector } from "store/reducers/memberConnections";

import { Check } from "@mui/icons-material";

import PeopleCards from "components/Connect Screen Components/My Connections/People Section/People cards/PeopleCards";

export default function AddConnections(props) {
  const { setConnectionToAdd } = props;

  const location = useLocation();
  const isOnViewSingleDestinationPage =
    location.pathname.includes("view-destination");

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const memberConnectionsState = useSelector(memberConnectionsSelector);
  const getMyMemberConnectionsQueryState = useGetMyMemberConnectionsQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });
  console.log(
    "%cgetMyMemberConnectionsQueryState:",
    "background-color:mediumseagreen;",
    getMyMemberConnectionsQueryState
  );

  const renderConnections = useMemo(() => {
    const checkConnectionAlreadyInDestination = (connection) => {
      return Boolean(
        destinationsState.singleDestinationsData[
          destinationsState.selectedSingleDestination.key
        ]?.connectionsData?.find((con) => con.entKey === connection.entKey)
      );
    };

    return memberConnectionsState.memberConnections.map((memberConnection) => {
      return (
        <div className="destination__add-connections-image-container">
          <div
            className="destination__add-connections-card-container"
            onClick={() => setConnectionToAdd(memberConnection)}
          >
            <PeopleCards data={memberConnection} />
          </div>

          {isOnViewSingleDestinationPage &&
            checkConnectionAlreadyInDestination(memberConnection) && (
              <div className="destination__add-connections-image-overlay">
                <Check className="destination__add-connections-check-icon" />
              </div>
            )}
        </div>
      );
    });
  }, [
    destinationsState.selectedSingleDestination.key,
    destinationsState.singleDestinationsData,
    isOnViewSingleDestinationPage,
    memberConnectionsState.memberConnections,
    setConnectionToAdd,
  ]);

  return (
    <div className="destination__add-connections">
      {getMyMemberConnectionsQueryState.isFetching ? (
        <div className="destination__add-connections-shimmers-container">
          {Array.from({ length: 6 }).map((v, i) => {
            return (
              <Shimmer
                width={230}
                height={130}
                className="destination__add-connections-shimmer"
              />
            );
          })}
        </div>
      ) : getMyMemberConnectionsQueryState.isError ? (
        <p className="destination__add-connections-error">
          {getMyMemberConnectionsQueryState.error}
        </p>
      ) : memberConnectionsState.memberConnections.length === 0 ? (
        <p className="destination__add-connections-no-connections">
          No Connections
        </p>
      ) : (
        <div className="destination__add-connections-items">
          {renderConnections}
        </div>
      )}
    </div>
  );
}
