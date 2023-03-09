import { useSelector } from "react-redux";
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

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const memberConnectionsState = useSelector(memberConnectionsSelector);
  const getMyMemberConnectionsQueryState = useGetMyMemberConnectionsQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });

  const checkConnectionAlreadyInDestination = (connection) => {
    return Boolean(
      destinationsState.singleDestinationsData[
        destinationsState.selectedSingleDestination.key
      ].connectionsData.find((con) => con.entKey === connection.entKey)
    );
  };

  return (
    <div className="view-destination__add-connections">
      <div className="view-destination__add-connections-items">
        {getMyMemberConnectionsQueryState.isFetching ? (
          Array.from({ length: 6 }).map((v, i) => {
            return (
              <Shimmer
                width={230}
                height={130}
                className="view-destination__add-connections-shimmer"
              />
            );
          })
        ) : getMyMemberConnectionsQueryState.isError ? (
          <p>{getMyMemberConnectionsQueryState.error}</p>
        ) : memberConnectionsState.memberConnections.length === 0 ? (
          <p>No Connections</p>
        ) : (
          memberConnectionsState.memberConnections.map((memberConnection) => {
            return (
              <div className="view-destination__add-connections-image-container">
                <div
                  className="view-destination__add-connections-card-container"
                  onClick={() => setConnectionToAdd(memberConnection)}
                >
                  <PeopleCards data={memberConnection} />
                </div>

                {checkConnectionAlreadyInDestination(memberConnection) && (
                  <div className="view-destination__add-connections-image-overlay">
                    <Check className="view-destination__add-connections-check-icon" />
                  </div>
                )}
              </div>

              // <div className="view-destination__add-connections-image-container">
              //   <img
              //     src={memberConnection.base64}
              //     alt={memberConnection.name}
              //     className="view-destination__add-connections-image"
              //     onClick={() => setConnectionToAdd(memberConnection)}
              //   />
              // </div>
            );
          })
        )}
      </div>
    </div>
  );
}
