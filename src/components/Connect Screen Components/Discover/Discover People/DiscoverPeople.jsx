import { Search } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../../../config/context api/StateProvider";
import ConnectionPeople from "./Connection People/ConnectionPeople";
import "./DiscoverPeople.css";

function DiscoverPeople() {
  const [otherConnectionPeople, setOtherConnectionPeople] = useState([]);
  const [{ reducerConnectionPeople }, dispatch] = useStateValue();
  const [isEmpty, setIsEmpty] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const peopleWrapper = useRef(null);

  // const scrollPeople = (scrollOffset) => {
  // console.log("button Pressed",  peopleWrapper.current.scrollTop);
  //   peopleWrapper.current.scrollTop += scrollOffset;
  // };

  // console.log("reducerConnection", reducerConnectionPeople);

  useEffect(() => {
    // console.log("UseEffect my Connection:", reducerConnectionPeople);

    if (reducerConnectionPeople) {
      if (reducerConnectionPeople.length === 0) {
        // console.log("You have no Friend Added!!");
        setIsEmpty(true);
      } else {
        setOtherConnectionPeople(reducerConnectionPeople);
        setIsEmpty(false);
      }
    }
    // console.log("isEmpty:", isEmpty);
  }, [reducerConnectionPeople]);

  // console.log("reducerConnectionPeople", reducerConnectionPeople);
  // console.log("otherConnectionPeople", otherConnectionPeople);

  return (
    <div className="discoverPeople" ref={peopleWrapper}>
      <div className="discoverPeople__search">
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
        <div className="discoverPeople__cards">
          {/* <div className="fullScrennScroll__buttons">
            <ArrowUpwardSharp onClick={() => scrollPeople(-150)} />
            <ArrowDownward onClick={() => scrollPeople(+150)} />
          </div> */}
          {otherConnectionPeople
            ?.filter((val) => {
              if (searchTerm === "") {
                // console.log("value", val);
                return val;
              } else if (
                val.firstName?.toLowerCase().includes(searchTerm?.toLowerCase())
              ) {
                return val;
                // console.log("val", val);
              } else if (
                val.lastName?.toLowerCase().includes(searchTerm?.toLowerCase())
              ) {
                return val;
                // console.log("val", val);
              }
            })
            .map((v, i) => (
              <ConnectionPeople
                key={v + i}
                firstName={v.firstName}
                lastName={v.lastName}
                flag={v.countrySvg}
                image={v.base64}
                pk={v.pk}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverPeople;
