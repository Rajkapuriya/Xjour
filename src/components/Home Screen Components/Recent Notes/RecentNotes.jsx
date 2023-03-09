import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Shimmer } from "react-shimmer";
import InfiniteScroll from "react-infinite-scroll-component";

import "./RecentNotes.css";

import { useStateValue } from "config/context api/StateProvider";

import { notesSelector, setNotesPageNumber } from "store/reducers/notes";
import {
  useGetNotesMutation,
  useLazyRetrieveNotesQuery,
} from "store/endpoints/notes";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import ButtonAtom from "components/Atoms/Button/Button";
import RecentNoteItems from "./Recent note items/RecentNoteItems";

function RecentNotes() {
  const history = useHistory();

  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();

  const storeDispatch = useDispatch();
  const notesState = useSelector(notesSelector);
  console.log(
    "%cnotesState:",
    "background-color:green;color:white;",
    notesState
  );

  const [fetchNotes, notesQueryState] = useLazyRetrieveNotesQuery();
  console.log(
    "%cnotesQueryState:",
    "background-color:purple;color:white;",
    notesQueryState
  );

  const [selectedNotesData, setSelectedNotesData] = useState([]);
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

  const [notesWrapperNode, setNotesWrapperNode] = useState(null);
  const notesWrapper = useCallback(
    (node) => {
      if (node !== null) {
        setNotesWrapperNode(node);
        resizeObserver.observe(node);
      }
    },
    [resizeObserver]
  );
  const firstMount = useRef(true);
  const shimmerWrapper = useRef(null);

  const moveToSelectedNotes = (v, index) => {
    // console.log("vData", v);
    setSelectedNotesData({
      ...selectedNotesData,
      name: v.name,
      pk: v.pk,
      description: v.description,
      searchable: v.searchable,
      index: index,
      base64: v.base64,
      pictureDocumentID: v.pictureDocumentID,
    });

    dispatch({
      type: "SET_NOTES",
      reducerNotes: selectedNotesData,
    });
    history.push(`/destinations/selected-notes/${v.pk}`);

    // console.log("selectedNotesData", selectedNotesData);
  };

  useEffect(() => {
    if (notesState.notes.length > 0 || notesQueryState.isSuccess) {
      isLoading(false);
    }
  }, [notesQueryState.isSuccess, notesState.notes.length]);

  useEffect(() => {
    if (!firstMount.current) {
      fetchNotes({
        token: userToken,
        visitorID: reducerVisitorID,
      });
    }
  }, [notesState.notesPageNumber, reducerVisitorID, userToken, fetchNotes]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (notesState.notes.length === 0) {
        fetchNotes({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [reducerVisitorID, userToken, fetchNotes, notesState.notes.length]);

  useEffect(() => {
    if (notesState.notes.length > 0) {
      if (notesWrapperNode) {
        if (
          notesWrapperNode.scrollWidth - notesWrapperNode.scrollLeft >
          notesWrapperNode.clientWidth
        ) {
          setRightChevronEnabled(true);
        } else {
          setRightChevronEnabled(false);
        }
      }
    }
  }, [notesState.notes.length, notesWrapperNode]);

  const onRecentNotesContainerScroll = (event) => {
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
  const scrollNotes = (scrollOffset) => {
    notesWrapperNode.scrollLeft += scrollOffset;
  };
  const scrollShimmer = (scrollOffset) => {
    shimmerWrapper.current.scrollLeft += scrollOffset;
  };

  const showNextRecentNotes = () => {
    storeDispatch(setNotesPageNumber(notesState.notesPageNumber + 1));
  };

  const onNotesScroll = (event) => {
    if (
      notesState.recentNotesScrollState.hasMore &&
      !notesQueryState.isFetching
    ) {
      const totalWidthOfContent = event.target.scrollWidth;
      const clientWidthOfContainer = event.target.clientWidth;
      const scrollOffset = event.target.scrollLeft;

      const threshold =
        totalWidthOfContent - clientWidthOfContainer - scrollOffset;

      if (threshold < 250) {
        showNextRecentNotes();
      }
    }
  };

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const onRecentNotesMouseMove = (event) => {
    const dx = event.clientX - pos.x;
    const dy = event.clientY - pos.y;

    const element = notesWrapperNode;
    element.scrollTop = pos.top - dy;
    element.scrollLeft = pos.left - dx;
  };

  const onRecentNotesMouseUp = (event) => {
    const element = notesWrapperNode;
    element.style.cursor = "grab";
    element.style.removeProperty("user-select");

    document.removeEventListener("mousemove", onRecentNotesMouseMove);
    document.removeEventListener("mouseup", onRecentNotesMouseUp);
  };

  const onRecentNotesMouseDown = (event) => {
    const element = notesWrapperNode;
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";

    pos = {
      left: element.scrollLeft,
      top: element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener("mousemove", onRecentNotesMouseMove);
    document.addEventListener("mouseup", onRecentNotesMouseUp);
  };

  return (
    <section className="recent-notes">
      <header className="recent-notes__heading">Recent Notes</header>

      {notesQueryState.isError ? (
        <div className="recent-notes__error-container">
          <p className="recent-notes__error-text">Some Error Occurred!</p>
          <ButtonAtom variant="filled" onClick={() => fetchNotes()}>
            Try Again
          </ButtonAtom>
        </div>
      ) : loader ? (
        <div className="recent-notes__loading-container">
          <ChevronLeft
            className="recent-notes__chevron recent-notes__chevron-left"
            onClick={() => scrollShimmer(-250)}
          />
          <div className="recent-notes__shimmer-container" ref={shimmerWrapper}>
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <Shimmer
                  key={i}
                  width={300}
                  height={144}
                  className="recent-notes__shimmer"
                />
              );
            })}
          </div>
          <ChevronRight
            className="recent-notes__chevron recent-notes__chevron-right"
            onClick={() => scrollShimmer(+250)}
          />
        </div>
      ) : (
        <div className="recent-notes__cards-container">
          <ChevronLeft
            className={`recent-notes__chevron recent-notes__chevron-left ${
              !leftChevronEnabled ? "recent-notes__chevron--disabled" : ""
            }`}
            onClick={() =>
              leftChevronEnabled &&
              notesState.recentNotesScrollState.items.length > 0 &&
              scrollNotes(-250)
            }
          />
          <div className="recent-notes__cards">
            {notesState.recentNotesScrollState.items.length <= 0 ? (
              <div className="recent-notes__empty">
                <h5>No Notes</h5>
              </div>
            ) : (
              <div
                id="recent-notes__scroll-container"
                ref={notesWrapper}
                onMouseDown={onRecentNotesMouseDown}
                onScroll={onRecentNotesContainerScroll}
              >
                <InfiniteScroll
                  dataLength={notesState.recentNotesScrollState.items.length}
                  hasMore={notesState.recentNotesScrollState.hasMore}
                  loader={
                    <div className="recent-notes__scroll-more-loader-container">
                      <Shimmer
                        width={300}
                        height={144}
                        className="recent-notes__shimmer"
                      />
                    </div>
                  }
                  scrollableTarget={"recent-notes__scroll-container"}
                  style={{
                    display: "flex",
                    paddingRight: "16px",
                    columnGap: "12px",
                  }}
                  onScroll={onNotesScroll}
                >
                  {[...notesState.recentNotesScrollState.items].map((v, i) => (
                    <RecentNoteItems
                      key={v.pk}
                      data={v}
                      index={i}
                      moveToSelectedNotes={moveToSelectedNotes}
                    />
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
          <ChevronRight
            className={`recent-notes__chevron recent-notes__chevron-right ${
              !rightChevronEnabled ? "recent-notes__chevron--disabled" : ""
            }`}
            onClick={() =>
              rightChevronEnabled &&
              notesState.recentNotesScrollState.items.length > 0 &&
              scrollNotes(+250)
            }
          />
        </div>
      )}
    </section>
  );
}

export default RecentNotes;
