// import "ol/ol.css";
// import "./App.css";
// import React, {
//   useEffect,
//   useRef,
//   useState,
//   useMemo,
//   useCallback
// } from "react";
// import Map from "ol/Map";
// import View from "ol/View";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import { Draw, Modify, Select, Snap } from "ol/interaction";
// import { OSM, Vector as VectorSource } from "ol/source";
// import GeoJSON from "ol/format/GeoJSON";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
// import * as turf from "@turf/turf";

// export default function Interactions() {
//   const [modifyAble, setModifyable] = useState(false);
//   const [drawnPolygons, setDrawnPolygons] = useState([]);
//   const [currentPolygon, setCurrentPolygon] = useState(null);
//   const [currentSelectedFeatures, setCurrentSelectedFeatures] = useState("");
//   const [currentSelectedFeature, setCurrentSelectedFeature] = useState(null);

//   const raster = useMemo(
//     () =>
//       new TileLayer({
//         source: new OSM()
//       }),
//     []
//   );

//   const vectorSource = useMemo(() => new VectorSource(), []);

//   const vector = useMemo(
//     () =>
//       new VectorLayer({
//         source: vectorSource,
//         style: new Style({
//           fill: new Fill({
//             color: "rgba(255, 255, 255, 0.2)"
//           }),
//           stroke: new Stroke({
//             color: "#ffcc33",
//             width: 2
//           }),
//           image: new CircleStyle({
//             radius: 7,
//             fill: new Fill({
//               color: "#ffcc33"
//             })
//           })
//         })
//       }),
//     [vectorSource]
//   );

//   const mapElement = useRef();
//   const mapRef = useRef();
//   const drawAbleRef = useRef(true);

//   const select = useMemo(() => new Select(), []);
//   const modify = useMemo(() => new Modify({ features: select.getFeatures() }), [
//     select
//   ]);
//   const Polygon = useMemo(
//     () =>
//       new Draw({
//         source: vector.getSource(),
//         type: "Polygon",
//         condition: () => drawAbleRef.current
//       }),
//     [vector]
//   );

//   const snap = useMemo(
//     () =>
//       new Snap({
//         source: vector.getSource()
//       }),
//     [vector]
//   );

//   const setEvents = useCallback(() => {
//     const selectedFeatures = select.getFeatures();

//     select.on("change:active", () => {
//       selectedFeatures.forEach((each) => {
//         selectedFeatures.remove(each);
//       });
//     });
//   }, [select]);

//   const displayFeatureInfo = useCallback(
//     (pixel) => {
//       vector.getFeatures(pixel).then(function (features) {
//         if (features.length) {
//           drawAbleRef.current = false;
//         } else {
//           drawAbleRef.current = true;
//         }
//       });
//     },
//     [vector]
//   );

//   const init = useCallback(() => {
//     mapRef.current.addInteraction(select);
//     mapRef.current.addInteraction(modify);

//     mapRef.current.addInteraction(Polygon);

//     Polygon.setActive(true);

//     mapRef.current.addInteraction(snap);

//     setEvents();
//   }, [setEvents, Polygon, modify, select, snap]);

//   useEffect(() => {
//     mapRef.current = new Map({
//       layers: [raster, vector],
//       target: mapElement.current,
//       view: new View({
//         center: [-11000000, 4600000],
//         zoom: 6
//       })
//     });
//     init();
//   }, [raster, vector, init]);

//   const onDrawend = useCallback((e) => {
//     const geoJSON = new GeoJSON();

//     const drawnGeoJson = geoJSON.writeFeatureObject(e.feature, {
//       dataProjection: "EPSG:4326",
//       featureProjection: "EPSG:3857"
//     });
//     const drawnGeometry = turf.getGeom(drawnGeoJson);

//     const [coordinates] = drawnGeometry.coordinates;

//     const current = {
//       id: e.feature.ol_uid,
//       polygon: turf.polygon([coordinates])
//     };

//     setCurrentPolygon(current);

//     setDrawnPolygons((state) => [...state, current]);
//   }, []);

//   useEffect(() => {
//     const filtered = drawnPolygons.filter((i) => i.id !== currentPolygon.id);

//     filtered.forEach(async (feature) => {
//       const intersection = turf.intersect(
//         feature.polygon,
//         currentPolygon.polygon
//       );
//       if (intersection) {
//         var features = vectorSource.getFeatures();
//         const found = features.find((i) => i.ol_uid === currentPolygon.id);
//         if (found) {
//           vectorSource.removeFeature(found);
//           setDrawnPolygons((state) =>
//             state.filter((i) => i.id !== found.ol_uid)
//           );
//         }
//       }
//     });
//   }, [currentPolygon, drawnPolygons, vectorSource]);

//   const onPointerMove = useCallback(
//     (e) => {
//       if (e.dragging) {
//         return;
//       }
//       const pixel = mapRef.current.getEventPixel(e.originalEvent);
//       displayFeatureInfo(pixel);
//     },
//     [displayFeatureInfo]
//   );

//   const onSelect = useCallback(
//     (e) => {
//       const selectedFeatures = e.target.getFeatures().getArray();

//       console.log("selected", selectedFeatures);
//       console.log("cs", currentSelectedFeatures);

//       if (selectedFeatures.length > 0) {
//         console.log("settted");
//         setCurrentSelectedFeatures(selectedFeatures);
//       } else {
//         console.log(currentSelectedFeatures);
//         if (currentSelectedFeatures.length) {
//           const style = new Style({
//             fill: new Fill({
//               color: "rgba(255, 255, 255, 0.2)"
//             }),
//             stroke: new Stroke({
//               color: "#ff00ff",
//               width: 2
//             })
//           });
//           currentSelectedFeatures.forEach((feature) => feature.setStyle(style));
//         }
//       }
//     },
//     [currentSelectedFeatures, setCurrentSelectedFeatures]
//   );

//   const onSelect2 = useCallback(
//     (e) => {
//       const selectedFeatures = e.target.getFeatures().getArray();

//       if (selectedFeatures.length) {
//         console.log("SET");
//         setCurrentSelectedFeature(selectedFeatures);
//       } else {
//         console.log("currentSelectedFeatureees", currentSelectedFeature);
//       }
//     },
//     [currentSelectedFeature]
//   );

//   useEffect(() => {
//     mapRef.current.on("pointermove", onPointerMove);

//     Polygon.on("drawend", onDrawend);

//     //select.on("select", onSelect);
//     select.on("select", onSelect2);

//     return () => {
//       Polygon.un("drawend", onDrawend);
//       mapRef.current.un("pointermove", onPointerMove);
//       //select.un("select", onSelect);
//       select.un("select", onSelect2);
//     };
//   }, [
//     Polygon,
//     displayFeatureInfo,
//     drawnPolygons,
//     onDrawend,
//     onPointerMove,
//     select,
//     onSelect,
//     onSelect2,
//     currentSelectedFeature
//   ]);

//   const onModifyPressed = useCallback(() => {
//     if (modifyAble) {
//       Polygon.setActive(true);
//       modify.setActive(false);
//     } else {
//       Polygon.setActive(false);
//       modify.setActive(true);
//     }
//     setModifyable((state) => !state);
//   }, [Polygon, modify, modifyAble]);

//   const changeColor = useCallback(() => {
//     if (!currentSelectedFeatures.length) {
//       return;
//     }

//     const style = new Style({
//       fill: new Fill({
//         color: "rgba(255, 255, 255, 0.2)"
//       }),
//       stroke: new Stroke({
//         color: "#ff00ff",
//         width: 2
//       })
//     });

//     currentSelectedFeatures.forEach((feature) => feature.setStyle(style));
//   }, [currentSelectedFeatures]);
// function OLMap() {
    
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default OLMap
