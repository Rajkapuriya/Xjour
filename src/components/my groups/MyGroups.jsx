import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Shimmer } from "react-shimmer";
import InfiniteScroll from "react-infinite-scroll-component";

import "./MyGroups.css";

import { useStateValue } from "config/context api/StateProvider";

import {
  metaGroupsSelector,
  setMetaGroupsPageNumber,
} from "store/reducers/metaGroups";
import { useLazyGetMetaGroupsQuery } from "store/endpoints/metagroups";

import GroupLists from "./group lists/GroupLists";

import { MuiAccordion } from "../MuiComponents/MuiComponents";

function MyGroups({ getGroupData }) {
  const [{ userToken, reducerVisitorID }] = useStateValue();

  const dispatch = useDispatch();
  const metaGroupsState = useSelector(metaGroupsSelector);
  console.log(
    "%cmetaGroupsState:",
    "background-color:aquamarine;",
    metaGroupsState
  );

  const [getMetaGroups, metaGroupsQueryState] = useLazyGetMetaGroupsQuery();
  console.log(
    "%cmetaGroupsQueryState:",
    "background-color:cadetblue;color:white;",
    metaGroupsQueryState
  );

  const firstMount = useRef(true);

  const [loader, isLoading] = useState(true);
  const [myGroupsExpanded, setMyGroupsExpanded] = useState(true);

  useEffect(() => {
    if (
      metaGroupsState.metaGroups.length > 0 ||
      metaGroupsQueryState.isSuccess
    ) {
      isLoading(false);
    }
  }, [metaGroupsQueryState.isSuccess, metaGroupsState.metaGroups.length]);

  useEffect(() => {
    if (!firstMount.current) {
      getMetaGroups({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [
    metaGroupsState.metaGroupsPageNumber,
    getMetaGroups,
    reducerVisitorID,
    userToken,
  ]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (metaGroupsState.metaGroups.length === 0) {
        getMetaGroups({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [
    getMetaGroups,
    reducerVisitorID,
    userToken,
    metaGroupsState.metaGroups.length,
  ]);

  const showNextMetaGroups = () => {
    dispatch(setMetaGroupsPageNumber(metaGroupsState.metaGroupsPageNumber + 1));
  };

  const onMyGroupsScroll = (event) => {
    if (
      metaGroupsState.metaGroupsScrollState.hasMore &&
      !metaGroupsQueryState.isFetching
    ) {
      const totalHeightOfContainer = event.target.scrollHeight;
      const clientHeightContainer = event.target.clientHeight;
      const scrollOffset = event.target.scrollTop;

      const threshold =
        totalHeightOfContainer - clientHeightContainer - scrollOffset;

      if (threshold < 200) {
        showNextMetaGroups();
      }
    }
  };

  return (
    <div className="my-groups">
      <MuiAccordion
        expanded={myGroupsExpanded}
        handlers={{
          handleAccordionExpansion: () => setMyGroupsExpanded((prev) => !prev),
        }}
        accordionHeading="My Groups"
        hasCustomSummary
        additionalAccordionProps={{
          className: "my-groups__accordion",
        }}
        additionalAccordionSummaryProps={{
          className: "my-groups__expandable-header",
        }}
        additionalAccordionDetailsProps={{
          className: "my-groups__accordion-details",
        }}
      >
        {loader ? (
          <div className="my-groups__loading-container">
            <div className="my-groups__shimmer-container">
              {Array.from({ length: 4 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={220}
                    height={50}
                    className="my-groups__shimmer"
                  />
                );
              })}
            </div>
          </div>
        ) : metaGroupsState.metaGroupsScrollState.items.length <= 0 ? (
          <div className="my-groups__empty">
            <h5>No Groups</h5>
          </div>
        ) : (
          <div className="my-groups__scroll-container">
            <InfiniteScroll
              dataLength={metaGroupsState.metaGroupsScrollState.items.length}
              hasMore={metaGroupsState.metaGroupsScrollState.hasMore}
              loader={
                <div className="my-groups__scroll-more-loader-container">
                  <Shimmer
                    width={220}
                    height={50}
                    className="my-groups__shimmer"
                  />
                </div>
              }
              height={"30vh"}
              onScroll={onMyGroupsScroll}
              scrollableTarget="my-groups__scroll-container"
              className="my-groups__infinite-scroll"
            >
              {[...metaGroupsState.metaGroupsScrollState.items].map((v, i) => (
                <div className="my-groups__group-lists" key={v.key}>
                  <GroupLists data={v} index={i} getGroupData={getGroupData} />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        )}
      </MuiAccordion>
    </div>
  );
}

export default MyGroups;
