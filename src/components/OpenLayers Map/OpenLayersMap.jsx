// import React, { useEffect, useRef, useState } from "react";
// import "./OpenLayersMap.css";
// import { Map, View } from "ol";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import "ol/ol.css";
// import { fromLonLat } from "ol/proj";
// import MultiPoint from "ol/geom/MultiPoint";

// function OpenLayersMap({ coord }) {
//   const [map, setMap] = useState();
//   const mapElement = useRef();
//   const mapRef = useRef();
//   mapRef.current = map;
//   const place = [-110, 45];
//   //   const point = new Point(place);

//   // console.log("coordVal:", coord[0].lng1);
//   // console.log("coordVal:", coord[0].lng1);

//   useEffect(() => {
//     const initialMap = new Map({
//       target: mapElement.current,
//       layers: [
//         // new MultiPoint([[lng, lat][(lng, lat)], opt_layout]),
//         new MultiPoint([
//           [-123, 58],
//           [-152.32, 17.5],
//           [52.02, 42.64],
//         ]),

//         new TileLayer({
//           source: new OSM(),
//         }),
//       ],
//       view: new View({
//         // center: fromLonLat([long, lat]),
//         center: fromLonLat(place),
//         zoom: 4,
//       }),
//     });
//     setMap(place);
//   }, []);

//   return (
//     <div
//       //   style={{ height: "100vh", width: "100%" }}
//       ref={mapElement}
//       className="map-container"
//     />
//   );
// }

// export default OpenLayersMap;
