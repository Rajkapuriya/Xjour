import React from "react";

import "./RecentNoteItems.css";

import ImagePlaceholder from "assets/images/image-placeholder.jpg";

function RecentNoteItems({ data, index, moveToSelectedNotes }) {
  return (
    <div
      className="recent-note-items"
      onClick={() => moveToSelectedNotes(data, index)}
    >
      <div className="recent-note-items__content-container">
        <p className="recent-note-items__title">{data.name}</p>
        <p className="recent-notes-items__description">
          {data?.description || "-"}
        </p>
      </div>

      {data?.base64 ? (
        <div
          className="recent-note-items__image-container"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${data.base64})`,
            backgroundPosition: "center",
          }}
        ></div>
      ) : (
        <img
          src={ImagePlaceholder}
          alt="Recent note placeholder"
          className="recent-note-items__image"
        />
      )}
    </div>
  );
}

export default RecentNoteItems;
