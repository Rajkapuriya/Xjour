import { Route } from "react-router";

import "./LeftSidebar.css";

import ConnectSidebar from "../../Connect Screen Components/Connect Sidebar/ConnectSidebar";
import DestinationSidebar from "../../Destination Screen Components/Destinations Sidebar/DestinationSidebar";
import MemoriesSidebar from "../../Memories Screen Components/Memories Sidebar/MemoriesSidebar";
import MyGroups from "../../my groups/MyGroups";
import OtherGroups from "../../other groups/OtherGroups";
import CreateGroup from "../../Sidebar Group Buttons/CreateGroup";

function LeftSidebar({ getGroupData }) {
  return (
    <aside className="leftSidebar">
      <Route path="/destinations">
        <DestinationSidebar className="destinationSidebar" />
      </Route>

      <Route path="/connect">
        <ConnectSidebar className="connectionSidebar" />
      </Route>

      <Route path="/memories">
        <MemoriesSidebar className="memoriesSidebar" />
      </Route>

      <div className="leftSidebar__sections-container">
        <MyGroups getGroupData={getGroupData} />
        <OtherGroups getGroupData={getGroupData} />
        <CreateGroup />
      </div>
    </aside>
  );
}

export default LeftSidebar;
