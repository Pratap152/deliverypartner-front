import React, { useEffect, useState } from "react";
import MapViewDirections from "react-native-maps-directions";

// const GOOGLE_API_KEY = "YOUR_GOOGLE_MAP_KEY";

import { GOOGLE_MAPS_API_KEY } from "../../config/env";

const RoutePolyline = ({ source, destination }) => {
  if (!source || !destination) return null;

  return (
    <MapViewDirections
      origin={source}
      destination={destination}
      apikey={GOOGLE_MAPS_API_KEY}
      strokeWidth={4}
      strokeColor="#00C4B4"
    />
  );
};

export default RoutePolyline;
