import { useState } from "react";

import "./AddOverlay.css";

import {
  ArrowBackIosNew,
  FlashOn,
  Close,
  Message,
  Collections,
  LocalAirport,
} from "@mui/icons-material";

export default function AddOverlay(props) {
  const {
    isOpen,
    closeHandler,
    includeAddMedia,
    includeAddDestination,
    includeAddConnection,
    includeAddActivity,
    addMediaContent,
    addDestinationContent,
    addConnectionContent,
    addActivityContent,
  } = props;

  const [selectedAddOverlayToShow, setSelectedOverlayToShow] = useState("");

  const setOverlayToShow = (overlayType) => {
    setSelectedOverlayToShow(overlayType);
  };

  return (
    <div
      className={`add-overlay add-overlay--${isOpen ? "visible" : "hidden"}`}
    >
      {selectedAddOverlayToShow && (
        <header className="add-overlay__header">
          <ArrowBackIosNew
            className="add-overlay__back-icon"
            onClick={() => setSelectedOverlayToShow("")}
          />
        </header>
      )}

      <div className="add-overlay__options">
        {includeAddMedia &&
          (!selectedAddOverlayToShow ||
            selectedAddOverlayToShow === "media") && (
            <AddMedia
              showContent={selectedAddOverlayToShow === "media"}
              renderContent={() => setOverlayToShow("media")}
              addMediaContent={addMediaContent}
            />
          )}

        {includeAddDestination &&
          (!selectedAddOverlayToShow ||
            selectedAddOverlayToShow === "destination") && (
            <AddDestination
              showContent={selectedAddOverlayToShow === "destination"}
              renderContent={() => setOverlayToShow("destination")}
              addDestinationContent={addDestinationContent}
            />
          )}

        {includeAddConnection &&
          (!selectedAddOverlayToShow ||
            selectedAddOverlayToShow === "connection") && (
            <AddConnection
              showContent={selectedAddOverlayToShow === "connection"}
              renderContent={() => setOverlayToShow("connection")}
              addConnectionContent={addConnectionContent}
            />
          )}

        {includeAddActivity &&
          (!selectedAddOverlayToShow ||
            selectedAddOverlayToShow === "activity") && (
            <AddActivity
              showContent={selectedAddOverlayToShow === "activity"}
              renderContent={() => setOverlayToShow("activity")}
              addActivityContent={addActivityContent}
            />
          )}
      </div>

      <footer className="add-overlay__footer">
        <Close onClick={closeHandler} className="add-overlay__close-button" />
      </footer>
    </div>
  );
}

function AddMedia(props) {
  const { showContent, renderContent, addMediaContent } = props;

  return (
    <div className="add-media" onClick={() => renderContent()}>
      {!showContent && (
        <div className="add-media__option">
          <Collections className="add-media__icon" />
          <p className="add-media__option-text">ADD MEDIA</p>
        </div>
      )}

      {showContent && addMediaContent}
    </div>
  );
}

function AddDestination(props) {
  const { showContent, renderContent, addDestinationContent } = props;

  return (
    <div className="add-destination" onClick={() => renderContent()}>
      {!showContent && (
        <div className="add-destination__option">
          <LocalAirport className="add-destination__icon" />
          <p className="add-destination__option-text">ADD DESTINATION</p>
        </div>
      )}

      {showContent && addDestinationContent}
    </div>
  );
}

function AddConnection(props) {
  const { showContent, renderContent, addConnectionContent } = props;

  return (
    <div className="add-connection" onClick={() => renderContent()}>
      {!showContent && (
        <div className="add-connection__option">
          <Message className="add-connection__icon" />
          <p className="add-connection__option-text">ADD CONNECTION</p>
        </div>
      )}

      {showContent && addConnectionContent}
    </div>
  );
}

function AddActivity(props) {
  const { showContent, renderContent, addActivityContent } = props;

  return (
    <div className="add-activity" onClick={() => renderContent()}>
      {!showContent && (
        <div className="add-activity__option">
          <FlashOn className="add-activity__icon" />
          <p className="add-activity__option-text">ADD ACTIVITY</p>
        </div>
      )}

      {showContent && addActivityContent}
    </div>
  );
}
