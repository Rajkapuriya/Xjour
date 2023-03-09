import React, { useState } from "react";
import { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import "./MiniPeopleCards.css";

function MiniPeopleCards({ data, index, handleClick }) {
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (data.base64 === null) {
      setIsloading(true);
    }
  }, [data, data.base64]);

  return (
    <div className="miniPeopleCards" onClick={() => handleClick(data, index)}>
      <div className="miniPeopleCards__body">
        <div className="miniPeopleCards__bodyAvatar">
          {!data?.base64 ? (
            <div className="">
              <Oval color="#00BFFF" height={40} width={40} />
            </div>
          ) : (
            <img className="miniPeopleCard__image" src={data?.base64} alt="" />
          )}
        </div>

        <div className="miniPeopleCards__bodyBio">
          <div className="miniPeopleCards__bodyName">
            <h5>{data.firstName}</h5>
            <h5>{data.lastName}</h5>
          </div>

          <div className="miniPeopleCards__bodyCountry">
            {!data?.countrySvg ? (
              <div className="">
                <Oval color="#00BFFF" height={40} width={40} />
              </div>
            ) : (
              <img
                className="miniCardCountryFlag"
                src={data?.countrySvg}
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniPeopleCards;
