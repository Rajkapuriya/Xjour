import { memo, useState } from "react";
import { fromLonLat } from "ol/proj";

import "./GeneralMap.css";

import mapConfig from "../config.json";

import { addMarkers, clinicMarkers } from "./utils/markers";

import FeatureStyles from "../Features/Styles";
import { Layers, TileLayer, VectorLayer } from "../Layers";
import { osm, vector } from "../Source";
import { Controls, FullScreenControl, ZoomControl } from "../Controls";
import Map from "../Map";
import AmenitiesLayer from "./AmenitiesLayer/AmenitiesLayer";

function GeneralMap(props) {
  const {
    coord,
    center = mapConfig.center,
    markersType = "basic",
    zoom = 5,
    zoomChangeHandler,
    boundsChangeHandler,
  } = props;

  const features = (function () {
    if (!coord) return null;

    switch (markersType) {
      case "basic":
        return addMarkers(coord);
      default:
        return null;
    }
  })();

  return (
    <div className="general-map">
      <Map
        center={fromLonLat(center ? center : mapConfig.center)}
        zoom={zoom}
        zoomChangeHandler={zoomChangeHandler}
        boundsChangeHandler={boundsChangeHandler}
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />

          {markersType === "amenities" && <AmenitiesLayer />}

          {markersType === "basic" && features && (
            <VectorLayer source={vector({ features })} />
          )}
        </Layers>

        <Controls>
          <FullScreenControl />
          <ZoomControl />
        </Controls>
      </Map>
    </div>
  );
}

export default memo(GeneralMap);
