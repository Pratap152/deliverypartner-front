import React from "react";
import { Polyline } from "react-native-maps";

export default function RoutePolyline({ source, destination }) {
  return (
    <Polyline
      coordinates={[source, destination]}
      strokeWidth={4}
      strokeColor="#2E86DE"
    />
  );
}
