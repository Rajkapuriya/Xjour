import React from "react";
import "./JourneyTimeline.css";
import ReactStepper from "./React Stepper/ReactStepper";
import TimeLineRow from "./Timeline row/TimeLineRow";
// import TimelineSection from "./Timeline Section/TimelineSection";

function JourneyTimeline() {
  return (
    <div className="journeyTimeline">
      {/* <TimeLineRow /> */}
      <ReactStepper />
      {/* <TimelineSection /> */}
    </div>
  );
}

export default JourneyTimeline;
