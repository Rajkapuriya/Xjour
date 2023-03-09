import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Shimmer } from "react-shimmer";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./OtherGroups.css";

import { useStateValue } from "config/context api/StateProvider";

import {
  otherGroupsSelector,
  setOtherGroupsPageNumber,
} from "store/reducers/otherGroups";
import { useLazyGetOtherGroupsQuery } from "store/endpoints/memberManagement";

import { Box, Modal } from "@mui/material";

import { MuiAccordion } from "../MuiComponents/MuiComponents";

import OtherGroupLists from "./other group lists/OtherGroupLists";
import MessageBox from "../Selected Group Component/Group Members/MessageBox/MessageBox";
// import { Box } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "#f8f8f8",
  border: "none",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function OtherGroups({ getGroupData }) {
  let { groupKey } = useParams();

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const dispatch = useDispatch();
  const otherGroupsState = useSelector(otherGroupsSelector);
  console.log(
    "%cotherGroupsState:",
    "background-color:darkturquoise;",
    otherGroupsState
  );

  const [getOtherGroups, otherGroupsQueryState] = useLazyGetOtherGroupsQuery();
  console.log(
    "%cotherGroupsQueryState:",
    "background-color:darkkhaki;",
    otherGroupsQueryState
  );

  const firstMount = useRef(true);

  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState([]);
  const [clickedGroupData, setClickedGroupData] = useState([]);
  const [getData, setGetData] = useState(false);
  const [loader, isLoading] = useState(true);
  const [otherGroupsExpanded, setOtherGroupsExpanded] = useState(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    // console.log("Group Key", groupKey);
  };
  // console.log("reducerOtherGroup", reducerOtherGroup);

  useEffect(() => {
    if (otherGroupsState.otherGroups.length > 0) {
      isLoading(false);
    }
  }, [otherGroupsState.otherGroups.length]);

  useEffect(() => {
    if (!firstMount.current) {
      getOtherGroups({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [
    otherGroupsState.otherGroupsPageNumber,
    reducerVisitorID,
    userToken,
    getOtherGroups,
  ]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (otherGroupsState.otherGroups.length === 0) {
        getOtherGroups({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [
    reducerVisitorID,
    userToken,
    otherGroupsState.otherGroups.length,
    getOtherGroups,
  ]);

  const showNextOtherGroups = () => {
    dispatch(
      setOtherGroupsPageNumber(otherGroupsState.otherGroupsPageNumber + 1)
    );
  };

  const onOtherGroupsScroll = (event) => {
    if (
      otherGroupsState.otherGroupsScrollState.hasMore &&
      !otherGroupsQueryState.isFetching
    ) {
      const totalHeightOfContainer = event.target.scrollHeight;
      const clientHeightContainer = event.target.clientHeight;
      const scrollOffset = event.target.scrollTop;

      const threshold =
        totalHeightOfContainer - clientHeightContainer - scrollOffset;

      if (threshold < 200) {
        showNextOtherGroups();
      }
    }
  };

  const getValue = (data, index) => {
    if (data.base64 !== null && data.countrySvg !== null) {
      // console.log("groupData", data, index);
      setClickedGroupData({
        name: data.name,
        description: data.description,
        base64: data.base64,
        countrySvg: data.countrySvg,
        key: data.key,
        index: index,
      });
      setGetData(true);
    }
  };

  useEffect(() => {
    if (getData) {
      setGetData(false);
      // console.log("UseEffect triggered");
      handleOpen();
    }
  }, [getData]);

  return (
    <div className="other-groups">
      <MuiAccordion
        expanded={otherGroupsExpanded}
        handlers={{
          handleAccordionExpansion: () =>
            setOtherGroupsExpanded((prev) => !prev),
        }}
        accordionHeading="Other Groups"
        hasCustomSummary
        additionalAccordionProps={{
          className: "other-groups__accordion",
        }}
        additionalAccordionSummaryProps={{
          className: "other-groups__expandable-header",
        }}
        additionalAccordionDetailsProps={{
          className: "other-groups__accordion-details",
        }}
      >
        {loader ? (
          <div className="other-groups__loading-container">
            <div className="other-groups__shimmer-container">
              {Array.from({ length: 4 }).map((_, i) => {
                return (
                  <Shimmer
                    key={i}
                    width={220}
                    height={50}
                    className="other-groups__shimmer"
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {otherGroupsState.otherGroupsScrollState.items <= 0 ? (
              <div className="groupLists__msg">
                <h5>No Groups</h5>
              </div>
            ) : (
              <>
                <div className="other-groups__scroll-container">
                  <InfiniteScroll
                    dataLength={
                      otherGroupsState.otherGroupsScrollState.items.length
                    }
                    hasMore={otherGroupsState.otherGroupsScrollState.hasMore}
                    loader={
                      <div className="other-groups__scroll-more-loader-container">
                        <Shimmer
                          width={220}
                          height={50}
                          className="other-groups__shimmer"
                        />
                      </div>
                    }
                    height={"30vh"}
                    onScroll={onOtherGroupsScroll}
                    scrollableTarget="other-groups__scroll-container"
                    className="other-groups__infinite-scroll"
                  >
                    {[...otherGroupsState.otherGroupsScrollState.items].map(
                      (v, i) => (
                        <div className="other-groups__group-lists" key={v.key}>
                          <OtherGroupLists
                            data={v}
                            index={i}
                            getValue={getValue}
                            loader={loader}
                            groupKey={groupKey}
                          />
                        </div>
                      )
                    )}
                  </InfiniteScroll>
                </div>
              </>
            )}
          </>
        )}
      </MuiAccordion>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MessageBox
            data={clickedGroupData}
            index={clickedGroupData.index}
            handleClose={handleClose}
            selectedGroupKey={groupKey}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default OtherGroups;
