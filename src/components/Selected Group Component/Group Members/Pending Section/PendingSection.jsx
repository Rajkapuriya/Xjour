import React, { useState } from "react";
import { useStateValue } from "../../../../config/context api/StateProvider";
import GroupPendingCards from "./Group Pending Cards/GroupPendingCards";
import "./PendingSection.css";

function PendingSection() {
  const [{ reducerOtherGroup }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");

  // console.log("reducerOtherGroup", reducerOtherGroup);

  return (
    <div className="pendingSection">
      <div className="groupsSection__search">
        <p>Search Hometown</p>
        <div className="inputDiv">
          <input
            placeholder="Berlin, Germany"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="pendingSection__cards">
        {reducerOtherGroup
          ?.filter((val) => {
            if (searchTerm === "") {
              // console.log("value", val);
              return val;
            } else if (
              val.name?.toLowerCase().includes(searchTerm?.toLowerCase())
            ) {
              return val;
              // console.log("val", val);
            }
          })
          .map((v, i) => (
            // {data.map((v, i) => (
            <GroupPendingCards data={v} index={i} key={v + i} />
          ))}
      </div>
    </div>
  );
}

export default PendingSection;
