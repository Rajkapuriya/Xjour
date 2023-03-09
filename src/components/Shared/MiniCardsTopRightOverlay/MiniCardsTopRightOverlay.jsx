import { useState } from "react";

import "./MiniCardsTopRightOverlay.css";

import { MoreVert } from "@mui/icons-material";

export default function MiniCardsTopRightOverlay(props) {
  const {
    onRemoveClickHandler,
    onViewDetailsClickHandler,
    onAddToJourneyClickHandler,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`mini-cards-top-right-overlay mini-cards-top-right-overlay--${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >
      <div
        className="mini-cards-top-right-overlay__more-vert-icon-container"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <MoreVert className="mini-cards-top-right-overlay__more-vert-icon" />
      </div>

      {isExpanded && (
        <>
          <div></div>
          <p
            className="mini-cards-top-right-overlay__action"
            onClick={onRemoveClickHandler}
          >
            Remove
          </p>
          <p className="mini-cards-top-right-overlay__action">View Details</p>
          <p className="mini-cards-top-right-overlay__action">Add To Journey</p>
        </>
      )}
    </div>
  );
}
