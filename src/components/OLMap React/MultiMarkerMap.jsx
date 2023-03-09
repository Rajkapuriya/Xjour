import React, { useEffect, useState } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat } from "ol/proj";
import { Controls, FullScreenControl } from "./Controls";

import hospital from "../../assets/images/hospital.png";


import mapConfig from "./config.json";

// for multiple markers
const markersLonLat = [
  mapConfig.kansasCityLonLat,
  mapConfig.blueSpringsLonLat,
  mapConfig.someCityLonLat,
];

console.log("markersLonLat", markersLonLat);

function clinicMarkers(lonLatArray) {
  console.log("value recieved in clinic", lonLatArray);
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



function hospitalMarkers(lonLatArray) {
  console.log("value recieved in hospital", lonLatArray);
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: hospital,
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





function MultiMarkerMap({ coord, emergencyCoordsArray }) {
  console.log("emergencyCoordsArray in MultiMarkerMap", emergencyCoordsArray);

  const [center, setCenter] = useState(coord);
  const [zoom, setZoom] = useState(16);

 
  const [showMarker, setShowMarker] = useState(true);
  const [showMarker2, setShowMarker2] = useState(false);
  const [showMarker3, setShowMarker3] = useState(false);
  const [showMarker4, setShowMarker4] = useState(false);

  const [updateClinicCoords, setUpdateClinicCoords] = useState(false);
  const [updateHospitalCoords, setUpdateHospitalCoords] = useState(false);
  const [updatePharmacyCoords, setUpdatePharmacyCoords] = useState(false);
  const [updateAmbulanceCoords, setUpdateAmbulanceCoords] = useState(false);
  const [updateFireCoords, setUpdateFireCoords] = useState(false);

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

  

  // const [features, setFeatures] = useState([]);
  const [features, setFeatures] = useState(clinicMarkers(clinicCoords));
  const [features2, setFeatures2] = useState(hospitalMarkers(hospitalCoords));


 

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
      console.log("useEffect newArr", newArr);
    }
  }, [updateHospitalCoords]);

  useEffect(() => {
    if (updatePharmacyCoords) {
      setUpdatePharmacyCoords(false);
      console.log("useEffect Triggered for cords", pharmacyArray);
      for (var key in pharmacyArray) {
        const coordVal = [];
        coordVal.push(pharmacyArray[key].longitude);
        coordVal.push(pharmacyArray[key].latitude);

        setPharmacyCoords((coord) => [...coord, coordVal]);
      }
    }
  }, [updatePharmacyCoords]);

  useEffect(() => {
    if (updateAmbulanceCoords) {
      setUpdateAmbulanceCoords(false);
      console.log("useEffect Triggered for cords", ambulanceStationArray);
      for (var key in ambulanceStationArray) {
        const coordVal = [];
        coordVal.push(ambulanceStationArray[key].longitude);
        coordVal.push(ambulanceStationArray[key].latitude);

        setAmbulanceStationCoords((coord) => [...coord, coordVal]);
      }
    }
  }, [updateAmbulanceCoords]);

  useEffect(() => {
    if (updateFireCoords) {
      setUpdateFireCoords(false);
      console.log("useEffect Triggered for cords", fireStationArray);
      for (var key in fireStationArray) {
        const coordVal = [];
        coordVal.push(fireStationArray[key].longitude);
        coordVal.push(fireStationArray[key].latitude);

        setFireStationCoords((coord) => [...coord, coordVal]);
      }
    }
  }, [updateFireCoords]);



  useEffect(() => {
    console.log("clinicCoords", clinicCoords);
  }, [clinicCoords]);



  return (
    <div>
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {showMarker2 && <VectorLayer source={vector({ features })} />}
          {showMarker2 && (
            <VectorLayer source={vector({ features: features2 })} />
          )}
       
        
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>

      <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />
        Show markers 1
      </div>
      <div>
        <input
          type="checkbox"
          checked={showMarker2}
          onChange={(event) => setShowMarker2(event.target.checked)}
        />
        Show markers 2
      </div>
      <div>
        <input
          type="checkbox"
          checked={showMarker3}
          onChange={(event) => setShowMarker3(event.target.checked)}
        />
        Show markers 3
      </div>
      <div>
        <input
          type="checkbox"
          checked={showMarker4}
          onChange={(event) => setShowMarker4(event.target.checked)}
        />
        Show markers 4
      </div>
    </div>
  );
}

export default MultiMarkerMap;
