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
import mapConfig from "./config.json";

const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

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

function OLMapReact({ coord, extentVal,feature }) {
  // console.log("OL MAP CordArrray", coord);
  const [center, setCenter] = useState(coord[Math.floor(coord?.length / 2)]);
  console.log("centerVal", center);

  const [zoom, setZoom] = useState(15);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(false);

  const [configTest, setConfigTest] = useState({

    geojsonObject2: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          // properties: {
          //   kind: "county",
          //   name: "Karachi",
          //   state: "XYZ",
          // },
          geometry: {
            type: "MultiLineString",
            coordinates: [coord],
          },
        },
      ],
    },

  });


  const [features, setFeatures] = useState(addMarkers(feature));




  useEffect(() => {
    // var arrayVal = []


    // arrayVal.push(coord[0])
    // arrayVal.push(coord[coord.length-1])


    // console.log("arrayVal",arrayVal)


    // setFeatures(arrayVal)

    console.log("OL MAP configTest", configTest);
  }, [configTest]);

  return (
    <div>
      <Map
        center={fromLonLat(center)}
        centerVal={center}
        zoom={zoom}
        coord={coord}
        configTest={configTest}
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />

          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  configTest.geojsonObject2,
                  {
                    featureProjection: get("EPSG:3857"),
                  }
                ),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          <VectorLayer source={vector({ features })} />
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>

    </div>
  );
}

export default OLMapReact;
