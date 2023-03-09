import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Shimmer } from "react-shimmer";

import "./RecentDestinations.css";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { useStateValue } from "config/context api/StateProvider";

import {
  destinationsSelector,
  setDestinationsPageNumber,
} from "store/reducers/destinations";
import { useLazyGetDestinationsQuery } from "store/endpoints/destinations";

import ButtonAtom from "components/Atoms/Button/Button";
import RecentDestinationItems from "./Recent destinations items/RecentDestinationItems";

function RecentDestinations({ getDestinationData }) {
  const [{ userToken, reducerVisitorID }] = useStateValue();

  const dispatch = useDispatch();
  const destinationsState = useSelector(destinationsSelector);
  console.log(
    "%cdestinationsState:",
    "background-color:aqua;",
    destinationsState
  );

  const [getDestinations, destinationsQueryState] =
    useLazyGetDestinationsQuery();
  console.log(
    "%cdestinationsQueryState:",
    "background-color:crimson;color:white;",
    destinationsQueryState
  );

  const [loader, isLoading] = useState(true);
  const [leftChevronEnabled, setLeftChevronEnabled] = useState(false);
  const [rightChevronEnabled, setRightChevronEnabled] = useState(false);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver((entries) => {
      const recentDestinationsScrollContainer = entries[0].target;
      if (
        recentDestinationsScrollContainer.clientWidth <
        recentDestinationsScrollContainer.scrollWidth
      ) {
        setRightChevronEnabled(true);
      } else {
        setRightChevronEnabled(false);
      }
    });
  }, []);

  const firstMount = useRef(true);
  const [destinationsWrapperNode, setDestinationsWrapperNode] = useState(null);
  const destinationsWrapper = useCallback(
    (node) => {
      if (node !== null) {
        setDestinationsWrapperNode(node);
        resizeObserver.observe(node);
      }
    },
    [resizeObserver]
  );
  const shimmerWrapper = useRef(null);

  useEffect(() => {
    if (
      destinationsState?.destinations?.length > 0 ||
      destinationsQueryState.isSuccess
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

  useEffect(() => {
    if (destinationsState.destinations.length > 0) {
      if (destinationsWrapperNode) {
        if (
          destinationsWrapperNode.scrollWidth -
            destinationsWrapperNode.scrollLeft >
          destinationsWrapperNode.clientWidth
        ) {
          setRightChevronEnabled(true);
        } else {
          setRightChevronEnabled(false);
        }
      }
    }
  }, [destinationsState.destinations.length, destinationsWrapperNode]);

  const onRecentDestinationsContainerScroll = (event) => {
    if (event.target.scrollLeft === 0) {
      setLeftChevronEnabled(false);
    } else {
      setLeftChevronEnabled(true);
    }

    if (
      event.target.scrollWidth - event.target.scrollLeft >
      event.target.clientWidth
    ) {
      setRightChevronEnabled(true);
    } else {
      setRightChevronEnabled(false);
    }
  };

  const scrollDestinations = (scrollOffset) => {
    destinationsWrapperNode.scrollLeft += scrollOffset;
  };
  const scrollShimmer = (scrollOffset) => {
    shimmerWrapper.current.scrollLeft += scrollOffset;
  };

  const showNextRecentDestinations = () => {
    dispatch(
      setDestinationsPageNumber(destinationsState.destinationsPageNumber + 1)
    );
  };

  const onDestinationsScroll = (event) => {
    if (
      destinationsState.recentDestinationsScrollState.hasMore &&
      !destinationsQueryState.isFetching
    ) {
      const totalWidthOfContent = event.target.scrollWidth;
      const clientWidthOfContainer = event.target.clientWidth;
      const scrollOffset = event.target.scrollLeft;

      const threshold =
        totalWidthOfContent - clientWidthOfContainer - scrollOffset;

      if (threshold < 200) {
        showNextRecentDestinations();
      }
    }
  };

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const onRecentDestinationsMouseMove = (event) => {
    const dx = event.clientX - pos.x;
    const dy = event.clientY - pos.y;

    const element = destinationsWrapperNode;
    element.scrollTop = pos.top - dy;
    element.scrollLeft = pos.left - dx;
  };

  const onRecentDestinationsMouseUp = (event) => {
    const element = destinationsWrapperNode;
    element.style.cursor = "grab";
    element.style.removeProperty("user-select");

    document.removeEventListener("mousemove", onRecentDestinationsMouseMove);
    document.removeEventListener("mouseup", onRecentDestinationsMouseUp);
  };

  const onRecentDestinationsMouseDown = (event) => {
    const element = destinationsWrapperNode;
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";

    pos = {
      left: element.scrollLeft,
      top: element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener("mousemove", onRecentDestinationsMouseMove);
    document.addEventListener("mouseup", onRecentDestinationsMouseUp);
  };

  return (
    <section className="recent-destinations">
      <header className="recent-destinations__heading">
        Recent Destinations
      </header>

      {destinationsQueryState.isError ? (
        <div className="recent-destinations__error-container">
          <p className="recent-destinations__error-text">
            Some Error Occurred!
          </p>
          <ButtonAtom variant="filled" onClick={() => getDestinations()}>
            Try Again
          </ButtonAtom>
        </div>
      ) : loader ? (
        <div className="recent-destinations__loading-container">
          <ChevronLeft
            className="recent-destinations__chevron recent-destinations__chevron-left"
            onClick={() => scrollShimmer(-250)}
          />
          <div
            className="recent-destinations__shimmer-container"
            ref={shimmerWrapper}
          >
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <Shimmer
                  key={i}
                  width={300}
                  height={144}
                  className="recent-destinations__shimmer"
                />
              );
            })}
          </div>
          <ChevronRight
            className="recent-destinations__chevron recent-destinations__chevron-right"
            onClick={() => scrollShimmer(+250)}
          />
        </div>
      ) : (
        <div className="recent-destinations__cards-container">
          <ChevronLeft
            className={`recent-destinations__chevron recent-destinations__chevron-left ${
              !leftChevronEnabled
                ? "recent-destinations__chevron--disabled"
                : ""
            }`}
            onClick={() =>
              leftChevronEnabled &&
              destinationsState.recentDestinationsScrollState.items.length >
                0 &&
              scrollDestinations(-250)
            }
          />
          <div className="recent-destinations__cards">
            {destinationsState.recentDestinationsScrollState.items.length <=
            0 ? (
              <div className="recent-destinations__empty">
                <h5>No Destinations</h5>
              </div>
            ) : (
              <>
                <div
                  id="recent-destinations__scroll-container"
                  ref={destinationsWrapper}
                  onMouseDown={onRecentDestinationsMouseDown}
                  onScroll={onRecentDestinationsContainerScroll}
                >
                  <InfiniteScroll
                    dataLength={
                      destinationsState.recentDestinationsScrollState.items
                        .length
                    }
                    hasMore={
                      destinationsState.recentDestinationsScrollState.hasMore
                    }
                    loader={
                      <div className="recent-destinations__scroll-more-loader-container">
                        <Shimmer
                          width={300}
                          height={144}
                          className="recent-destinations__shimmer"
                        />
                      </div>
                    }
                    scrollableTarget={"recent-destinations__scroll-container"}
                    style={{
                      display: "flex",
                      paddingRight: "16px",
                      columnGap: "12px",
                    }}
                    onScroll={onDestinationsScroll}
                  >
                    {[
                      ...destinationsState.recentDestinationsScrollState.items,
                    ].map((v, i) => (
                      <RecentDestinationItems
                        data={v}
                        index={i}
                        key={v.key}
                        getDestinationData={getDestinationData}
                      />
                    ))}
                  </InfiniteScroll>
                </div>
              </>
            )}
          </div>
          <ChevronRight
            className={`recent-destinations__chevron recent-destinations__chevron-right ${
              !rightChevronEnabled
                ? "recent-destinations__chevron--disabled"
                : ""
            }`}
            onClick={() =>
              rightChevronEnabled &&
              destinationsState.recentDestinationsScrollState.items.length >
                0 &&
              scrollDestinations(+250)
            }
          />
        </div>
      )}
    </section>
  );
}

export default RecentDestinations;
