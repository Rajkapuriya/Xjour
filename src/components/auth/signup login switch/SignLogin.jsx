import { useState } from "react";

import "./SignLogin.css";

import { Box, Tab, Tabs } from "@mui/material";

import Login from "../login/Login";
import SignUp from "../sign up/SignUp";

function SignLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="sign-login">
      <nav className="sign-login__nav">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab className="tabButton" value={1} label="Log in" />
            <Tab className="tabButton" value={2} label="Sign Up" />
          </Tabs>
        </Box>
      </nav>

      {!isSignUp ? <Login /> : <SignUp />}
    </div>
  );
}

export default SignLogin;
