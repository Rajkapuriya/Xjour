// import React, { useState, useRef, useEffect } from "react";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// import XYZ from "ol/source/XYZ";
// import { fromLonLat, transform } from "ol/proj";
// import { toStringXY } from "ol/coordinate";
// import Polygon from "ol/geom/Polygon";
// import { Feature } from "ol";
// import Interaction from "ol/interaction/Interaction";
// import { polygon } from "leaflet";
// import { OSM } from "ol/source";
// import { Circle, Fill, Stroke, Style } from "ol/style";
// // import ol from "openlayers";

// function OpenLayersReact(props) {
//   const [map, setMap] = useState();
//   const [featuresLayer, setFeaturesLayer] = useState();
//   const [selectedCoord, setSelectedCoord] = useState(props.coord);
//   console.log("selectedCoord", selectedCoord);

//   // get ref to div element - OpenLayers will render into this div
//   const mapElement = useRef();

//   const mapRef = useRef();
//   mapRef.current = map;

//   useEffect(() => {
//     // create and add vector source layer
//     const initalFeaturesLayer = new VectorLayer({
//       source: new VectorSource(),
//     });

//     // create map
//     const initialMap = new Map({
//       target: mapElement.current,
//       layers: [
//         // USGS Topo
//         new TileLayer({
//           source: new XYZ({
//             url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
//           }),
//         }),

//         initalFeaturesLayer,
//       ],
//       view: new View({
//         projection: "EPSG:3857",
//         center: [0, 0],
//         zoom: 2,
//       }),
//       controls: [],
//     });

//     initialMap.on("click", handleMapClick);
//     // save map and vector layer references to state
//     setMap(initialMap);
//     setFeaturesLayer(initalFeaturesLayer);

//     const coords = props.coord;
//     //   // var coordinates = [
//     //   //   [117.39680614984, 40.233089086201],
//     //   //   [117.3600565732, 40.242113456225],
//     //   //   [117.34874458404, 40.250260274602],
//     //   //   [117.34302344712, 40.283707567814],
//     //   //   [117.30241786584, 40.284010303013],
//     //   //   [117.30089945595, 40.298823482743],
//     //   //   [117.29495791414, 40.307241631948],
//     //   //   [117.28090327938, 40.31483263219],
//     //   //   [117.27787165052, 40.331469477361],
//     //   //   [117.28158063671, 40.338247525913],
//     //   //   [117.26875571365, 40.343837920124],
//     //   //   [117.24821332321, 40.376802733207],
//     //   //   [117.23311626435, 40.375365915021],
//     //   //   [117.23011329982, 40.381697774551],
//     //   //   [117.22184575331, 40.383995827578],
//     //   //   [117.21027968492, 40.379304161599],
//     //   //   [117.18913489167, 40.383847635371],
//     //   //   [117.16955596667, 40.377573094897],
//     //   //   [117.16201098872, 40.379609944384],
//     //   //   [117.15156389182, 40.374358469115],
//     //   //   [117.1461431628, 40.367421131629],
//     //   //   [117.12300485064, 40.359558075585],
//     //   //   [117.11864440401, 40.358974561797],
//     //   //   [117.11380102691, 40.364149005012],
//     //   //   [117.10453631204, 40.365747471036],
//     //   //   [117.07808699163, 40.347405333082],
//     //   //   [117.06520517495, 40.342543682533],
//     //   //   [117.05951109694, 40.349081054111],
//     //   //   [117.04244565157, 40.35250818155],
//     //   //   [117.0250699279, 40.340493098635],
//     //   //   [117.02117101934, 40.333168625588],
//     //   //   [117.01588753438, 40.331656255311],
//     //   //   [117.01173132175, 40.32337571318],
//     //   //   [117.01591420209, 40.312498282132],
//     //   //   [117.00799784424, 40.305823430052],
//     //   //   [117.00636157925, 40.296778788538],
//     //   //   [116.9970503394, 40.296137984976],
//     //   //   [116.99575758984, 40.292616557636],
//     //   //   [116.97796493669, 40.288167135931],
//     //   //   [116.97696786259, 40.282481020224],
//     //   //   [116.97075825127, 40.28108093448],
//     //   //   [116.95848391237, 40.267707809995],
//     //   //   [116.95715258101, 40.263327709699],
//     //   //   [116.98168044494, 40.25377572019],
//     //   //   [116.96338018644, 40.238052279683],
//     //   //   [116.95795687613, 40.242937187356],
//     //   //   [116.94329751003, 40.238005833847],
//     //   //   [116.93175719996, 40.233136537486],
//     //   //   [116.92430219371, 40.224967956262],
//     //   //   [116.93485016275, 40.210980369693],
//     //   //   [116.94526901764, 40.19855812205],
//     //   //   [116.94603449564, 40.19354561168],
//     //   //   [116.94951752277, 40.188098708124],
//     //   //   [116.95882736017, 40.177581436424],
//     //   //   [116.97897749255, 40.176575285822],
//     //   //   [116.97881329629, 40.154560252512],
//     //   //   [116.97587001134, 40.146838503303],
//     //   //   [116.98371154588, 40.133455992809],
//     //   //   [116.97593603278, 40.124828346814],
//     //   //   [116.98315680573, 40.100140533332],
//     //   //   [116.97155622343, 40.086210562194],
//     //   //   [116.99084261053, 40.081393909686],
//     //   //   [116.98663839805, 40.06927009966],
//     //   //   [116.96955722573, 40.068076860016],
//     //   //   [116.96884211824, 40.057480462171],
//     //   //   [116.97636631342, 40.054371684127],
//     //   //   [116.9795686888, 40.047516077888],
//     //   //   [116.98518115869, 40.044388313572],
//     //   //   [116.99304702223, 40.045029326691],
//     //   //   [117.00085160401, 40.042331508548],
//     //   //   [117.00745407085, 40.038313328591],
//     //   //   [117.03161208113, 40.040467631252],
//     //   //   [117.04575150493, 40.055833869462],
//     //   //   [117.06992028353, 40.067915618111],
//     //   //   [117.08846730729, 40.070826442849],
//     //   //   [117.09595404341, 40.076218017715],
//     //   //   [117.11977736834, 40.07863161916],
//     //   //   [117.1425959885, 40.070345862074],
//     //   //   [117.16234951106, 40.075084806785],
//     //   //   [117.16799658016, 40.082010788788],
//     //   //   [117.18330740326, 40.078432633031],
//     //   //   [117.19158959317, 40.091180779552],
//     //   //   [117.21946331827, 40.102793872514],
//     //   //   [117.23085386426, 40.100744473507],
//     //   //   [117.2308084102, 40.104832177913],
//     //   //   [117.2565631512, 40.125816298924],
//     //   //   [117.26463610295, 40.118734529522],
//     //   //   [117.2720390385, 40.117442160668],
//     //   //   [117.28248965384, 40.119346336362],
//     //   //   [117.29631227787, 40.128663778615],
//     //   //   [117.30298578394, 40.127129306082],
//     //   //   [117.31838231488, 40.145192295628],
//     //   //   [117.35175120566, 40.14858516025],
//     //   //   [117.3647252165, 40.166701558473],
//     //   //   [117.36002676882, 40.179323942797],
//     //   //   [117.37183376251, 40.184576516774],
//     //   //   [117.39959624353, 40.184618207342],
//     //   //   [117.41343867583, 40.191765541398],
//     //   //   [117.41039919172, 40.194936098147],
//     //   //   [117.39584874998, 40.193328689781],
//     //   //   [117.3867886771, 40.198351231932],
//     //   //   [117.38715826407, 40.205987067737],
//     //   //   [117.39482310976, 40.20909112999],
//     //   //   [117.39525305779, 40.212222926017],
//     //   //   [117.38556017544, 40.214479099127],
//     //   //   [117.38481402713, 40.223681632946],
//     //   //   [117.3994912696, 40.227137227499],
//     //   //   [117.39680614984, 40.233089086201],
//     //   // ];

//     //   // //Declare a new array
//     //   // var coordinatesPolygon = new Array();
//     //   // //Cycle traversal transfers longitude and latitude to the projection coordinate system of "EPSG:4326"
//     //   // for (var i = 0; i < coordinates.length; i++) {
//     //   //   var pointTransform = fromLonLat(
//     //   //     [coordinates[i][0], coordinates[i][1]],
//     //   //     "EPSG:4326"
//     //   //   );
//     //   //   coordinatesPolygon.push(pointTransform);
//     //   // }

//     //   // //Tile Layer
//     //   // var tileLayer = new TileLayer({
//     //   //   source: new OSM(),
//     //   // });

//     //   // var source = new VectorSource();
//     //   // //Vector Layer
//     //   // var vector = new Vector({
//     //   //   source: source,
//     //   //   style: new Style({
//     //   //     fill: new Fill({
//     //   //       color: "rgba(255, 255, 255, 0.1)",
//     //   //     }),
//     //   //     stroke: new Stroke({
//     //   //       color: "red",
//     //   //       width: 2,
//     //   //     }),
//     //   //     image: new Circle({
//     //   //       radius: 10,
//     //   //       fill: new Fill({
//     //   //         color: "#ffcc33",
//     //   //       }),
//     //   //     }),
//     //   //   }),
//     //   // });

//     // //The polygon here must be an array of coordinates
//     // var plygon = new Polygon([coordinatesPolygon])
//     // //Polygon feature class
//     // var feature = new Feature({
//     //     geometry: plygon,
//     // });
//     // console.log(feature);
//     // source.addFeature(feature);
//     // console.log(vector.getSource().getFeatures().length);
//     // var view=new ol.View({
//     //     center:[116.46,39.92],
//     //     zoom: 10,
//     //     projection: "EPSG:4326"
//     // });

//     const polygon = new Polygon(coords);
//     polygon.transform("EPSG:4326", "EPSG:3857");
//     const feature = new Feature({
//       geometry: polygon,
//     });
//     const source = new VectorSource();
//     source.addFeature(feature);
//   }, []);

//   useEffect(() => {
//     if (props.features) {
//       if (props.features.length) {
//         // may be empty on first render

//         // set features to map
//         featuresLayer.setSource(
//           new VectorSource({
//             features: props.features, // make sure features is an array
//           })
//         );

//         // fit map to feature extent (with 100px of padding)
//         map.getView().fit(featuresLayer.getSource().getExtent(), {
//           padding: [100, 100, 100, 100],
//         });
//       }
//     }
//   }, [props.features]);

//   const handleMapClick = (event) => {
//     // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
//     //  https://stackoverflow.com/a/60643670
//     const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

//     // transform coord to EPSG 4326 standard Lat Long
//     const transormedCoord = transform(clickedCoord, "EPSG:3857", "EPSG:4326");

//     // set React state
//     setSelectedCoord(transormedCoord);
//   };

//   return <div ref={mapElement} className="map-container"></div>;
// }

// export default OpenLayersReact;
