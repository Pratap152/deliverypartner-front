import React from "react";
import { Polyline } from "react-native-maps";

// const GOOGLE_API_KEY = "YOUR_GOOGLE_MAP_KEY";

import { GOOGLE_MAPS_API_KEY } from "../../config/env";

const RoutePolyline = ({ source, destination }) => {
  if (!source || !destination) return null;

  // Simple polyline connecting source to destination
  const coordinates = [
    { latitude: source.latitude, longitude: source.longitude },
    { latitude: destination.latitude, longitude: destination.longitude }
  ];

  return (
    <Polyline
      coordinates={coordinates}
      strokeWidth={4}
      strokeColor="#2E86DE"
    />
  );
}
export default RoutePolyline;
