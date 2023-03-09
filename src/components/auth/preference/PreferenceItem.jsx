import React from "react";

import "./PreferenceItem.css";

function PreferenceItem({ value, status, index, pressHandler }) {
  // const [newStatus, setNewStatus] = useState(status);

  // const changeStatus = (v, i, status) => {
  //   setNewStatus(!newStatus);
  //   console.log("this is val >", newStatus);

  //   const params = JSON.stringify({

  //   });

  // };

  return (
    <button
      className={`preference-item ${status ? "preference-item--active" : ""}`}
      // className="secondaryButtonActive"
      onClick={() => pressHandler(index, value, status)}
    >
      {value}
    </button>
  );
}

export default PreferenceItem;
