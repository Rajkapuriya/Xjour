// import React from "react";
// import Grid from "@material-ui/core/Grid";

// // Start Openlayers imports
// import { Feature, Map, View } from "ol";
// import { GeoJSON, XYZ } from "ol/format";
// import { Tile as TileLayer, Vector, Vector as VectorLayer } from "ol/layer";
// import {
//   Vector as VectorSource,
//   OSM as OSMSource,
//   XYZ as XYZSource,
//   TileWMS as TileWMSSource,
// } from "ol/source";
// import {
//   Select as SelectInteraction,
//   defaults as DefaultInteractions,
//   Draw,
// } from "ol/interaction";
// import { fromLonLat } from "ol/proj";
// import {
//   Attribution,
//   ScaleLine,
//   ZoomSlider,
//   Zoom,
//   Rotate,
//   MousePosition,
//   OverviewMap,
//   defaults as DefaultControls,
// } from "ol/control";
// import {
//   Style,
//   Fill as FillStyle,
//   RegularShape as RegularShapeStyle,
//   Stroke as StrokeStyle,
// } from "ol/style";

// import { Projection, get as getProjection } from "ol/proj";
// import { Polygon } from "ol/geom";

// export default class OLMapFragment extends Component {
//   render() {
//     class MapMain extends React.Component {
//       constructor(props) {
//         super(props);

//         // Define base layer
//         this.baseLayer = new TileLayer({ source: new OSM() });

//         // Define base view
//         this.baseView = new View({
//           center: fromLonLat([37.41, 8.82]),
//           zoom: 4,
//         });

//         // Add map, base view and layer
//         this.map = new Map({
//           layers: [this.baseLayer],
//           view: this.baseView,
//         });
//       }

//       static childContextTypes = {
//         map: PropTypes.object,
//       };

//       getChildContext() {
//         return {
//           map: this.map,
//         };
//       }

//       componentDidMount() {
//         // set map target element
//         this.map.setTarget(this.refs.map);
//       }

//       render() {
//         return <div ref="map">{this.props.children}</div>;
//       }
//     }

//     class Polygon extends React.Component {
//       // static contextTypes = {
//       //   map: PropTypes.object,
//       // };

//       componentDidMount() {
//         const source = new Vector({ wrapX: false });
//         this.polygonBase = new VectorLayer({ source });
//         this.context.map.addLayer(this.polygonBase);

//         const styleFunction = (feature) => {
//           var geometry = feature.getGeometry();
//           console.log("geometry", geometry.getType());
//           if (geometry.getType() === "LineString") {
//             var styles = [
//               new Style({
//                 stroke: new StrokeStyle({
//                   color: "rgba(255, 102, 0, 1)",
//                   width: 3,
//                 }),
//               }),
//             ];
//             return styles;
//           }
//           if (geometry.getType() === "Point") {
//             var styles = [
//               new Style({
//                 image: new RegularShapeStyle({
//                   radius: 5,
//                   stroke: new StrokeStyle({ color: "rgba(255, 0, 0, 1)" }),
//                   fill: new FillStyle({ color: "rgba(255, 0, 0, 0.5)" }),
//                 }),
//               }),
//             ];
//             return styles;
//           }
//           if (geometry.getType() === "Polygon") {
//             var styles = [
//               new Style({
//                 stroke: new StrokeStyle({
//                   color: "rgba(255, 102, 0, 0)",
//                   width: 3,
//                 }),
//                 fill: new FillStyle({
//                   color: "rgba(255, 102, 0, 0.3)",
//                 }),
//               }),
//             ];
//             return styles;
//           }
//           return false;
//         };

//         // Define the polygon draw interaction
//         this.draw = new Draw({
//           source: source,
//           type: "Polygon",
//           style: styleFunction,
//         });
//         // Add the draw interaction
//         this.context.map.addInteraction(this.draw);

//         this.draw.on("drawstart", (event) => {
//           this.polygonFirstCoordinate = event.feature
//             .getGeometry()
//             .getFirstCoordinate();
//         });
//       }

//       componentWillUnmount() {
//         this.context.map.removeInteraction(this.draw);
//       }

//       render() {
//         return <p>Drawing polygon</p>;
//       }
//     }
//     return (
//       <MapMain>
//         <Polygon />
//       </MapMain>
//     );
//   }
// }
