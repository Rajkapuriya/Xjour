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

function JourneyMap({ coord, cordinateArray, wayPointMarkers, centerVal }) {
  console.log("JourneyMap wayPointMarkers", wayPointMarkers);


  const [center, setCenter] = useState(centerVal);
  const [markersCoords, setMarkersCoords] = useState([]);


  const [zoom, setZoom] = useState(2);

  const [showLayer2, setShowLayer2] = useState(true);

  const [configTest, setConfigTest] = useState({
    geojsonObject2: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
        
          geometry: {
            type: "MultiLineString",
            coordinates: [coord],
          },
        },
      ],
    },
  });

  const [features, setFeatures] = useState(addMarkers(markersLonLat));



  useEffect(() => {

      setConfigTest({
        geojsonObject2: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "MultiLineString",
                coordinates: [coord],
              },
            },
          ],
        },
      });
    
  }, [coord]);

  useEffect(() => {
    if (wayPointMarkers) {
      // console.log("useEffect Triggered for cords", clinicArray);

      var newArr = wayPointMarkers.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setMarkersCoords([...newArr]);
   
    }
  }, [wayPointMarkers]);

  useEffect(() => {
    setFeatures(addMarkers(markersCoords));
  }, [markersCoords]);

  return (
    <div>
      <Map
        center={fromLonLat(center)}
        // center={fromLonLat(centerVal)}
        centerVal={centerVal}
        zoom={zoom}
        coord={coord}
        configTest={configTest}
        features={features}
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

export default JourneyMap;
