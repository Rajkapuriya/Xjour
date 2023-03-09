import { useMemo } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";

import "./MyDestinationCards.css";

import ImagePlaceholder from "assets/images/image-placeholder.jpg";

import MiniMap from "components/OLMap React/MiniMap";
import ButtonAtom from "components/Atoms/Button/Button";
import GeneralMap from "components/OLMap React/GeneralMap/GeneralMap";

function MyDestinationCards({ data, index, getDestinationData }) {
  // console.log("data", data);
  const history = useHistory();
  // const moveToView = () => {
  //   console.log("this is Move to view");
  //   history.push("/destinations/view-destination");
  // };

  const coord = useMemo(() => {
    return [data?.longitude, data?.latitude];
  }, [data?.latitude, data?.longitude]);

  return (
    <>
      {data && !data.type && (
        <section className="my-destination-cards">
          <div className="my-destination-cards__detail">
            <h1 className="my-destination-cards__title">{data?.name}</h1>

            <div className="my-destination-cards__flag-container">
              {!data?.countrySvg ? (
                <div className="my-destination-cards__flag-placeholder"></div>
              ) : (
                <img
                  className="my-destination-cards__flag"
                  src={data.countrySvg}
                  alt=""
                />
              )}
            </div>

            <ButtonAtom
              variant="filled"
              fontSize="medium"
              onClick={() => {
                getDestinationData(data, index);
              }}
            >
              READ MORE
            </ButtonAtom>
          </div>

          <div className="my-destination-cards__image-map-container">
            <div className="my-destination-cards__map-container">
              {coord?.length >= 1 && (
                <GeneralMap
                  coord={[coord]}
                  center={coord}
                  zoom={data?.mapZoom}
                />
              )}
            </div>

            <div className="my-destination-cards__image-container">
              <img
                src={data?.base64 ? data.base64 : ImagePlaceholder}
                alt="Destination"
                className="my-destination-cards__image"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default MyDestinationCards;
