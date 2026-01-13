import React from "react";
import { Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SourceMarker({ coordinate }) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }} title='restaurant'>
      <MaterialIcons name="restaurant" size={32} color="#E74C3C" />
    </Marker>
  );
}
