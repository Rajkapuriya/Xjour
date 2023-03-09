import {
  FilterAlt,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import React from "react";
import "./FilterBy.css";
import Collapsible from "react-collapsible";
import { useState } from "react";

function FilterBy({ sortBy }) {
  const [open, isOpen] = useState(false);

  const ChangeVal = () => {
    isOpen(!open);
  };

  const filterText = (
    <div className="filterBy__body">
      <FilterAlt /> <p>Filter by: </p> {sortBy}
      {!open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
    </div>
  );

  return (
    <div className="filterBy">
      {/* <div className="filterBy__body" >
        <FilterAlt />
        <p >Filter by:</p>
      </div> */}
      <Collapsible trigger={filterText} onClick={ChangeVal}>
        <div className="filterBy__bodyInside">
          <h5>Date</h5>
          <h5>Location</h5>
          <h5>Routes</h5>
        </div>
      </Collapsible>
    </div>
  );
}

export default FilterBy;
