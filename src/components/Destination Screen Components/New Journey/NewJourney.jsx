import React, { useState, useEffect } from "react";
import "./NewJourney.css";
import Switch from "@mui/material/Switch";
import { ChevronLeft } from "@mui/icons-material";
import JourneyTimeline from "./Journey Timeline/JourneyTimeline";

function NewJourney() {
  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div className="newJourney">
      {/* /************* First Container Starts Here  *******************/}
      <div className="container__top">
        <div className="container__topLeft">
          <ChevronLeft />
          <h3>New Journey</h3>
        </div>
        <div className="container__topRight">
          <Switch {...label} defaultChecked />
        </div>
      </div>
      {/* /************* First Container Ends Here  *******************/}

      {/* /************* Second Container Starts Here  *******************/}
      <JourneyTimeline />
      {/* /************* Second Container Ends Here  *******************/}

      {/* /************* Third Container Starts Here  *******************/}
      <div className="container__map">
        {/* <StreetMap /> */}
      </div>
      {/* /************* Third Container Ends Here  *******************/}

      {/* /************* Third Container Starts Here  *******************/}
      <div className="container__button">
      
      </div>
      {/* /************* Third Container Ends Here  *******************/}
    </div>
  );
}

export default NewJourney;
