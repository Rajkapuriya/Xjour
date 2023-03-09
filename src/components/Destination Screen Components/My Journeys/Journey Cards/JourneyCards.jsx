import React from "react";
import "./JourneyCards.css";

function JourneyCards({ data, index, getJourneyData, userGroupDetails }) {
  return (
    <div className="journeyCards">
      <h3>{data.name}</h3>
      <div className="journeyCards__container">
        <div className="container__leftCard">
          <div className="startDestination">
            <h5>Start Destination</h5>
            {!data.creationDateTime ? <p>{data.creationDateTime}</p> : "NAN"}
          </div>
          <div className="startDestination">
            <h5>End Destination</h5>
            {!data.followUpDateTime ? <p>{data.followUpDateTime}</p> : "NAN"}
          </div>

          <div className="dateSection">
            <div className="dateSection__start">
              <h5>Start Date</h5>
              {!data.startDateTime ? <p>{data.startDateTime}</p> : "NAN"}
            </div>
            <div className="dateSection__end">
              <h5>End Date</h5>
              {!data.endDateTime ? <p>{data.endDateTime}</p> : "NAN"}
            </div>
          </div>

          <div className="routeSection">
            <h5>Route</h5>

            {data.routeState ? (
              <p>
                {data.routeStart} {data.routes} {data.routes} {data.routeEnd}
              </p>
            ) : (
              "NAN"
            )}
            {/* <p></p>
            <p></p> */}
          </div>
        </div>
        <div className="container__rightCard">
          <div className="rightCard__container">
            {!data?.base64 ? (
              <div className="myDestinationCards__imageLoader">
                {/* <Oval color="#00BFFF" height={40} width={40} /> */}
                <img
                  className="cardImage"
                  src={userGroupDetails.base64}
                  alt=""
                />
              </div>
            ) : (
              <>
                {data?.base64 ? (
                  <img className="cardImage" src={data.base64} alt="" />
                ) : (
                  <img
                    className="cardImage"
                    src={userGroupDetails.base64}
                    alt=""
                  />
                )}
              </>
            )}
          </div>
          <div
            className="detailButton"
            onClick={() => getJourneyData(data, index)}
          >
            <button
              className="primaryButtonActive "
              // onClick={() => history.push("/destinations/new-journey")}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JourneyCards;
