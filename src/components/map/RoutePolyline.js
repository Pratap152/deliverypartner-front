import React from "react";
import { Polyline } from "react-native-maps";

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
      strokeColor="#2E86DE"
    />
  );
}
