import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import LeftSidebar from "../body/left sidebar/LeftSidebar";
import MainBody from "../body/main body/MainBody";
import RightSidebar from "../body/right sidebar/RightSidebar";
import Header from "../header/Header";
import "./AppMainScreen.css";

function AppMainScreen() {
  const history = useHistory();
  let { groupKey } = useParams();

  const [selectedGroup, setSelectedGroup] = useState([]);
  const [navToggle, setNavToggle] = useState(false);

  const getGroupData = (v, i) => {
    // setSelectedGroup(v);
    setSelectedGroup({
      base64: v.base64,
      countrySvg: v.countrySvg,
      description: v.description,
      key: v.key,
      name: v.name,
      searchable: v.searchable,
      index: i,
    });
    // history.push(`/selectedGroup/${selectedGroup.key}`);
    history.push("/selectedGroup/my-group");
  };

  return (
    <div className="app-main-screen">
      <Header navToggle={navToggle} setNavToggle={setNavToggle} />

      <div className="app-main-screen__body">
        <div className="app-main-screen__content">
          <LeftSidebar
            getGroupData={getGroupData}
            // getOtherGroupData={getOtherGroupData}
            className="leftBody"
          />
          <MainBody
            className="mainBody"
            selectedGroup={selectedGroup}
            navToggle={navToggle}
          />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default AppMainScreen;
