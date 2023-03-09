import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

function UserID() {
  const [inputVal, setInputVal] = useState("");
  const { ID } = useParams();
  const history = useHistory();
  const redirect = (e) => {
    e.preventDefault();
    // history.push(`ID:/${inputVal}`);
    history.push(`/${inputVal}`);
  };
  return (
    <div className="userID">
      <h1>ID = {ID}</h1>

      <form>
        <input
          className="inputDiv"
          type="text"
          value={inputVal}
          placeholder="enter value here"
          onChange={(e) => setInputVal(e.target.value)}
        //   onSubmit={redirect}
        />
        <button className="primaryButton" onClick={redirect}> Check Link</button>
      </form>
    </div>
  );
}

export default UserID;
