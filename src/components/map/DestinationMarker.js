import React from "react";
import { Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function DestinationMarker({ coordinate }) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }} title='user'>
      <MaterialIcons name="home" size={32} color="#27AE60" />
    </Marker>
  );
}
