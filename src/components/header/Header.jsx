import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import moment from "moment";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";

import "./Header.css";

import { brandLogo } from "assets/strings/Strings";

import { useStateValue } from "config/context api/StateProvider";

import { Avatar } from "@mui/material";

import {
  KeyboardArrowDown,
  Logout,
  MoreHoriz,
  Search,
} from "@mui/icons-material";

import HeaderTab from "./header tab/HeaderTab";

function Header({ navToggle, setNavToggle }) {
  const history = useHistory();

  const alert = useAlert();

  const [{ reducerUserDATA, reducerUserImage, signOut }, dispatch] =
    useStateValue();

  const [userBio, setUserBio] = useState({
    firstName: "Peter ",
    lastName: "Krduer",
  });
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // console.log("Reloaded", reducerUserDATA);
    // console.log("Reloaded Image", reducerUserImage);
    if (reducerUserDATA) {
      setUserBio({
        firstName: reducerUserDATA.firstName,
        lastName: reducerUserDATA.lastName,
      });
    }

    if (reducerUserImage) {
      setUserImage(reducerUserImage);
    }
  }, [reducerUserDATA, reducerUserImage]);

  const logUserOut = () => {
    // localStorage.removeItem("user-info-token");
    // console.log("reducerGroup", reducerUserImage);
    localStorage.setItem("user-info-token", 0);
    localStorage.setItem("visitorID", 0);
    dispatch({
      type: "SET_SIGN_OUT",
      signOut: true,
    });
    // console.log("signOut", signOut);
  };

  useEffect(() => {
    if (signOut === true) {
      dispatch({
        type: "SET_SIGN_OUT",
        signOut: false,
      });
      // console.log("reducerGroup2", reducerUserImage);
      // console.log("signOut", signOut);
      alert.show("Logged out successfully");

      history.push("/authentication/sign");
      window.location.reload(false);
    }
    // console.log("signOut", signOut, reducerConnectionPeople, reducerOtherGroup);
  }, [signOut]);

  const openHeaderSidebar = () => {
    setNavToggle(!navToggle);
    // console.log(navToggle);
  };

  return (
    <header className="header">
      <Link to="/">
        <div className="header__left">
          <img className="header__leftLogo" src={brandLogo} alt="x-jour" />
        </div>
      </Link>

      <div className="header__center">
        <HeaderTab />
      </div>

      <div className="header__collapsible" onClick={openHeaderSidebar}>
        <MoreHoriz />
      </div>

      <div className="header__right">
        <div className="header__rightSection">
          <div className="header__rightSectionUser">
            {reducerUserDATA && (
              <Link to="/profile">
                <p>{`${reducerUserDATA.firstName} ${reducerUserDATA.lastName}`}</p>
                {!userImage ? (
                  <Oval color="#00BFFF" height={32} width={32} />
                ) : (
                  <Avatar src={userImage} />
                )}
              </Link>
            )}
          </div>

          <div onClick={() => history.push("/destinations/customMap")}>
            <Search />
          </div>

          <div className="header__rightSectionTime">
            {moment().format("hh:mm")}
            {/* <Clock format={"HH:mm"} timezone={"US/Pacific"} /> */}
            {/* <LiveClock format="hh:mm:ss " ticking /> */}
            <span>
              <KeyboardArrowDown />
            </span>
          </div>

          <div onClick={logUserOut}>
            <Logout />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
