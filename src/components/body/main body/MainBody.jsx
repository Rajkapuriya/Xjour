import { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";

import "./MainBody.css";

import Calender from "pages/calender/Calender";
import Connect from "pages/connect/Connect";
import Destinations from "pages/destinations/Destinations";
import Home from "pages/home/Home";
import Memories from "pages/memories/Memories";
import Profile from "pages/profile/Profile";

import ProtectedRoutes from "../../../ProtectedRoutes";
import ConnectSidebar from "../../Connect Screen Components/Connect Sidebar/ConnectSidebar";
import DestinationSidebar from "../../Destination Screen Components/Destinations Sidebar/DestinationSidebar";
import HeaderSidebar from "../../header/Header Sidebar/HeaderSidebar";
import ViewPostcard from "../../Home Screen Components/PostCards/View Postcard/ViewPostcard";
import MemoriesSidebar from "../../Memories Screen Components/Memories Sidebar/MemoriesSidebar";
import ViewGroupMembers from "../../Selected Group Component/Group Members/ViewGroupMembers";
import SelectedGroupComponent from "../../Selected Group Component/SelectedGroupComponent";
import UserID from "./User ID/UserID";

function MainBody({ selectedGroup, navToggle }) {
  const history = useHistory();

  const [value, setValue] = useState(0);
  console.log("valueChanged", value);

  useEffect(() => {
    history.listen((location) => {
      console.log(`You changed the page to: ${location.pathname}`);
      if (location.pathname === "/home") {
        setValue(0);
      } else if (
        history.location.pathname === "/destinations/my-destinations"
      ) {
        setValue(1);
      } else if (history.location.pathname === "/connect/my-connections") {
        setValue(2);
      } else if (history.location.pathname === "/memories/images") {
        setValue(3);
      } else if (history.location.pathname === "/calender") {
        setValue(4);
      }
    });
  }, [history]);

  return (
    <main className="mainBody">
      {navToggle && (
        <div className="headerSidebar__body">
          <HeaderSidebar navToggle={navToggle} />
          {value === 1 && <DestinationSidebar className="destinationSidebar" />}
          {value === 2 && <ConnectSidebar className="connectionSidebar" />}
          {value === 3 && <MemoriesSidebar className="memoriesSidebar" />}
          {/* {value == 4 && <ConnectSidebar className="connectionSidebar" />} */}
        </div>
      )}
      <Route path="/postcard/view-postcard">
        <ViewPostcard />
      </Route>

      <ProtectedRoutes path="/home" component={Home} />

      <ProtectedRoutes path="/destinations" component={Destinations} />

      <ProtectedRoutes path="/connect" component={Connect} />

      <ProtectedRoutes path="/memories" component={Memories} />

      <ProtectedRoutes path="/calender" component={Calender} />

      <ProtectedRoutes path="/profile" component={Profile} />

      <Route path="/selectedGroup/my-group">
        <SelectedGroupComponent selectedGroup={selectedGroup} />
      </Route>

      <Route path="/:groupKey/groupMembers">
        <ViewGroupMembers />
      </Route>

      <Route path="/user/:ID" component={UserID}></Route>
    </main>
  );
}

export default MainBody;
