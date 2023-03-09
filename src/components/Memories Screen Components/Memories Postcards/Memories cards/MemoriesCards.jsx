import React from "react";
import "./MemoriesCards.css";
import ImageBoxImages from "../../Memories Imags/ImageBox/ImageBox Images/ImageBoxImages";

function MemoriesCards({ images, videos }) {
  return (
    <div className="memoriesCards">
      <div className="memoriesCards__body">
        {images.map((v, i) => (
          <ImageBoxImages
            key={v.images + videos}
            image={v.image}
            video={videos.video}
          />
          // <p>{v.image}</p>
        ))}
      </div>
    </div>
  );
}

export default MemoriesCards;
