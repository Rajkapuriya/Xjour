import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Shimmer } from "react-shimmer";

import "./FeaturedStories.css";

import { storiesSelector } from "store/reducers/stories";

import ButtonAtom from "components/Atoms/Button/Button";
import Stories from "./Stories/Stories";

function FeaturedStories(props) {
  const { storiesQueryState, getStories } = props;

  const storiesState = useSelector(storiesSelector);

  const [loader, isLoading] = useState(true);

  useEffect(() => {
    if (storiesState.stories.length > 0 || storiesQueryState.isSuccess) {
      isLoading(false);
    }
  }, [storiesQueryState.isSuccess, storiesState.stories.length]);

  return (
    <section className="featured-stories">
      <header className="featured-stories__heading">Featured Stories </header>

      {storiesQueryState.isError ? (
        <div className="featured-stories__error-container">
          <p className="featured-stories__error-text">Some Error Occurred!</p>
          <ButtonAtom variant="filled" onClick={() => getStories()}>
            Try Again
          </ButtonAtom>
        </div>
      ) : loader ? (
        <div className="featured-stories__loading-container">
          <div className="featured-stories__shimmer-container">
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <Shimmer
                  key={i}
                  width={600}
                  height={100}
                  className="featured-stories__shimmer"
                />
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {storiesState.featuredStoriesScrollState.items.length <= 0 ? (
            <div className="featured-stories__empty">
              <h5>No Stories</h5>
            </div>
          ) : (
            <>
              {[...storiesState.featuredStoriesScrollState.items].map(
                (v, i) => (
                  <Stories data={v} index={i} key={v.pk} />
                )
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default FeaturedStories;
