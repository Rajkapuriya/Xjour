import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Shimmer } from "react-shimmer";

import "./PostCards.css";

import { useStateValue } from "config/context api/StateProvider";

import {
  postcardsSelector,
  setPostcardsPageNumber,
  setPostcardsScrollState,
} from "store/reducers/postcards";
import { useLazyGetPostcardsQuery } from "store/endpoints/postcards";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import ButtonAtom from "components/Atoms/Button/Button";
import PostCardItems from "./PostCards items/PostCardItems";

function PostCards(props) {
  const {
    postCardWrapper,
    postCardWrapperNode,
    leftChevronEnabled,
    setLeftChevronEnabled,
    rightChevronEnabled,
    setRightChevronEnabled,
  } = props;

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const postcardsState = useSelector(postcardsSelector);
  console.log(
    "%cpostcardsState:",
    "background-color:blue;color:white;",
    postcardsState
  );

  const [getPostcards, postcardsQueryState] = useLazyGetPostcardsQuery();
  console.log(
    "%cpostcardsQueryState:",
    "background-color:brown;color:white;",
    postcardsQueryState
  );

  const [loader, isLoading] = useState(true);

  const shimmerWrapper = useRef(null);
  const firstMount = useRef(true);

  useEffect(() => {
    if (postcardsState.postcards.length > 0 || postcardsQueryState.isSuccess) {
      isLoading(false);
    }
  }, [postcardsQueryState.isSuccess, postcardsState.postcards.length]);

  // useEffect(() => {
  //   if (!firstMount.current) {
  //     getPostcards({
  //       token: userToken,
  //       visitorID: reducerVisitorID,
  //     });
  //   }
  // }, [
  //   postcardsState.postcardsPageNumber,
  //   reducerVisitorID,
  //   userToken,
  //   getPostcards,
  // ]);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      if (postcardsState.postcards.length === 0) {
        getPostcards({
          token: userToken,
          visitorID: reducerVisitorID,
        });
      }
    }
  }, [
    reducerVisitorID,
    userToken,
    getPostcards,
    postcardsState.postcards.length,
  ]);

  useEffect(() => {
    if (postcardsState.postcards.length > 0) {
      if (postCardWrapperNode) {
        if (
          postCardWrapperNode.scrollWidth - postCardWrapperNode.scrollLeft >
          postCardWrapperNode.clientWidth
        ) {
          setRightChevronEnabled(true);
        } else {
          setRightChevronEnabled(false);
        }
      }
    }
  }, [
    postCardWrapperNode,
    postcardsState.postcards.length,
    setRightChevronEnabled,
  ]);

  const showNextPostcards = () => {
    getPostcards({
      token: userToken,
      visitorID: reducerVisitorID,
    });

    // dispatch(setPostcardsPageNumber(postcardsState.postcardsPageNumber + 1));
  };

  const onPostCardsContainerScroll = (event) => {
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

  const scrollPostcards = (scrollOffset) => {
    postCardWrapperNode.scrollLeft += scrollOffset;
  };
  const scrollShimmer = (scrollOffset) => {
    shimmerWrapper.current.scrollLeft += scrollOffset;
  };

  const onPostcardsScroll = (event) => {
    if (
      postcardsState.postcardsScrollState.hasMore &&
      !postcardsQueryState.isFetching
    ) {
      const totalWidthOfContent = event.target.scrollWidth;
      const clientWidthOfContainer = event.target.clientWidth;
      const scrollOffset = event.target.scrollLeft;

      const threshold =
        totalWidthOfContent - clientWidthOfContainer - scrollOffset;

      if (threshold < 250) {
        showNextPostcards();
      }
    }
  };

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const onPostCardsMouseMove = (event) => {
    const dx = event.clientX - pos.x;
    const dy = event.clientY - pos.y;

    const element = postCardWrapperNode;
    element.scrollTop = pos.top - dy;
    element.scrollLeft = pos.left - dx;
  };

  const onPostCardsMouseUp = (event) => {
    const element = postCardWrapperNode;
    element.style.cursor = "grab";
    element.style.removeProperty("user-select");

    document.removeEventListener("mousemove", onPostCardsMouseMove);
    document.removeEventListener("mouseup", onPostCardsMouseUp);
  };

  const onPostCardsMouseDown = (event) => {
    const element = postCardWrapperNode;
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";

    pos = {
      left: element.scrollLeft,
      top: element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener("mousemove", onPostCardsMouseMove);
    document.addEventListener("mouseup", onPostCardsMouseUp);
  };

  return (
    <section className="post-cards">
      <header className="post-cards__heading">Postcards</header>

      {postcardsQueryState.isError ? (
        <div className="post-cards__error-container">
          <p className="post-cards__error-text">Some Error Occurred!</p>
          <ButtonAtom variant="filled" onClick={() => getPostcards()}>
            Try Again
          </ButtonAtom>
        </div>
      ) : loader ? (
        <div className="post-cards__loading-container">
          <ChevronLeft
            className="post-cards__chevron post-cards__chevron-left"
            onClick={() => scrollShimmer(-250)}
          />
          <div className="post-cards__shimmer-container" ref={shimmerWrapper}>
            {Array.from({ length: 8 }).map((_, i) => {
              return (
                <Shimmer
                  key={i}
                  width={144}
                  height={144}
                  className="post-cards__shimmer"
                />
              );
            })}
          </div>
          <ChevronRight
            className="post-cards__chevron post-cards__chevron-right"
            onClick={() => scrollShimmer(+250)}
          />
        </div>
      ) : (
        <div className="post-cards__cards-container">
          <ChevronLeft
            className={`post-cards__chevron post-cards__chevron-left ${
              !leftChevronEnabled ? "post-cards__chevron--disabled" : ""
            }`}
            onClick={() =>
              leftChevronEnabled &&
              postcardsState.postcardsScrollState.items.length > 0 &&
              scrollPostcards(-250)
            }
          />
          <div className="post-cards__cards">
            {postcardsState.postcardsScrollState.items.length <= 0 ? (
              <div className="post-cards__empty">
                <h5>No Postcards</h5>
              </div>
            ) : (
              <div
                id="post-cards__scroll-container"
                ref={postCardWrapper}
                onMouseDown={onPostCardsMouseDown}
                onScroll={onPostCardsContainerScroll}
              >
                <InfiniteScroll
                  dataLength={postcardsState.postcardsScrollState.items.length}
                  hasMore={postcardsState.postcardsScrollState.hasMore}
                  loader={
                    <div className="post-cards__scroll-more-loader-container">
                      <Shimmer
                        width={144}
                        height={144}
                        className="post-cards__shimmer"
                      />
                    </div>
                  }
                  scrollableTarget={"post-cards__scroll-container"}
                  style={{
                    display: "flex",
                    paddingRight: "16px",
                    columnGap: "12px",
                  }}
                  onScroll={onPostcardsScroll}
                >
                  {[...postcardsState.postcardsScrollState.items].map(
                    (v, i) => (
                      <PostCardItems
                        key={v.pk}
                        image={v.base64}
                        title={v.name}
                        description={v.description}
                        data={v}
                        index={i}
                      />
                    )
                  )}
                </InfiniteScroll>
              </div>
            )}
          </div>
          <ChevronRight
            className={`post-cards__chevron post-cards__chevron-right ${
              !rightChevronEnabled ? "post-cards__chevron--disabled" : ""
            }`}
            onClick={() =>
              rightChevronEnabled &&
              postcardsState.postcardsScrollState.items.length > 0 &&
              scrollPostcards(+250)
            }
          />
        </div>
      )}
    </section>
  );
}

export default PostCards;
