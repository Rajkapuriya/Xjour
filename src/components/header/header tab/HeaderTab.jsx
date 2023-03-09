import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "./HeaderTab.css";

import { Tabs, Tab } from "@mui/material";
import {
  Collections,
  Favorite,
  Flight,
  Home,
  PersonPin,
} from "@mui/icons-material";

function HeaderTab() {
  // const headerValue = localStorage.getItem("header-component");

  const history = useHistory();

  const [value, setValue] = useState(0);

  // useEffect(() => {
  //   setValue(parseInt(headerValue));
  //   localStorage.removeItem("header-component");
  //   console.log(headerValue, "headerValue");
  // }, [headerValue]);

  useEffect(() => {
    if (history.location.pathname === "/home") {
      setValue(0);
    } else if (history.location.pathname === "/destinations/my-destinations") {
      setValue(1);
    } else if (history.location.pathname === "/connect/my-connections") {
      setValue(2);
    } else if (history.location.pathname === "/memories/images") {
      setValue(3);
    } else if (history.location.pathname === "/calender") {
      setValue(4);
    }
  }, [history.location.pathname]);

  const handleChange = (event, newValue) => {
    if (history.location.pathname === "/selectedGroup") {
      setValue(null);
    } else {
      setValue(newValue);
    }
  };

  return (
    <Tabs
      className="tabs"
      // value={headerValue !== null ? headerValue : value}
      value={value}
      onChange={handleChange}
      aria-label="icon position tabs example"
    >
      {/* <Link to="/home"> */}
      <Tab
        className="tab"
        value={0}
        icon={<Home />}
        label="Home"
        onClick={() => history.push("/home")}
      />
      {/* </Link> */}

      {/* <Link to="/destinations/my-destinations"> */}
      <Tab
        className="tab"
        value={1}
        icon={<Flight />}
        label="Destinations"
        onClick={() => history.push("/destinations/my-destinations")}
      />
      {/* </Link> */}

      {/* <Link to="/connect/my-connections"> */}
      <Tab
        className="tab"
        value={2}
        icon={<Favorite />}
        label="Connect"
        onClick={() => history.push("/connect/my-connections")}
      />
      {/* </Link> */}

      {/* <Link to="/memories/images"> */}
      <Tab
        className="tab"
        value={3}
        icon={<PersonPin />}
        label="Memories"
        onClick={() => history.push("/memories/images")}
      />
      {/* </Link> */}

      {/* <Link to="/calender"> */}
      <Tab
        className="tab"
        value={4}
        icon={<Collections />}
        label="Calender"
        onClick={() => history.push("/calender")}
      />
      {/* </Link> */}
    </Tabs>
  );
}

export default HeaderTab;
