import { MoreVert } from "@mui/icons-material";
import React, { useState } from "react";
import "./MiniCards.css";

function MiniCards({ data, index, getDestinationData }) {
  const [collapsibleButton, setCollapsibleButton] = useState(false);

  const handleTriggerClick = () => {
    setCollapsibleButton(!collapsibleButton);
  };
  return (
    <div className="miniCards" onClick={() => getDestinationData(data, index)}>
      <div className="miniCards__detail">
        <div className="miniCardsDetail__dataLeft">
          <div className="miniCardDetails__dataLeftTop">
            <h5>{data.title}</h5>
          </div>

          <div className="miniCardDetails__dataLeftBottom">
            <p className="cityMini">{data.city}, </p>
            <p className="cityMini">{data.country}</p>
          </div>
        </div>
      </div>

      <div className="miniCards__image">
        <img className="cardImage" src={data.image} alt />
        <div className="moreOption">
          {collapsibleButton ? (
            <div className="moreOptionOptions">
              <div className="moreOptionOptions__svg">
                <MoreVert onClick={handleTriggerClick} />
                <p>Remove</p>
                <p>View details</p>
                <p>Add to journey</p>
              </div>
            </div>
          ) : (
            <div className="moreOption">
              <div className="svgIcon">
                <MoreVert onClick={handleTriggerClick} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiniCards;
