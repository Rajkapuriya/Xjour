import React from "react";
import { useHistory } from "react-router";

import "./ConfirmationMail.css";

import { primaryColor } from "assets/colors/Colors";
import {
  checkInbox,
  checkYourEmail,
  confirmationMail,
} from "assets/strings/Strings";

import ButtonAtom from "components/Atoms/Button/Button";

function ConfirmationMail() {
  const history = useHistory();

  return (
    <div className="confirmation-mail">
      <div
        className="confirmation-mail__heading"
        style={{ color: primaryColor }}
      >
        <h2>{checkYourEmail}</h2>
      </div>

      <div className="confirmation-mail__mid">
        <h5>{confirmationMail}</h5>
      </div>

      <div className="confirmation-mail__bottom">
        <h5>{checkInbox}</h5>
      </div>

      <div className="confirmation-mail__continue">
        <ButtonAtom
          variant="filled"
          onClick={() => history.push("/authentication/sign")}
        >
          Continue
        </ButtonAtom>
      </div>
    </div>
  );
}

export default ConfirmationMail;
