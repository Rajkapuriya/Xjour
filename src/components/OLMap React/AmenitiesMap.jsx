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
import clinic from "../../assets/icons/xjour-icons/resized/clinic.webp";
import air from "../../assets/icons/xjour-icons/resized/air.png";
import bank from "../../assets/icons/xjour-icons/resized/bank.png";
import bus from "../../assets/icons/xjour-icons/resized/bus2.png";
import fun from "../../assets/icons/xjour-icons/resized/fun2.png";
import hotel from "../../assets/icons/xjour-icons/resized/hotel2.png";
import monument from "../../assets/icons/xjour-icons/resized/monument2.png";
import outdoor from "../../assets/icons/xjour-icons/resized/outdoor2.png";
import restaurant from "../../assets/icons/xjour-icons/resized/restaurant2.png";
import profession from "../../assets/icons/xjour-icons/resized/profession2.png";
import shop from "../../assets/icons/xjour-icons/resized/shop2.png";
import unclassified from "../../assets/icons/xjour-icons/resized/unclassified2.png";
import vocation from "../../assets/icons/xjour-icons/resized/vocation2.png";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;

function clinicMarkers(lonLatArray, amenityType) {
  console.log("value recieved", lonLatArray, amenityType);

  if (amenityType === "e") {
    var newArr = [];
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: clinic,
        anchor: [0.5, 1.0],
        opacity: 0.7,
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
        desc: "<pre> <b>Waypoint</b></pre>",
        type: "Point",
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "a") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: air,
        anchor: [0.5, 1.0],
        opacity: 0.7,
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "b") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: bank,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "r") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: restaurant,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "t") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: bus,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "h") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: hotel,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "f") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: fun,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "m") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: monument,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "s") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: shop,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "p") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: profession,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "u") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: unclassified,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "v") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: vocation,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
  if (amenityType === "o") {
    var newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: outdoor,
        anchor: [0.5, 0.5],
      }),
    });
    let features = newArr.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }
}

// testing
function getBox() {
  let box = new Object();
  box = Map.getCoordinates;
  return box;
}
function AmenitiesMap({ coord, APIResponse, amenityType, getCoordinates }) {
  // console.log("useEffect for separation of arrays", APIResponse);

  const [center, setCenter] = useState(coord);
  const [zoom, setZoom] = useState(14);
  const [features, setFeatures] = useState(null);

  useEffect(() => {
    console.log("useEffect for separation of arrays", APIResponse);

    setFeatures(clinicMarkers(APIResponse, amenityType));
  }, [APIResponse]);

  // useEffects

  // useEffects

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(false);
  const [showMarker, setShowMarker] = useState(true);
  return (
    <div>
      <Map
        center={fromLonLat(center)}
        zoom={zoom}
        features={features}
        getCoordinates={getCoordinates}
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get("EPSG:4326"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get("EPSG:4326"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {/* {showMarker && (
          <> */}
          {features != null && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
    </div>
  );
}

export default AmenitiesMap;
