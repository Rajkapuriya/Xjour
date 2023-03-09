import { useSelector } from "react-redux";

import "./AddLinkedDestinations.css";

import { useStateValue } from "config/context api/StateProvider";

import { destinationsSelector } from "store/reducers/destinations";

import { Check } from "@mui/icons-material";

import MiniDestinationCard from "components/Destination Screen Components/My Destinations/Mini Destination Card/MiniDestinationCard";

export default function AddLinkedDestinations(props) {
  const { setDestinationToAdd } = props;

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);

  const checkDestinationAlreadyInDestination = (destination) => {
    return Boolean(
      destinationsState.singleDestinationsData[
        destinationsState.selectedSingleDestination.key
      ].linkedDestinationsData.find(
        (linkedDestination) => linkedDestination.key === destination.key
      )
    );
  };

  const destinationsExcludingItself = destinationsState.destinations.filter(
    (destination) => {
      return (
        destination.key !== destinationsState.selectedSingleDestination.key
      );
    }
  );

  return (
    <div className="view-destination__add-linked-destinations">
      <div className="view-destination__add-linked-destinations-items">
        {destinationsExcludingItself.length === 0 ? (
          <p>No Destinations</p>
        ) : (
          destinationsExcludingItself.map((destination) => {
            return (
              <div className="view-destination__add-linked-destinations-image-container">
                <div
                  className="view-destination__add-linked-destinations-card-container"
                  onClick={() => setDestinationToAdd(destination)}
                >
                  <MiniDestinationCard data={destination} />
                </div>

                {checkDestinationAlreadyInDestination(destination) && (
                  <div className="view-destination__add-linked-destinations-image-overlay">
                    <Check className="view-destination__add-linked-destinations-check-icon" />
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
