import React, { useState } from "react";
import LeftSidebar from "../body/left sidebar/LeftSidebar";
import MainBody from "../body/main body/MainBody";
import RightSidebar from "../body/right sidebar/RightSidebar";
import Header from "../header/Header";
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Header />

      <div className="homeBody">
        <LeftSidebar />
        <MainBody />
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
