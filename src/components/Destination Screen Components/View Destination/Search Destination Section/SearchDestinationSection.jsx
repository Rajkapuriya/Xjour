import React from "react";
import SearchDestinationBox from "./Search Destination Box/SearchDestinationBox";
import "./SearchDestinationSection.css";
import dummyImage from "../../../../assets/images/wallpaperDestination.jpg";
import pen from "../../../../assets/images/wallpaperDestination.jpg";

function SearchDestinationSection({ getValue }) {
  return (
    // <div className="searchDestinationSection">
    <div className="container__topSearch">
      <h5>Enter Title</h5>
      <div className="topSearch">
        <SearchDestinationBox getValue={getValue} />
        <div className="topSearch__right">
          <img className="searchImage" src={dummyImage} alt="" />
          <img className="searchImage" src={pen} alt="" />
        </div>
      </div>
    </div>
    // </div>
  );
}

export default SearchDestinationSection;
