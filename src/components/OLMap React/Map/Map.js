import React, { useRef, useState, useEffect, memo } from "react";
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import {
  fromLonLat,
  toLonLat,
  transformExtent,
  transformWithProjections,
} from "ol/proj";
import { transform } from "ol/proj";

const Map = ({
  children,
  zoom,
  zoomChangeHandler,
  center,
  configTest,
  features5,
  features4,
  features3,
  features2,
  features,
  getCoordinates,
  boundsChangeHandler,
}) => {
  const mapRef = useRef();
  var [map, setMap] = useState(null);

  useEffect(() => {
    let options = {
      view: new ol.View({
        center,
        zoom: zoom,

        // extent: [529449 - 1000, 189252 - 1000, 529449 + 1000, 189252 + 1000],
      }),
      layers: [],
      controls: [],
      overlays: [],
    };

    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, [center, zoom]);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    // console.log("Map Bounds:", map.getView());
    // console.log("Map Bounds:", map.getViewcalculateExtent(map.getSize()));
    // console.log("Map Bounds:", map.getBounds());

    map.on("movestart", function (event) {
      //console.log("Map Bounds drag:", map.getView());
      const newCoords = toLonLat(map.getView().getCenter());
      //console.log("Map Bounds Cordinates:", newCoords);
      if (getCoordinates) {
        getCoordinates(newCoords);
      }
    });

    map.on("moveend", function (event) {
      const bounds = event.map.getView().calculateExtent(map.getSize());

      console.log("%cmoveend event:", "background-color:yellow;", event);
      console.log("%cbounds:", "background-color:yellow;", bounds);
      console.log(transformExtent(bounds, "EPSG:3857", "EPSG:4326"));

      if (zoomChangeHandler) {
        zoomChangeHandler(event.map.getView().getZoom());
      }

      if (boundsChangeHandler) {
        boundsChangeHandler(transformExtent(bounds, "EPSG:3857", "EPSG:4326"));
      }
    });

    map.getView().on("propertychange", function (e) {
      // console.log("%cpropertyChange:", "background-color:red;color:white;", e);
      // switch (e.key) {
      //   case "resolution":
      //     console.log("Map Bounds extent:", e.target.projection_.extent_);
      //     console.log("Map Bounds Zoom:", map.getView().values_.center);
      //     console.log("Map Bounds Zoom:", map.getView().getCenter());
      //     console.log(
      //       "Map Bounds Cordinates:",
      //       toLonLat(map.getView().getCenter())
      //     );
      //     console.log("Map Zoom:", map.getView().getZoom());
      //     break;
      // }
    });

    map.getView().setZoom(zoom);
  }, [boundsChangeHandler, getCoordinates, map, zoom, zoomChangeHandler]);

  // map.getView().on('change:resolution', (event) => {
  //   console.log("zoom changed");
  // });

  // useEffect(() => {
  //   if (!map) return;
  //   console.log("centerVal", centerVal);

  //   map.getView().setCenter(centerVal);
  // }, [configTest, centerVal]);

  // center change handler
  // useEffect(() => {
  //   if (!map) return;

  //   // let view = map.getView();
  //   // let extentCoords = view.calculateExtent(map.getSize());
  //   // // console.log("center useEffect triggered", extentCoords);
  //   // console.log("center useEffect triggered", centerVal);

  //   // console.log(
  //   //   "center useEffect triggered",
  //   //   map.getView().calculateExtent(map.getSize())
  //   // );
  // }, [configTest, center]);

  // useEffect(() => {
  //   if (!map) return;
  //   var boundaryBox = boundingExtent(coord);

  //   console.log("boundaryBox", boundaryBox);

  //   const extent = transformExtent(boundaryBox, "EPSG:4326", "EPSG:3857");

  //   console.log("boundaryBox", extent);

  //   console.log("mapdata", map.getView());
  // }, [configTest]);

  // useEffect(() => {
  //   var boundaryBox = boundingExtent(coord);
  //   console.log("boundaryBox", boundaryBox);
  //   const extent = transformExtent(boundaryBox, "EPSG:4326", "EPSG:3857");
  //   map.getView().fit(extent);
  // }, [coord]);

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default memo(Map);
