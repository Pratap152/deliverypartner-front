import React, { useImperativeHandle, useRef, forwardRef } from "react";
import MapView from "react-native-maps";
import RiderMarker from "./RiderMarker";
import SourceMarker from "./SourceMarker";
import DestinationMarker from "./DestinationMarker";
import RoutePolyline from "./RoutePolyline";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

const SOURCE = { latitude: 19.0896, longitude: 72.8656 };
const DEST = { latitude: 19.1015, longitude: 72.8743 };


const LiveMap = ({ riderRef }) => {
  return (
    <MapView
       style={{ flex: 1 }}
      initialRegion={{
        latitude: SOURCE.latitude,
        longitude: SOURCE.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <SourceMarker coordinate={SOURCE} />
      <DestinationMarker coordinate={DEST} />
      <RoutePolyline source={SOURCE} destination={DEST} />
      <RiderMarker ref={riderRef} />

    </MapView>
  );
};

export default LiveMap;
