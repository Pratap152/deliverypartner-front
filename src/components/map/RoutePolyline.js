import React, { useEffect, useState } from "react";
import MapViewDirections from "react-native-maps-directions";

// const GOOGLE_API_KEY = "YOUR_GOOGLE_MAP_KEY";

const RoutePolyline = ({ source, destination }) => {
  if (!source || !destination) return null;

  return (
    <MapViewDirections
      origin={source}
      destination={destination}
      strokeWidth={4}
      strokeColor="#00C4B4"
    />
  );
};

export default RoutePolyline;
