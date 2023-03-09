import React, { useEffect, useState } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import FeatureStyles from "./Features/Styles";
import mapConfig from "./config.json";

const geojsonObject = mapConfig.geojsonObject;

// const markersLonLat = [];

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

function MiniMap({ coord }) {
  // console.log("coord", coord);
  const markersLonLat = [coord];
  const [center, setCenter] = useState(coord);
  const [zoom, setZoom] = useState(14);
  const [features, setFeatures] = useState(addMarkers(markersLonLat));

  useEffect(() => {
    const updatedMarker = [coord];
    setCenter(coord);
    setFeatures(addMarkers(updatedMarker));
  }, [coord]);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  return (
    <div style={{ height: "100%" }}>
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}

          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
      </Map>

      <hr />
    </div>
  );
}

export default MiniMap;
