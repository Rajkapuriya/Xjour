import React, { useState } from "react";
import { useHistory } from "react-router";
import { useAlert } from "react-alert";

import "./UpdataPassword.css";

import {
  googleColor,
  passwordError,
  primaryColor,
  whiteColor,
} from "assets/colors/Colors";
import { UNAUTH_KEY } from "assets/constants/Contants";

import { userUpdatePassword } from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  ChevronLeft,
  ChevronRight,
  Error,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

import ButtonAtom from "components/Atoms/Button/Button";

function UpdatePassword() {
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const history = useHistory();
  const alert = useAlert();

  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    passwordCheck: true,
    confirmPasswordCheck: true,
  });

  const userPasswordUpdate = () => {
    if (!user.passwordCheck) {
      alert.show("Password invalid");
    } else if (user.oldPassword === user.newPassword) {
      alert.show("New Password must be different.");
    } else if (user.newPassword !== user.confirmNewPassword) {
      alert.show("Confirm Password invalid.");
    } else {
      const params = JSON.stringify({
        oldPassword: user.oldPassword,
        newPassword: user.newPassword,
      });

      userUpdatePassword(params, userToken, reducerVisitorID).then(function (
        val
      ) {
        if (val) {
          console.log(val);
          console.log(val.data);

          alert.show("Your password has been succesffully updated.");
          history.push("/profile");
        } else if (val.status === UNAUTH_KEY) {
          console.log("Setting to 0");
          localStorage.setItem("user-info-token", 0);
          dispatch({
            type: "SET_USER_TOKEN",
            reducerUserToken: 0,
          });
        }
      });
    }
  };

  const validatePassword = (text) => {
    // console.log(text);
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      return false;
    } else {
      // console.log("Email is Correct");
      return true;
    }
  };
  const validateConfirmPassword = () => {
    if (!(user.newPassword === user.confirmPassword)) {
      return false;
    } else {
      return true;
    }
  };

  const updatePassword = (e) => {
    const result = validatePassword(e);
    if (result) {
      console.log("Password is Valid ");
    }
    //  else if (user.oldPassword === user.newPassword) {
    //   console.log("New password must be different from the old one ");
    // }
    else {
      console.log("Password is invalid ");
    }

    setUser({
      ...user,
      newPassword: e,
    });
  };

  const focusChangePassword = () => {
    console.log("Focus Changed");

    const result = validatePassword(user.newPassword);

    setUser({
      ...user,
      passwordCheck: result,
    });
  };

  const focusChangeConfirmPassword = () => {
    console.log("Focus Changed Confirm");

    const result = validateConfirmPassword();
    console.log(result);
    setUser({
      ...user,
      confirmPasswordCheck: result,
    });
  };

  const toggleOldPassword = () => {
    setOldPasswordShown((prev) => !prev);
  };
  const togglePassword = () => {
    setPasswordShown((prev) => !prev);
  };
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown((prev) => !prev);
  };

  return (
    <section className="update-password">
      <header className="update-password__header">
        <IconButton className="update-password__back-to-profile-button">
          <ChevronLeft onClick={() => history.push("/profile")} />
        </IconButton>

        <h3 className="update-password__heading">Update Password</h3>

        <div></div>
      </header>

      <main className="update-password__main">
        <div className="update-password__form">
          <div className="update-password__form-field">
            <label
              for="currentPassword"
              className="update-password__form-field-label"
            >
              Old Password
            </label>
            <div className="inputDiv">
              <input
                id="currentPassword"
                className="update-password__form-field-input"
                placeholder="Current Password"
                type={oldPasswordShown ? "text" : "password"}
                value={user.oldPassword}
                onChange={(e) =>
                  setUser({
                    ...user,
                    oldPassword: e.target.value,
                  })
                }
              />
              {oldPasswordShown ? (
                <Visibility onClick={toggleOldPassword} />
              ) : (
                <VisibilityOff onClick={toggleOldPassword} />
              )}
            </div>
          </div>

          <div className="update-password__form-field">
            <label
              for="newPassword"
              className="update-password__form-field-label"
            >
              New Password
            </label>
            <div className="inputDiv">
              <input
                id="newPassword"
                className="update-password__form-field-input"
                placeholder="New Password"
                type={passwordShown ? "text" : "password"}
                value={user.password}
                onChange={(e) => updatePassword(e.target.value)}
                onBlur={() => focusChangePassword()}
              />
              {passwordShown ? (
                <Visibility onClick={togglePassword} />
              ) : (
                <VisibilityOff onClick={togglePassword} />
              )}
            </div>

            {!user.passwordCheck && (
              <div className="update-password__password-invalidation-container">
                <Error style={{ color: passwordError }} />
                <h5
                  className="emailError"
                  style={{ color: passwordError, width: "260px" }}
                >
                  Password needs atleast 8 characters, 1 number, 1 symbol, 1
                  upeercase and 1 lowercase
                </h5>
              </div>
            )}
          </div>

          <div className="update-password__form-field">
            <label
              for="confirmNewPassword"
              className="update-password__form-field-label"
            >
              Confirm New Password
            </label>
            <div className="inputDiv">
              <input
                id="confirmNewPassword"
                className="update-password__form-field-input"
                placeholder="Confirm New Password"
                type={confirmPasswordShown ? "text" : "password"}
                onBlur={focusChangeConfirmPassword}
                onChange={(e) =>
                  setUser({
                    ...user,
                    confirmNewPassword: e.target.value,
                  })
                }
              />
              {confirmPasswordShown ? (
                <Visibility onClick={toggleConfirmPassword} />
              ) : (
                <VisibilityOff onClick={toggleConfirmPassword} />
              )}
            </div>
            {!user.confirmPasswordCheck && (
              <div className="update-password__password-invalidation-container">
                <Error style={{ color: passwordError }} />
                <h5 className="emailError" style={{ color: passwordError }}>
                  Password does not match
                </h5>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="update-password__footer">
        <ButtonAtom variant="filled" onClick={userPasswordUpdate}>
          Update Password
          <ChevronRight style={{ color: "white" }} />
        </ButtonAtom>
      </footer>
    </section>
  );
}

export default UpdatePassword;
