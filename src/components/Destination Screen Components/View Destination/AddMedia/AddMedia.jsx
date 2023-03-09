import { useSelector } from "react-redux";
import { Shimmer } from "react-shimmer";

import "./AddMedia.css";

import { useStateValue } from "config/context api/StateProvider";

import { destinationsSelector } from "store/reducers/destinations";
import { memoriesSelector } from "store/reducers/memories";
import { useGetMemoriesQuery } from "store/endpoints/memories";

import { Check } from "@mui/icons-material";

import MediaGallery from "components/Sidebar Group Buttons/Media Gallery/MediaGallery";

export default function AddMedia(props) {
  const { setImageToAdd } = props;

  const [{ userToken, reducerVisitorID }] = useStateValue();

  const destinationsState = useSelector(destinationsSelector);
  const memoriesState = useSelector(memoriesSelector);
  const getMemoriesQueryState = useGetMemoriesQuery({
    token: userToken,
    visitorID: reducerVisitorID,
  });

  const checkMediaAlreadyInDestination = (media) => {
    return Boolean(
      destinationsState.singleDestinationsData[
        destinationsState.selectedSingleDestination.key
      ].mediaData.find((localMedia) => localMedia.docKey === media.documentId)
    );
  };

  return (
    <div className="view-destination__add-media">
      <div className="view-destination__add-media-items">
        {getMemoriesQueryState.isFetching ? (
          Array.from({ length: 6 }).map((v, i) => {
            return (
              <Shimmer
                width={130}
                height={130}
                className="view-destination__add-media-shimmer"
              />
            );
          })
        ) : getMemoriesQueryState.isError ? (
          <p>{getMemoriesQueryState.error}</p>
        ) : memoriesState.memoryImages.length === 0 ? (
          <p>No Media</p>
        ) : (
          memoriesState.memoryImages.map((memoryImage) => {
            return (
              <div className="view-destination__add-media-image-container">
                <div
                  className="view-destination__add-media-card-container"
                  onClick={() => setImageToAdd(memoryImage)}
                >
                  <MediaGallery data={memoryImage} />
                </div>

                {checkMediaAlreadyInDestination(memoryImage) && (
                  <div className="view-destination__add-media-image-overlay">
                    <Check className="view-destination__add-media-check-icon" />
                  </div>
                )}
              </div>
              // <img
              //   src={memoryImage.image}
              //   alt="Memory"
              //   className="view-destination__add-media-image"
              //   onClick={() => setImageToAdd(memoryImage)}
              // />
            );
          })
        )}
      </div>
    </div>
  );
}
