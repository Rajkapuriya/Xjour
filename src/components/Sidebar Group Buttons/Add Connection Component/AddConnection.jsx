import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../../config/context api/StateProvider";
import MiniPeopleCards from "../../Connect Screen Components/My Connections/People Section/Mini People Cards/MiniPeopleCards";
import "./AddConnection.css";
import { Oval } from "react-loader-spinner";

function AddConnection({ connectionComponentActive, getConnection }) {
  const [{ reducerMyConnectionPeople }, dispatch] = useStateValue();
  const [connectionArray, setConnectionArray] = useState([]);
  const [loader, isLoading] = useState(true);

  useEffect(() => {
    // console.log("reducerMyConnectionPeople", reducerMyConnectionPeople);
    if (reducerMyConnectionPeople) {
      if (reducerMyConnectionPeople.length > 0) {
        setConnectionArray(reducerMyConnectionPeople);
        isLoading(false);
        // console.log("reducerMyConnectionPeople", reducerMyConnectionPeople);
      }
    } else {
      isLoading(false);
      setConnectionArray([]);
      // console.log("reducerMyConnectionPeople", reducerMyConnectionPeople);
    }
  }, [reducerMyConnectionPeople]);

  return (
    <div className="addConnection">
      <div className="addMenu__closeButton">
        <Close
          onClick={connectionComponentActive}
          style={{ color: "#22b0ea" }}
        />
        <h3>Close</h3>
      </div>
      {loader ? (
        <div className="collapisible__loader">
          <Oval color="#00BFFF" />
        </div>
      ) : (
        <>
          {connectionArray?.length <= 0 ? (
            <div className="collapsibleItem__text">
              <h5>No Connections</h5>
            </div>
          ) : (
            <>
              {connectionArray?.map((v, i) => (
                <MiniPeopleCards
                  key={v + i}
                  index={i}
                  data={v}
                  handleClick={getConnection}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AddConnection;
