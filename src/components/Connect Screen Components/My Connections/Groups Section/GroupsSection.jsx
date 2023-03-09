import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../../../config/context api/StateProvider";
import GroupCards from "./Group cards/GroupCards";
import "./GroupsSection.css";

function GroupsSection() {
  const [{ reducerGroup }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  // console.log("reducerGroup", reducerGroup);

  const [myConnections, setMyConnections] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const groupWrapper = useRef(null);



  useEffect(() => {
    // console.log("UseEffect my Groups:", reducerGroup);
    if (typeof reducerGroup === "undefined") {
      // console.log("There's no Group yet!!");
      setIsEmpty(true);
    } else {
      if (reducerGroup.length === 0) {
        // console.log("There's no Group yet!!");
        setIsEmpty(true);
      } else {
        setMyConnections(reducerGroup);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerGroup]);

  return (
    <div className="groupsSection" ref={groupWrapper}>
      <div className="groupsSection__search">
        {/* <p>Search Hometown</p> */}
        <div className="inputDiv">
          <input
            placeholder="Berlin, Germany"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <Search /> */}
        </div>
      </div>

      {isEmpty ? (
        <div className="noFriendText">
          <h3>You have no Groups </h3>
        </div>
      ) : (
        <div className="groupsSection__cards">
          {/* <div className="fullScrennScroll__buttons">
            <ArrowUpwardSharp onClick={() => scrollGroup(-150)} />
            <ArrowDownward onClick={() => scrollGroup(+150)} />
          </div> */}
          {reducerGroup
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

              <GroupCards key={v + i} data={v} index={i} />
            ))}
        </div>
      )}
    </div>
  );
}

export default GroupsSection;
