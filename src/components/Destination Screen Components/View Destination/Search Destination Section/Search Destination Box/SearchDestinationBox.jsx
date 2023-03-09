import React, { useState } from "react";
import "./SearchDestinationBox.css";
import { CalendarToday, FmdGood } from "@mui/icons-material";
import { TextField } from "@mui/material";

function SearchDestinationBox({
  route,
  place,
  arrivalDate,
  departureDate,
  getValue,
}) {
  const [searchData, setSearchData] = useState("");
  const [dateArrival, setDateArrival] = useState(0);

  return (
    <div className="searchDestinationBox">
      <div className="topSearch__left">
        <div className="inputDivBox">
          <form>
            <div className="upperSection">
              <TextField
                id="standard-basic"
                label="Destination"
                variant="filled"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />

              <FmdGood />
            </div>

            <div className="lowerSection">
              <TextField
                id="standard-basic"
                label="Arrival Date"
                variant="standard"
                type="date"
                value={dateArrival}
                onChange={(e) => setDateArrival(e.target.value)}
              />
              <TextField
                id="standard-basic"
                label="Departure Date"
                variant="standard"
              />

              <CalendarToday />
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SearchDestinationBox;
