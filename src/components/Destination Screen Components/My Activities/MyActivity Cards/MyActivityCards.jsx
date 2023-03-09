import React, { useState, useEffect } from "react";
import "./MyActivityCards.css";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../../../config/context api/StateProvider";

function MyActivityCards({ data, index }) {
  const history = useHistory();
  const [{}, dispatch] = useStateValue();
  const [selectedActivityData, setSelectedActivityData] = useState([]);

  useEffect(() => {
    if (data) {
      setSelectedActivityData({ data, index });
    }
  }, []);

  const readMoreActivities = () => {
    dispatch({
      type: "SET_SELECTED_ACTIVITY",
      reducerSelectedActivity: selectedActivityData,
    });
    history.push("/destinations/view-activities");
  };

  return (
    <div className="MyActivityCards" onClick={readMoreActivities}>
      <div className="MyActivityCards__detail">
        <div className="detail__dataLeft">
          <div className="details__dataLeftTop">
            <h3>{data?.name}</h3>
          </div>

          <div className="details__dataLeftBottom">
            {/* <p className="city">{data?.description}, </p> */}
            {/* <p className="city">{country}</p> */}
          </div>

          {!data?.countrySvg ? (
            <div className="myAcitivityScreenLoader__Country">
              <Oval color="#00BFFF" width={24} />
            </div>
          ) : (
            <img src={data.countrySvg} alt="" className="ActivitycountryFlag" />
          )}
        </div>

        {/* <div className="detail__button">
          <button className="primaryButtonActive" >
            Read More
          </button>
        </div> */}
      </div>

      <div className="MyActivityCards__image">
        {!data?.base64 ? (
          <div className="myAcitivityScreenLoader">
            <Oval color="#00BFFF" />
          </div>
        ) : (
          <img className="cardImage" src={data.base64} alt="" />
        )}
      </div>
    </div>
  );
}

export default MyActivityCards;
