import { useState } from "react";
import { useHistory } from "react-router";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";

import "./SignUp.css";

import {
  emailError,
  googleColor,
  passwordError,
  primaryColor,
  whiteColor,
} from "assets/colors/Colors";
import { passPrompt } from "assets/strings/Strings";

import {
  checkAccount,
  userSignUp,
} from "config/authentication/AuthenticationApi";
import { useStateValue } from "config/context api/StateProvider";

import {
  ChevronRight,
  Error,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import ButtonAtom from "components/Atoms/Button/Button";

function SignUp() {
  const [{ userToken, reducerVisitorID }, dispatch] = useStateValue();
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [emailExist, setEmailExist] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [isEmailLoading, setIsEmailLoading] = useState(false);

  const history = useHistory();
  const alert = useAlert();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: null,
    confirmPassword: "",
    emailCheck: true,
    passwordCheck: true,
    confirmPasswordCheck: true,
  });

  const callSignUpApi = () => {
    console.log("calling api >>>");
    setIsLoading(true);

    const params = JSON.stringify({
      loginName: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      passwordMD5: user.password,

      anonymized: false,
      nickName: "",
      jsessionid: "",
      ip: "",
      fingerprint: "",
    });

    console.log("params", params);
    userSignUp(params, reducerVisitorID).then(function (val) {
      console.log(val);

      if (val.response) {
        console.log(val.response.data);
        console.log(val.response.status);
      }
      setIsLoading(false);
      history.push("/authentication/confirmation");
    });
  };

  const signUp = () => {
    console.log(user);

    if (!(user.firstName.length >= 2)) {
      // print("First name not valid");
      alert.show("First name not valid");
    } else if (!(user.lastName.length >= 2)) {
      alert.show("Last name not valid");
    } else if (!(user.username.length >= 2)) {
      alert.show("Username is not valid");
    } else if (!user.emailCheck) {
      alert.show("Email not valid");
    } else if (!user.password) {
      alert.show("Password invalid");
    } else if (!(user.password === user.confirmPassword)) {
      alert.show("Confirm Password invalid");
    } else if (emailExist) {
      alert.show("Cannot Signup using existing Email");
    } else {
      callSignUpApi();
    }
  };

  const validateEmail = (text) => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      return false;
    } else {
      // console.log("Email is Correct");
      return true;
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
    if (!(user.password === user.confirmPassword)) {
      return false;
    } else {
      return true;
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const updateUsername = (e) => {
    // const result = validateEmail(e);

    setUser({
      ...user,
      email: e,
      //emailCheck: result,
    });
    //console.log(user)
  };

  const updatePassword = (e) => {
    const result = validatePassword(e);
    if (result) {
      console.log("Password is Valid ");
    } else {
      console.log("Password is invalid ");
    }

    setUser({
      ...user,
      password: e,
    });
  };

  const focusChangeEmail = () => {
    console.log("Focus Changed");
    const result = validateEmail(user.email);

    const params = JSON.stringify({
      loginName: user.email,
    });

    // setIsEmailLoading(true);
    checkAccount(params, reducerVisitorID).then(function (val) {
      console.log(val);
      // console.log(val.data.response);
      // setIsEmailLoading(false);

      if (val) {
        if (val.status === "406") {
          setEmailExist(true);
          console.log("emailExist", emailExist);
        }
      }

      if (val.data) {
        if (val.data.response === "ok") {
          setEmailExist(false);
          console.log("emailExist", emailExist);
        }
      }
    });

    setUser({
      ...user,
      emailCheck: result,
    });
  };

  const focusChangePassword = () => {
    console.log("Focus Changed", user.password);

    if (user.password.length > 0) {
      const result = validatePassword(user.password);

      if (user.confirmPassword.length > 0) {
        const confirmResult = validateConfirmPassword();

        return setUser({
          ...user,
          passwordCheck: result,
          confirmPasswordCheck: confirmResult,
        });
      }

      setUser({
        ...user,
        passwordCheck: result,
      });
    }
  };

  const focusChangeConfirmPassword = () => {
    console.log("Focus Changed Confirm");

    if (user.password.length > 0) {
      const result = validateConfirmPassword();
      console.log(result);
      setUser({
        ...user,
        confirmPasswordCheck: result,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="sign-up__screenloader">
        <Oval color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="sign-up">
      <div className="sign-up__inputs">
        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">First Name</label>

          <input
            className="sign-login__input-field-input"
            placeholder="John"
            type="text"
            value={user.firstName}
            onChange={(e) =>
              setUser({
                ...user,
                firstName: e.target.value,
              })
            }
          />
        </div>

        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">Last Name</label>

          <input
            className="sign-login__input-field-input"
            placeholder="Doe"
            type="text"
            value={user.lastName}
            onChange={(e) =>
              setUser({
                ...user,
                lastName: e.target.value,
              })
            }
          />
        </div>

        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">Email</label>

          <input
            className="sign-login__input-field-input"
            style={{ color: user.emailCheck ? "black" : emailError }}
            placeholder="johndoe@xjour.com"
            type="email"
            value={user.email}
            onChange={(e) => updateUsername(e.target.value)}
            onBlur={focusChangeEmail}
          />

          <div className="sign-up__input-field-error-container">
            {!user.emailCheck && (
              <Error className="sign-up__input-field-error-icon sign-up__input-field-error-icon--email" />
            )}

            {!user.emailCheck && (
              <p className="sign-up__input-field-error-text sign-up__input-field-error-text--email">
                Not a valid e-mail address
              </p>
            )}
            {emailExist && (
              <p className="sign-up__input-field-error-text sign-up__input-field-error-text--password">
                E-mail address already exist
              </p>
            )}
          </div>
        </div>

        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">Username</label>

          <input
            className="sign-login__input-field-input"
            placeholder="John123"
            type="text"
            value={user.username}
            onChange={(e) =>
              setUser({
                ...user,
                username: e.target.value,
              })
            }
          />
        </div>

        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">Password</label>

          <div className="signup__input-password-field-container">
            <input
              className="sign-login__input-field-input"
              placeholder="********"
              type={passwordShown ? "text" : "password"}
              value={user.password}
              onChange={(e) => updatePassword(e.target.value)}
              onBlur={() => focusChangePassword()}
            />
            {passwordShown ? (
              <Visibility
                className="signup__password-visiblity-icon"
                onClick={togglePassword}
              />
            ) : (
              <VisibilityOff
                className="signup__password-visiblity-icon"
                onClick={togglePassword}
              />
            )}
          </div>
          <div className="sign-up__input-field-error-container">
            {!user.passwordCheck && (
              <>
                <Error className="sign-up__input-field-error-icon sign-up__input-field-error-icon--password" />
                <p className="sign-up__input-field-error-text sign-up__input-field-error-text--password">
                  {passPrompt}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="sign-up__input-field">
          <label className="sign-up__input-field-label">Confirm Password</label>

          <div className="signup__input-password-field-container">
            <input
              className="sign-login__input-field-input"
              placeholder="********"
              type={confirmPasswordShown ? "text" : "password"}
              value={user.confirmPassword}
              onBlur={focusChangeConfirmPassword}
              onChange={(e) =>
                setUser({
                  ...user,
                  confirmPassword: e.target.value,
                })
              }
            />
            {confirmPasswordShown ? (
              <Visibility
                className="signup__password-visiblity-icon"
                onClick={toggleConfirmPassword}
              />
            ) : (
              <VisibilityOff
                className="signup__password-visiblity-icon"
                onClick={toggleConfirmPassword}
              />
            )}
          </div>
          <div className="sign-up__input-field-error-container">
            {!user.confirmPasswordCheck && (
              <>
                <Error className="sign-up__input-field-error-icon sign-up__input-field-error-icon--password" />
                <p className="sign-up__input-field-error-text sign-up__input-field-error-text--password">
                  Password does not match
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sign-up__button-container">
        <ButtonAtom variant="filled" fontWeight="500" onClick={signUp}>
          Sign up
          <ChevronRight style={{ color: "white" }} />
        </ButtonAtom>
      </div>

      <p
        className="login__terms-and-conditions-text"
        onClick={() => history.push("/authentication/terms&Conditions")}
      >
        {"Terms & Condition"}
      </p>

      {/* <div className="singUp__bottom">
          <h5>Or sign up using</h5>

          <div className="singUp__bottomButtons">
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
                <Apple className="socialIcon socialIcon-apple " />
              </span>
              <h5 style={{ color: whiteColor }}>Apple ID</h5>
            </button>
          </div>
        </div> */}
    </div>
  );
}

export default SignUp;
