import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";

import mapConfig from "../../config.json";

import clinic from "assets/icons/xjour-icons/resized/clinic.webp";
import air from "assets/icons/xjour-icons/resized/air.png";
import bank from "assets/icons/xjour-icons/resized/bank.png";
import bus from "assets/icons/xjour-icons/resized/bus2.png";
import fun from "assets/icons/xjour-icons/resized/fun2.png";
import hotel from "assets/icons/xjour-icons/resized/hotel2.png";
import monument from "assets/icons/xjour-icons/resized/monument2.png";
import outdoor from "assets/icons/xjour-icons/resized/outdoor2.png";
import restaurant from "assets/icons/xjour-icons/resized/restaurant2.png";
import profession from "assets/icons/xjour-icons/resized/profession2.png";
import shop from "assets/icons/xjour-icons/resized/shop2.png";
import unclassified from "assets/icons/xjour-icons/resized/unclassified2.png";
import vocation from "assets/icons/xjour-icons/resized/vocation2.png";

export function addMarkers(lonLatArray) {
  console.log(
    "%clonLatArray in addMarkers:",
    "background-color:purple;color:white;",
    lonLatArray
  );
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: mapConfig.markerImage32,
      anchor: [0.5, 1.0],
      opacity: 0.7,
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

export function clinicMarkers(lonLatArray, amenityType) {
  console.log("value recieved", lonLatArray, amenityType);

  let newArr = [],
    iconStyle;

  if (amenityType === "e") {
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
    newArr = lonLatArray.map(function (val, index) {
      return [val.longitude, val.latitude];
    });

    iconStyle = new Style({
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
