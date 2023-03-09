import React, { useEffect, useRef, useState } from "react";
import "./PeopleSection.css";
import { Search } from "@mui/icons-material";
import PeopleCards from "./People cards/PeopleCards";
import { useStateValue } from "../../../../config/context api/StateProvider";

function PeopleSection() {
  const [{ reducerMyConnectionPeople }, dispatch] = useStateValue();
  // console.log("reducerMyConnectionPeople", reducerMyConnectionPeople);

  const [myConnections, setMyConnections] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const peopleWrapper = useRef(null);

  // const scrollPeople = (scrollOffset) => {
  //   console.log("button Pressed", peopleWrapper.current.scrollTop);
  //   peopleWrapper.current.scrollTop += scrollOffset;
  // };

  useEffect(() => {
    // console.log("UseEffect my Connection:", reducerMyConnectionPeople);
    if (typeof reducerMyConnectionPeople === "undefined") {
      // console.log("You have no friend added!!");
      setIsEmpty(true);
    } else {
      if (reducerMyConnectionPeople.length === 0) {
        // console.log("You have no Friend Added!!");
        setIsEmpty(true);
      } else {
        setMyConnections(reducerMyConnectionPeople);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerMyConnectionPeople]);

  return (
    <div className="peopleSection" ref={peopleWrapper}>
      <div className="peopleSection__head">
        <div className="peopleSection__search">
          {/* <p>Search Hometown</p> */}
          <div className="inputDiv">
            <input
              placeholder="Berlin, Germany"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search />
          </div>
        </div>
        {/* <FilterBy sortBy={<h5>Date created</h5>} /> */}
      </div>

      {/* <div className="fullScrennScroll__buttons">
        <ArrowUpwardSharp onClick={() => scrollPeople(-150)} />
        <ArrowDownward onClick={() => scrollPeople(+150)} />
      </div> */}
      {isEmpty ? (
        <div className="noFriendText">
          <h3>You have no friend added </h3>
        </div>
      ) : (
        <div className="peopleSection__cards">
          {reducerMyConnectionPeople
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
              <PeopleCards
                key={v + i}
                index={i}
                data={v}
                contentWrapper={peopleWrapper}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default PeopleSection;
