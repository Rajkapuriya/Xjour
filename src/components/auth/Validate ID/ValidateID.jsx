import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { validateID } from "../../../config/authentication/AuthenticationApi";
import { useStateValue } from "../../../config/context api/StateProvider";

function ValidateID() {
  const [{ reducerVisitorID }, dispatch] = useStateValue();
  const [validationResponse, setValidationResponse] = useState("");
  const { ID } = useParams();

  const checkIDVaidation = () => {
    const params = JSON.stringify({
      registrationID: ID,
    });

    console.log("validateID", params);
    validateID(params, reducerVisitorID).then(function (val) {
      console.log("validateID", val);
      setValidationResponse(val.data);
    });
  };

  const initIDValidation = () => {
    checkIDVaidation();
  };

  useEffect(() => {
    initIDValidation();
    console.log("initializing Validation ID");
  }, []);

  return (
    <div>
      <h1>ID = {ID}</h1>
      <button className="primaryButtonActive">check API</button>
    </div>
  );
}

export default ValidateID;
