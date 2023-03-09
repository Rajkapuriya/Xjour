import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { clinicMarkers } from "../utils/markers";

import MapContext from "../../Map/MapContext";

import { amenitiesSelector } from "store/reducers/amenities";

export default function AmenitiesLayer() {
  const mapContext = useContext(MapContext);
  console.log("%cmapContext:", "background-color:silver", mapContext);

  const amenitiesSlice = useSelector(amenitiesSelector);
  const { amenities, selectedAmenityType } = amenitiesSlice;
  console.log(
    "%camenitiesSlice in AmenitiesLayer:",
    "background-color:silver;",
    amenitiesSlice
  );

  const vectorLayer = useRef(null);
  useEffect(() => {
    if (amenities.length > 0 && mapContext?.map && selectedAmenityType?.class) {
      mapContext.map.removeLayer(vectorLayer.current);

      const features = clinicMarkers(amenities, selectedAmenityType?.class);
      console.log("%cfeatures:", "background-color:silver", features);

      vectorLayer.current = new VectorLayer({
        source: new VectorSource({
          features,
        }),
      });

      console.log("%cvectorLayer:", "background-color:silver", vectorLayer);

      mapContext.map.addLayer(vectorLayer.current);
    }
  }, [amenities, mapContext.map, selectedAmenityType?.class]);

  return <></>;
}
