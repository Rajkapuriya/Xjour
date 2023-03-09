// import React, { useEffect, useState } from "react";
// import "./GeoMap.css";
// import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

// function Map() {
//   const [userLat, setUserLat] = useState(localStorage.getItem("user-info-lat"));
//   const [userLng, setUserLng] = useState(localStorage.getItem("user-info-lng"));
  
//   //   useEffect(() => {
//   // }, [user_Lng, user_Lat]);

//   console.log("this is User lat >", userLat);
//   console.log("this is User lng >", userLng);

//   return (
//     <GoogleMap
//       defaultZoom={10}
//       defaultCenter={{
//         lat: !userLat ? userLat : 45.412,
//         lng: !userLng ? userLng : -75.697189,
//       }}
//     />
//   );
// }

// const WrappedMap = withScriptjs(withGoogleMap(Map));

// function GeoMap() {
//   return (
//     <div className="GeoMap">
//       <WrappedMap
//         googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA9zdQRl8yRYuCiiLbt5sxxc-k34aYqojU`}
//         loadingElement={<div style={{ height: `100%` }} />}
//         containerElement={<div style={{ height: `400px` }} />}
//         mapElement={<div style={{ height: `100%` }} />}
//       />
//     </div>
//   );
// }

// export default GeoMap;
