import React from "react";
import "./StreetMap.css";
import { MapContainer, TileLayer } from "react-leaflet";

function StreetMap() {
  return (
    <div className="streetMap">
      <MapContainer center={[45.4, -75.7]} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default StreetMap;
