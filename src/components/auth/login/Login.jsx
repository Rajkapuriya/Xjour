import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router";
import { useAlert } from "react-alert";
import { ChevronRight, Visibility, VisibilityOff } from "@mui/icons-material";

import "./Login.css";

import { googleColor, primaryColor, whiteColor } from "assets/colors/Colors";
import { UNAUTH_KEY } from "assets/constants/Contants";

import { userLogIn } from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import "react-toastify/dist/ReactToastify.css";

import ButtonAtom from "components/Atoms/Button/Button";

function Login() {
  const alert = useAlert();
  const history = useHistory();

  const [{ reducerVisitorID }, dispatch] = useStateValue();

  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, isLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    emailCheck: true,
    // passwordCheck: true,
  });

  const onLoginClick = () => {
    console.log(user);
    isLoading(true);

    const params = JSON.stringify({
      loginname: user.username.toLowerCase(),
      passwordMD5: user.password,
      fingerprint: "",
      ip: "0.0.0.0",
    });

    if (!(user.username.length > 2)) {
      alert.show("Username is not valid");
      isLoading(false);
    } else if (!(user.password.length > 2)) {
      alert.show("Password invalid");
      isLoading(false);
    } else {
      userLogIn(params, reducerVisitorID).then(function (val) {
        console.log(val.data);
        if (val.data) {
          if (val.data.token != null) {
            console.log("You are successfully Logged in");
            localStorage.setItem("user-info", JSON.stringify(val));
            localStorage.setItem("user-info-token", val.data.token);
            dispatch({
              type: "SET_USER_TOKEN",
              reducerUserToken: val.data.token,
            });
            isLoading(false);
            alert.show("login Successfully");
            history.push("/home");
            window.location.reload();
            // history.push("/memories/destination");
          } else {
            console.log("error ");
            isLoading(false);
            // alert("Username and Password do not match ");
            alert.show("Username and Password do not match");
          }
        } else if (val.status === UNAUTH_KEY) {
          // console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      });
    }
  };

  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const updatePassword = (e) => {
    setUser({
      ...user,
      password: e,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onLoginClick();
  };

  if (loading) {
    return (
      <div className="authLoader">
        <Oval color="#00BFFF" />
      </div>
    );
  }

  return (
    <div className="login">
      {/* <button style={{ display: "none" }} onClick={notify}>
        Notify!
      </button> */}
      {/* <button
        onClick={() => {
          alert.show("Oh look, an alert!");
        }}
      >
        Show Alert
      </button> */}
      {/* <ToastContainer /> */}
      <form onSubmit={onFormSubmit} className="login__form">
        <div className="login__inputs">
          <div className="login__input-field">
            <label className="login__input-field-label" htmlFor="input-email">
              E-Mail
            </label>
            <input
              id="input-email"
              className="sign-login__input-field-input"
              placeholder="E-mail"
              type="text"
              value={user.username}
              // onBlur={() => focusChangeEmail()}
              onChange={(e) =>
                setUser({
                  ...user,
                  username: e.target.value,
                })
              }
            />
          </div>

          <div className="login__input-field">
            <label
              className="login__input-field-label"
              htmlFor="input-password"
            >
              Password
            </label>
            <div className="login__input-password-field-container">
              <input
                id="input-password"
                className="sign-login__input-field-input"
                placeholder="*****"
                type={passwordShown ? "text" : "password"}
                value={user.password}
                onChange={(e) => updatePassword(e.target.value)}
                // onBlur={() => focusChangePassword()}
              />
              {passwordShown ? (
                <Visibility
                  className="login__password-visiblity-icon"
                  onClick={togglePassword}
                />
              ) : (
                <VisibilityOff
                  className="login__password-visiblity-icon"
                  onClick={togglePassword}
                />
              )}
            </div>
          </div>
        </div>

        <p className="login__forget-password-text">
          <a href="https://xjour.com">Forgot Password?</a>
        </p>

        <div className="login__button-container">
          <ButtonAtom
            variant="filled"
            fontWeight="500"
            onClick={onLoginClick}
            type="submit"
          >
            Log in
            <ChevronRight style={{ color: "white" }} />
          </ButtonAtom>
        </div>
      </form>

      <p
        className="login__terms-and-conditions-text"
        style={{ color: primaryColor }}
        onClick={() => history.push("/authentication/terms&Conditions")}
      >
        Terms & Condition
      </p>

      {/* <div className="containerBottom">
        <h5>Or Log in using</h5>

        <div className="containerBottom__buttons">
          <button
            className="googleButton"
            style={{ backgroundColor: googleColor }}
          >
            <img
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              className="socialIcon"
              style={{ padding: "5px" }}
            />
            <h5 style={{ color: blackColor }}>Google</h5>
          </button>
          <button
            className="appleButton"
            style={{
              backgroundColor: appleColor,
              color: googleColor,
              padding: "3px",
            }}
          >
            <span>
              <Apple className="socialIcon socialIcon-apple" />
            </span>
            <h5 className="appleButtonText" style={{ color: whiteColor }}>
              Apple ID
            </h5>
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default Login;
