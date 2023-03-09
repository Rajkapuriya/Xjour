// import React, { useState } from "react";
// import OlMap from "ol/Map";
// import OlView from "ol/View";
// import OlLayerTile from "ol/layer/Tile";
// import OlSourceOsm from "ol/source/OSM";
// import OlSourceTileWMS from "ol/source/TileWMS";
// import OlLayerGroup from "ol/layer/Group";
// // import "ol/ol.css";
// // import "antd/dist/antd.min.css";
// // import "./react-geo.css";
// // import "./react-geo.css";
// // import "./ReactOLMap.css";
// import {
//   MapComponent,
//   SimpleButton,
//   NominatimSearch,
//   MeasureButton,
//   LayerTree,
// } from "@terrestris/react-geo";
// import { Drawer } from "antd";
// import { fromLonLat } from "ol/proj";
// import TileLayer from "ol/layer/Tile";
// import VectorSource from "ol/source/Vector";
// import { Vector } from "ol/layer";
// import { Circle, Fill, Stroke, Style } from "ol/style";
// import { Polygon } from "ol/geom";
// import { Feature, View } from "ol";

// const layerGroup = new OlLayerGroup({
//   name: "Layergroup",
//   layers: [
//     new OlLayerTile({
//       source: new OlSourceOsm(),
//       name: "OSM",
//     }),
//     new OlLayerTile({
//       name: "SRTM30-Contour",
//       minResolution: 0,
//       maxResolution: 10,
//       source: new OlSourceTileWMS({
//         url: "https://ows.terrestris.de/osm/service",
//         params: {
//           LAYERS: "SRTM30-Contour",
//         },
//       }),
//     }),
//     new OlLayerTile({
//       name: "OSM-Overlay-WMS",
//       minResolution: 0,
//       maxResolution: 200,
//       source: new OlSourceTileWMS({
//         url: "https://ows.terrestris.de/osm/service",
//         params: {
//           LAYERS: "OSM-Overlay-WMS",
//         },
//       }),
//     }),
//   ],
// });
// const layer = new OlLayerTile({
//   source: new OlSourceOsm(),
// });

// const center = [788453.4890155146, 6573085.729161344];

// function ReactOLMap() {
//   const [visible, setVisible] = useState(false);

//   const toggleDrawer = () => {
//     setVisible(!visible);
//   };

//   //Declare a new array
//   var coordinatesPolygon = new Array();
//   //Cycle traversal transfers longitude and latitude to the projection coordinate system of "EPSG:4326"
//   for (var i = 0; i < coordinates.length; i++) {
//     var pointTransform = fromLonLat(
//       [coordinates[i][0], coordinates[i][1]],
//       "EPSG:4326"
//     );
//     coordinatesPolygon.push(pointTransform);
//   }

//   //Tile Layer
//   var tileLayer = new TileLayer({
//     source: new OlSourceOsm(),
//   });

//   var source = new VectorSource();
//   //Vector Layer
//   var vector = new Vector({
//     source: source,
//     style: new Style({
//       fill: new Fill({
//         color: "rgba(255, 255, 255, 0.1)",
//       }),
//       stroke: new Stroke({
//         color: "red",
//         width: 2,
//       }),
//       image: new Circle({
//         radius: 10,
//         fill: new Fill({
//           color: "#ffcc33",
//         }),
//       }),
//     }),
//   });

//   //The polygon here must be an array of coordinates
//   var plygon = new Polygon([coordinatesPolygon]);
//   //Polygon feature class
//   var feature = new Feature({
//     geometry: plygon,
//   });
//   console.log(feature);
//   source.addFeature(feature);
//   console.log(vector.getSource().getFeatures().length);
//   var view = new View({
//     center: [116.46, 39.92],
//     zoom: 10,
//     projection: "EPSG:4326",
//   });

//   const map = new OlMap({
//     view: new OlView({
//       center: center,
//       zoom: 16,
//     }),
//     layers: [layer, layerGroup, tileLayer],
//   });

//   return (
//     <div className="reactOLMap">
//       <MapComponent
//         map={map}
//         style={{
//           height: "400px",
//         }}
//       />
//       <SimpleButton
//         // style={{ position: "fixed", top: "30px", right: "30px" }}
//         onClick={toggleDrawer}
//         iconName="bars"
//       />
//       <Drawer
//         title="react-geo-application"
//         placement="right"
//         onClose={toggleDrawer}
//         visible={visible}
//         mask={false}
//       >
//         <NominatimSearch
//           key="search"
//           map={map}
//           style={{
//             width: "100%",
//           }}
//         />

//         <MeasureButton
//           key="measureButton"
//           name="line"
//           map={map}
//           measureType="line"
//           iconName="pen"
//           pressedIconName="pen"
//         >
//           Measure distance
//         </MeasureButton>
//         <LayerTree map={map} layerGroup={layerGroup} />
//       </Drawer>
//     </div>
//   );
// }

// export default ReactOLMap;
