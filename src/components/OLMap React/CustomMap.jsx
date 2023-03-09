import React, { useEffect, useState } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";
import resized from "../../assets/images/resize.png";


import mapConfig from "./config.json";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;


function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: resized,
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

function CustomMap({ coord }) {
  console.log("coord in JourneyMap", coord);
  const markersLonLat = coord;
  const [center, setCenter] = useState(coord);
  const [zoom, setZoom] = useState(14);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(false);

  const [configTest, setConfigTest] = useState({
    geojsonObject2: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            kind: "county",
            name: "Karachi",
            state: "XYZ",
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[coord]],
          },
        },
      ],
    },
  });

  const [features, setFeatures] = useState(addMarkers(markersLonLat));

  useEffect(() => {
    console.log("OL MAP Cord", coord);
    // if (coord.length >= 400) {
    setConfigTest({
      geojsonObject2: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              kind: "county",
              name: "Karachi",
              state: "XYZ",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[coord]],
            },
          },
        ],
      },
    });
    // }
  }, [coord]);

  return (
    <div>
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
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>

      <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />
        Show markers
      </div>
    </div>
  );
}

export default CustomMap;
