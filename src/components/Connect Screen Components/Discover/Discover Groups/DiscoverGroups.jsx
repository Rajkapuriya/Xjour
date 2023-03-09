import { Search } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../../../config/context api/StateProvider";
import GroupCards from "../../My Connections/Groups Section/Group cards/GroupCards";
import "./DiscoverGroups.css";

function DiscoverGroups() {
  const [{ userToken, reducerOtherGroup }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");

  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const groupWrapper = useRef(null);

  useEffect(() => {
    // console.log("UseEffect my Groups:", reducerOtherGroup);
    if (typeof reducerOtherGroup === "undefined") {
      // console.log("There's no Group yet!!");
      setIsEmpty(true);
    } else {
      if (reducerOtherGroup.length === 0) {
        // console.log("There's no Group yet!!");
        setIsEmpty(true);
      } else {
        setDiscoverGroups(reducerOtherGroup);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerOtherGroup]);

  // console.log("reducerOtherGroup", reducerOtherGroup);
  return (
    <div className="discoverGroups" ref={groupWrapper}>
      <div className="discoverGroups__search">
        <p>Search tags, country or continent</p>
        <div className="inputDiv discoverInputDiv">
          <input
            placeholder="Italy Coastal"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search />
        </div>
      </div>

      {isEmpty ? (
        <div className="noFriendText">
          <h3>Searching... </h3>
        </div>
      ) : (
        <div className="discoverGroups__cards">
          {discoverGroups
            ?.filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.name?.toLowerCase().includes(searchTerm?.toLowerCase())
              ) {
                return val;
              }
            })
            ?.map((v, i) => (
              <GroupCards data={v} index={i} key={v + i} />
            ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverGroups;
