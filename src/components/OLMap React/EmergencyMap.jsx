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
import ambulance from "../../assets/icons/xjour-icons/resized/ambulance.webp";
import clinic from "../../assets/icons/xjour-icons/resized/clinic.webp";
import hospital from "../../assets/icons/xjour-icons/resized/hospital.webp";
import pharmacy from "../../assets/icons/xjour-icons/resized/pharmacy.webp";
import Fire_Station from "../../assets/icons/xjour-icons/resized/Fire_Station-128.webp";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;

function clinicMarkers(lonLatArray) {
  console.log("value recieved in clinic", lonLatArray);
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: clinic,
      anchor: [0.5, 1.0],
      opacity: 0.7,
      declutterMode: "declutter",
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

function hospitalMarkers(lonLatArray) {
  console.log("value recieved in hospital", lonLatArray);
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: hospital,
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

function pharmacyMarkers(lonLatArray) {
  console.log("value recieved in pharmacy", lonLatArray);
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: pharmacy,
      anchor: [0.5, 0.5],
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

function ambulanceMarkers(lonLatArray) {
  console.log("value recieved in ambulance", lonLatArray);
  var iconStyle2 = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: ambulance,
      anchor: [0.5, 0.5],
    }),
  });
  let featuree = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle2);
    return feature;
  });
  return featuree;
}

function fireStationMarkers(lonLatArray) {
  console.log("value recieved in firestation", lonLatArray);
  var iconStyle2 = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: Fire_Station,
      anchor: [0.5, 0.5],
    }),
  });
  let featuree = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle2);
    return feature;
  });
  return featuree;
}

function EmergencyMap({ coord, emergencyCoordsArray }) {
  const [clinicArray, setClinicArray] = useState([]);
  const [clinicCoords, setClinicCoords] = useState([]);
  const [hospitalArray, setHospitalArray] = useState([]);
  const [hospitalCoords, setHospitalCoords] = useState([]);
  const [pharmacyArray, setPharmacyArray] = useState([]);
  const [pharmacyCoords, setPharmacyCoords] = useState([]);
  const [ambulanceStationArray, setAmbulanceStationArray] = useState([]);
  const [ambulanceStationCoords, setAmbulanceStationCoords] = useState([]);
  const [fireStationArray, setFireStationArray] = useState([]);
  const [fireStationCoords, setFireStationCoords] = useState([]);

  const [updateClinicCoords, setUpdateClinicCoords] = useState(false);
  const [updateHospitalCoords, setUpdateHospitalCoords] = useState(false);
  const [updatePharmacyCoords, setUpdatePharmacyCoords] = useState(false);
  const [updateAmbulanceCoords, setUpdateAmbulanceCoords] = useState(false);
  const [updateFireCoords, setUpdateFireCoords] = useState(false);

  const [center, setCenter] = useState(coord);
  const [zoom, setZoom] = useState(12);
  const [features, setFeatures] = useState(null);
  const [features2, setFeatures2] = useState(null);
  const [features3, setFeatures3] = useState(null);
  const [features4, setFeatures4] = useState(null);
  const [features5, setFeatures5] = useState(null);

  // useEffects
  useEffect(() => {
    console.log("useEffect for separation of arrays", emergencyCoordsArray);
    // for (var i = 0; i < emergencyCoordsArray.length; i++) {

    const clinicRes = emergencyCoordsArray.filter(
      (val) => val.type === "clinic"
    );
    setClinicArray(clinicRes);

    const hospitalRes = emergencyCoordsArray.filter(
      (val) => val.type === "hospital"
    );
    setHospitalArray(hospitalRes);

    const pharmacyRes = emergencyCoordsArray.filter(
      (val) => val.type === "pharmacy"
    );
    console.log("pharmacyRes", pharmacyRes);
    setPharmacyArray(pharmacyRes);

    const ambulanceRes = emergencyCoordsArray.filter(
      (val) => val.type === "ambulance_station"
    );
    setAmbulanceStationArray(ambulanceRes);

    const fireStationRes = emergencyCoordsArray.filter(
      (val) => val.type === "fire_station"
    );
    setFireStationArray(fireStationRes);

    setUpdateClinicCoords(true);
    setUpdateHospitalCoords(true);
    setUpdatePharmacyCoords(true);
    setUpdateAmbulanceCoords(true);
    setUpdateFireCoords(true);
  }, [emergencyCoordsArray]);

  useEffect(() => {
    if (updateClinicCoords) {
      setUpdateClinicCoords(false);
      console.log("useEffect Triggered for cords", clinicArray);

      var newArr = clinicArray.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setClinicCoords([...newArr]);
      setFeatures(clinicMarkers(clinicCoords));

      console.log("coords in useEffect coord", newArr);
      // }
    }
  }, [updateClinicCoords]);

  useEffect(() => {
    if (updateHospitalCoords) {
      setUpdateHospitalCoords(false);
      console.log("useEffect Triggered for cords", hospitalArray);

      var newArr = hospitalArray.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setHospitalCoords([...newArr]);
      setFeatures2(hospitalMarkers(hospitalCoords));
      console.log("useEffect newArr", newArr);
    }
  }, [updateHospitalCoords]);

  useEffect(() => {
    if (updatePharmacyCoords) {
      setUpdatePharmacyCoords(false);
      console.log("useEffect Triggered for cords", pharmacyArray);

      var newArr = pharmacyArray.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setPharmacyCoords([...newArr]);
      setFeatures3(pharmacyMarkers(pharmacyCoords));
    }
  }, [updatePharmacyCoords]);

  useEffect(() => {
    if (updateAmbulanceCoords) {
      setUpdateAmbulanceCoords(false);
      console.log("useEffect Triggered for cords", ambulanceStationArray);

      var newArr = ambulanceStationArray.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setAmbulanceStationCoords([...newArr]);
      setFeatures4(ambulanceMarkers(ambulanceStationCoords));
    }
  }, [updateAmbulanceCoords]);

  useEffect(() => {
    if (updateFireCoords) {
      setUpdateFireCoords(false);
      console.log("useEffect Triggered for cords", fireStationArray);

      var newArr = fireStationArray.map(function (val, index) {
        return [val.longitude, val.latitude];
      });

      setFireStationCoords([...newArr]);
      setFeatures5(fireStationMarkers(fireStationCoords));
    }
  }, [updateFireCoords]);

  //   useEffect(() => {
  //     const updatedMarker = [coord];
  //     setCenter(coord);
  //     setFeatures(clinicMarkers(updatedMarker));
  //   }, [coord]);

  useEffect(() => {
    setFeatures(clinicMarkers(clinicCoords));
  }, [clinicCoords]);

  useEffect(() => {
    setFeatures2(hospitalMarkers(hospitalCoords));
  }, [hospitalCoords]);

  useEffect(() => {
    setFeatures3(pharmacyMarkers(pharmacyCoords));
  }, [pharmacyCoords]);

  useEffect(() => {
    setFeatures4(ambulanceMarkers(ambulanceStationCoords));
  }, [ambulanceStationCoords]);

  useEffect(() => {
    setFeatures5(fireStationMarkers(fireStationCoords));
  }, [fireStationCoords]);
  // useEffects
  useEffect(() => {
    console.log("features2", features2);
  }, [features2]);
  // useEffects

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(false);
  return (
    <div>
      <Map
        center={fromLonLat(center)}
        zoom={zoom}
        features5={features5}
        features4={features4}
        features3={features3}
        features2={features2}
        features={features}
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {/* {showMarker && (
            <> */}
          {features != null && <VectorLayer source={vector({ features })} />}
          {features2 != null && (
            <VectorLayer source={vector({ features: features2 })} />
          )}
          {features3 != null && (
            <VectorLayer source={vector({ features: features3 })} />
          )}
          {features4 != null && (
            <VectorLayer source={vector({ features: features4 })} />
          )}
          {features5 != null && (
            <VectorLayer source={vector({ features: features5 })} />
          )}
          {/* </>
          )} */}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>

      {/* <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />
        Show markers
      </div> */}
    </div>
  );
}

export default EmergencyMap;
