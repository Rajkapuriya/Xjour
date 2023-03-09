import { useState } from "react";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Shimmer } from "react-shimmer";
import InfiniteScroll from "react-infinite-scroll-component";

import "./AddMedia.css";

import { useStateValue } from "config/context api/StateProvider";

import { destinationsSelector } from "store/reducers/destinations";
import {
  memoriesSelector,
  setMemoriesPageNumber,
} from "store/reducers/memories";
import { useGetMemoriesQuery } from "store/endpoints/memories";

import { Check } from "@mui/icons-material";
import GetAppIcon from "@mui/icons-material/GetApp";

import MediaGallery from "components/Sidebar Group Buttons/Media Gallery/MediaGallery";
import { Oval } from "react-loader-spinner";

export default function AddMedia(props) {
  const { setImageToAdd } = props;

  const storeDispatch = useDispatch();
  const location = useLocation();
  const isOnViewSingleDestinationPage =
    location.pathname.includes("view-destination");

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const memoriesState = useSelector(memoriesSelector);
  const getMemoriesQueryState = useGetMemoriesQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });
  console.log(
    "%cmemoriesState:",
    "background-color:blue;color:white;",
    memoriesState
  );
  console.log(
    "%cgetMemoriesQueryState:",
    "background-color:darkmagenta;color:white;",
    getMemoriesQueryState
  );

  const [isFetchMoreButtonEnabled, setIsFetchMoreButtonEnabled] =
    useState(false);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver((entries) => {
      const scrollContainer = document.getElementById(
        "destination__add-media-scroll-container"
      );
      const infiniteScrollDiv = document.getElementsByClassName(
        "destination__add-media-infinite-scroll"
      )[0];

      if (infiniteScrollDiv.clientWidth < scrollContainer.clientWidth) {
        setIsFetchMoreButtonEnabled(true);
      } else {
        setIsFetchMoreButtonEnabled(false);
      }
    });
  }, []);
  const memoriesWrapper = useCallback(
    (node) => {
      const infiniteScrollDiv = document.getElementsByClassName(
        "destination__add-media-infinite-scroll"
      )[0];

      const scrollContainer = document.getElementById(
        "destination__add-media-scroll-container"
      );

      if (infiniteScrollDiv.clientWidth < scrollContainer.clientWidth) {
        setIsFetchMoreButtonEnabled(true);
      }

      resizeObserver.observe(scrollContainer);
      resizeObserver.observe(infiniteScrollDiv);
    },
    [resizeObserver]
  );

  const renderMedia = useMemo(() => {
    const checkMediaAlreadyInDestination = (media) => {
      return Boolean(
        destinationsState.singleDestinationsData[
          destinationsState.selectedSingleDestination.key
        ]?.mediaData?.find(
          (localMedia) => localMedia.docKey === media.documentId
        )
      );
    };

    const fetchNextMedia = () => {
      storeDispatch(
        setMemoriesPageNumber(memoriesState.memoriesPageNumber + 1)
      );

      getMemoriesQueryState.refetch();
    };

    const onMediaScroll = (event) => {
      if (
        memoriesState.memoriesScrollState.hasMore &&
        !getMemoriesQueryState.isFetching
      ) {
        const totalWidthOfContent = event.target.scrollWidth;
        const clientWidthOfContainer = event.target.clientWidth;
        const scrollOffset = event.target.scrollLeft;

        const threshold =
          totalWidthOfContent - clientWidthOfContainer - scrollOffset;

        if (threshold < 200) {
          fetchNextMedia();
        }
      }
    };

    return (
      <>
        {isFetchMoreButtonEnabled && (
          <div className="destination__add-media-upper">
            <div
              className="destination__add-media-fetch-more-button-container"
              onClick={() =>
                getMemoriesQueryState.isFetching ? null : fetchNextMedia()
              }
            >
              {getMemoriesQueryState.isFetching ? (
                <Oval color="#00BFFF" />
              ) : (
                <>
                  <GetAppIcon className="destination__add-media-fetch-more-icon" />
                  <p className="destination__add-media-fetch-more-text">
                    Fetch More
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        <div id="destination__add-media-scroll-container">
          <InfiniteScroll
            className="destination__add-media-infinite-scroll"
            ref={memoriesWrapper}
            dataLength={memoriesState.memoriesScrollState.items.length}
            hasMore={memoriesState.memoriesScrollState.hasMore}
            loader={
              <div className="destination__add-media-scroll-more-loader-container">
                <Shimmer
                  width={130}
                  height={130}
                  className="destination__add-media-shimmer"
                />
              </div>
            }
            scrollableTarget={"destination__add-media-scroll-container"}
            style={{
              display: "flex",
              paddingRight: "16px",
              columnGap: "12px",
            }}
            endMessage={<b style={{ color: "white" }}>You are at the end!</b>}
            onScroll={onMediaScroll}
          >
            {memoriesState.memoriesScrollState.items.map((memoryImage) => {
              return (
                <div className="destination__add-media-image-container">
                  <div
                    className="destination__add-media-card-container"
                    onClick={() => setImageToAdd(memoryImage)}
                  >
                    <MediaGallery data={memoryImage} />
                  </div>

                  {isOnViewSingleDestinationPage &&
                    checkMediaAlreadyInDestination(memoryImage) && (
                      <div className="destination__add-media-image-overlay">
                        <Check className="destination__add-media-check-icon" />
                      </div>
                    )}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </>
    );
  }, [
    destinationsState.selectedSingleDestination.key,
    destinationsState.singleDestinationsData,
    getMemoriesQueryState,
    isFetchMoreButtonEnabled,
    isOnViewSingleDestinationPage,
    memoriesState.memoriesPageNumber,
    memoriesState.memoriesScrollState.hasMore,
    memoriesState.memoriesScrollState.items,
    memoriesWrapper,
    setImageToAdd,
    storeDispatch,
  ]);

  return (
    <div className="destination__add-media">
      {getMemoriesQueryState.isLoading ? (
        <div className="destination__add-media-shimmers-container">
          {Array.from({ length: 10 }).map((v, i) => {
            return (
              <Shimmer
                width={130}
                height={130}
                className="destination__add-media-shimmer"
              />
            );
          })}
        </div>
      ) : getMemoriesQueryState.isError ? (
        <p className="destination__add-media-error">
          {getMemoriesQueryState.error}
        </p>
      ) : memoriesState.memoryImages.length === 0 ? (
        <p className="destination__add-media-no-media">No Media</p>
      ) : (
        <div className="destination__add-media-items">{renderMedia}</div>
      )}
    </div>
  );
}
