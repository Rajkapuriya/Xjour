import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Shimmer } from "react-shimmer";
import InfiniteScroll from "react-infinite-scroll-component";

import "./MyDestinations.css";

import { useStateValue } from "config/context api/StateProvider";

import { destinationsSelector } from "store/reducers/destinations";
import { useLazyGetDestinationsQuery } from "store/endpoints/destinations";

import ButtonAtom from "components/Atoms/Button/Button";
import MyDestinationCards from "./MyDestination Cards/MyDestinationCards";

function MyDestinations({ getDestinationData }) {
  const history = useHistory();

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);

  const [getDestinations, destinationsQueryState] = useLazyGetDestinationsQuery(
    {
      fixedCacheKey: "destination-pages",
    }
  );

  const [loader, isLoading] = useState(true);

  const firstMount = useRef(true);

  useEffect(() => {
    if (
      destinationsState?.destinations?.length > 0 ||
      (destinationsState?.destinations?.length === 0 &&
        destinationsQueryState.isSuccess)
    ) {
      isLoading(false);
    }
  }, [destinationsQueryState.isSuccess, destinationsState?.destinations]);

  useEffect(() => {
    if (!firstMount.current) {
      getDestinations({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [
    destinationsState.destinationsPageNumber,
    getDestinations,
    reducerVisitorID,
    userToken,
  ]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      if (destinationsState.destinations.length === 0) {
        getDestinations({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [
    destinationsState.destinations.length,
    getDestinations,
    reducerVisitorID,
    userToken,
  ]);

  const moveToCreateDestination = () => {
    history.push("/destinations/create-destination");
  };

  return (
    <>
      <div className="my-destinations">
        <div className="my-destinations__header">
          <h1 className="my-destinations__heading">My Destinations </h1>
          <ButtonAtom fontSize="medium" onClick={moveToCreateDestination}>
            + CREATE
          </ButtonAtom>
        </div>

        <div className="my-destinations__content">
          {loader ? (
            <div className="my-destinations__shimmer-container">
              {Array.from({ length: 4 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={575}
                    height={180}
                    className="my-destinations__shimmer"
                  />
                );
              })}
            </div>
          ) : (
            <>
              {destinationsQueryState.isError ? (
                <div className="my-destinations__error-container">
                  <p className="my-destinations__error">
                    {destinationsQueryState.error}
                  </p>
                </div>
              ) : destinationsState.recentDestinationsScrollState.items
                  .length <= 0 ? (
                <div className="my-destinations__empty">
                  <p className="my-destinations__empty-text">No Destinations</p>
                </div>
              ) : (
                <>
                  {destinationsState.recentDestinationsScrollState.items.map(
                    (v, i) => (
                      <MyDestinationCards
                        key={`${v.key}-${i}`}
                        data={v}
                        index={i}
                        getDestinationData={getDestinationData}
                      />
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyDestinations;
