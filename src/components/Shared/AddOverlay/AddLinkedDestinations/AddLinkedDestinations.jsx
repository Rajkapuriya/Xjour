import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Shimmer } from "react-shimmer";

import "./AddLinkedDestinations.css";

import { Check } from "@mui/icons-material";

import { useStateValue } from "config/context api/StateProvider";

import { destinationsSelector } from "store/reducers/destinations";
import { useLazyGetDestinationsQuery } from "store/endpoints/destinations";

import MiniDestinationCard from "components/Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";

export default function AddLinkedDestinations(props) {
  const { setDestinationToAdd } = props;

  const location = useLocation();
  const isOnViewSingleDestinationPage =
    location.pathname.includes("view-destination");
  console.log("%clocation:", "background-color:red;", location);

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const [getDestinations, destinationsQueryState] = useLazyGetDestinationsQuery(
    {
      fixedCacheKey: "destination-pages",
    }
  );
  const destinationsState = useSelector(destinationsSelector);

  useEffect(() => {
    if (destinationsState.destinations.length === 0) {
      getDestinations({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, []);

  const destinationsToRender = isOnViewSingleDestinationPage
    ? destinationsState.destinations.filter((destination) => {
        return (
          destination.key !== destinationsState.selectedSingleDestination.key
        );
      })
    : destinationsState.destinations;

  const renderDestinations = useMemo(() => {
    const checkDestinationAlreadyInDestination = (destination) => {
      return Boolean(
        destinationsState.singleDestinationsData[
          destinationsState.selectedSingleDestination.key
        ]?.linkedDestinationsData?.find(
          (linkedDestination) => linkedDestination.key === destination.key
        )
      );
    };

    return destinationsToRender.map((destination) => {
      return (
        <div className="destination__add-linked-destinations-image-container">
          <div
            className="destination__add-linked-destinations-card-container"
            onClick={() => setDestinationToAdd(destination)}
          >
            <MiniDestinationCard data={destination} />
          </div>

          {isOnViewSingleDestinationPage &&
            checkDestinationAlreadyInDestination(destination) && (
              <div className="destination__add-linked-destinations-image-overlay">
                <Check className="destination__add-linked-destinations-check-icon" />
              </div>
            )}
        </div>
      );
    });
  }, [
    destinationsState.selectedSingleDestination.key,
    destinationsState.singleDestinationsData,
    destinationsToRender,
    isOnViewSingleDestinationPage,
    setDestinationToAdd,
  ]);

  return (
    <div className="destination__add-linked-destinations">
      {destinationsQueryState.isLoading ? (
        <div className="destination__add-linked-destinations-shimmers-container">
          {Array.from({ length: 4 }).map((v, i) => {
            return (
              <Shimmer
                width={230}
                height={130}
                className="destination__add-linked-destinations-shimmer"
              />
            );
          })}
        </div>
      ) : destinationsQueryState.isError ? (
        <p className="destination__add-linked-destinations-error">
          {destinationsQueryState.error}
        </p>
      ) : destinationsToRender.length === 0 ? (
        <p className="destination__add-linked-destinations-no-destinations">
          No Destinations
        </p>
      ) : (
        <div className="destination__add-linked-destinations-items">
          {renderDestinations}
        </div>
      )}
    </div>
  );
}
