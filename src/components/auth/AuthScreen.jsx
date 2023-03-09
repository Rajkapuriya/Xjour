import { Route } from "react-router";

import "./AuthScreen.css";

import logo from "assets/images/logo.png";

import ConfirmationMail from "./confirmaion/ConfirmationMail";
import Preference from "./preference/Preference";
import SignLogin from "./signup login switch/SignLogin";
import UpdatePassword from "./UpdatePassword/UpdatePassword";
import ValidateID from "./Validate ID/ValidateID";
import TermsAndConditions from "./Terms And Conditions/TermsAndConditions";

function AuthScreen() {
  return (
    <div className="auth-screen">
      <header className="auth-screen__header">
        <img className="auth-screen__logo" src={logo} alt="" />
      </header>

      <section className="auth-screen__auth-container">
        <Route path="/authentication/terms&Conditions">
          <TermsAndConditions />
        </Route>

        <Route path="/authentication/updatepassword">
          <UpdatePassword />
        </Route>

        <Route path="/authentication/preference">
          <Preference />
        </Route>

        <Route path="/authentication/confirmation">
          <ConfirmationMail />
        </Route>

        <Route path="/authentication/sign">
          <SignLogin />
        </Route>

        <Route
          path="/authentication/FinalizeRegistration/:ID"
          //   /rest/users/validateid
          // {"registrationID": "ABCXY"}
          component={ValidateID}
        ></Route>
      </section>

      <div style={{ paddingBottom: 40 }}></div>
    </div>
  );
}

export default AuthScreen;
