import { Close, Message } from "@mui/icons-material";
import React, { useState } from "react";
import AddConnection from "../../Add Connection Component/AddConnection";
import "./CollapsibleForPostcard.css";

function CollapsibleForPostcard({ handleTriggerClose, getConnection }) {
  const [connectionComponent, setConnectionComponent] = useState(false);

  const connectionComponentActive = (e) => {
    // console.log("button Clicked", e);
    setConnectionComponent(!connectionComponent);
    // console.log(connectionComponent);
  };

  return (
    <div className="collapsiblePostcard">
      {!connectionComponent ? (
        <div className="addMenuOptions__svg">
          <div
            className="addMenuOptions__svgIcon"
            onClick={connectionComponentActive}
          >
            <Message />
            <p>Add Connection</p>
          </div>

          <div className="addMenuOptions__svgIcon">
            <Close onClick={handleTriggerClose} style={{ color: "#22b0ea" }} />
          </div>
        </div>
      ) : (
        <div className="addMenuOptions__component">
          {connectionComponent && (
            <div>
              <AddConnection
                getConnection={getConnection}
                connectionComponentActive={connectionComponentActive}
              />
              {/* <div className="addMenuOptions__svgIcon">
                <Close
                  onClick={connectionComponentActive}
                  style={{ color: "#22b0ea" }}
                />
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollapsibleForPostcard;
