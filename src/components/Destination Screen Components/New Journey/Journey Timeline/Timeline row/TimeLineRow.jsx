import React, { useState } from "react";
import "./TimeLineRow.css";
import HorizontalTimeline from "react-horizontal-timeline";

function TimeLineRow() {
  const [value, setValue] = useState(0);
  const [previous, setPrevious] = useState(0);

  const VALUES = [
    "Route",
    // "2021-01-15",
    // "2021-03-22",
    // "2021-06-22",
    // "2021-07-22",
  ];

  const description = [
    "The event of 1 Jan 2021 : Happy New Year",
    "The event of 15 Jan 2021 : Festival",
    "The event of 22 March 2021 : Board Exam",
  ];
  return (
    <div>
      <div className="root-div">
        <div style={{ width: "100%", height: "100px", margin: "0 auto" }}>
          <HorizontalTimeline
            styles={{ outline: "#DFA867", foreground: "#19295C" }}
            index={value}
            indexClick={(index) => {
              setValue(index);
              setPrevious(value);
            }}
            values={VALUES}
          />
        </div>
        <div className="text-center">{description[value]}</div>
      </div>
    </div>
  );
}

export default TimeLineRow;

//     data: "2019-12-05",
//     status: "status",
//     statusB: "Admission Start",
//     statusE: "Admission Open",
//   },
//   {
//     data: "2020-01-21",
//     status: "status",
//     statusB: "Start 1st round",
//     statusE: "Open for Fillup",
//   },
//   {
//     data: "2020-02-25",
//     status: "status",
//     statusB: "Start 2nd round",
//     statusE: "process",
//   },
//   {
//     data: "2020-03-16",
//     status: "status",
//     statusB: "Start 3rd round",
//     statusE: "Done",
//   },
//   {
//     data: "2020-04-19",
//     status: "status",
//     statusB: "Start 4th round",
//     statusE: "Done",
//   },
//   {
//     data: "2020-05-23",
//     status: "status",
//     statusB: "Complete",
//     statusE: "Done",
//   },
// ];

// const [stage, setStage] = useState([{ curIdx: 0, prevIdx: 0 }]);

// const curStatus = EXAMPLE[stage.curIdx].statusB;
// const prevStatus = stage.prevIdx >= 0 ? EXAMPLE[stage.prevIdx].statusB : "";
