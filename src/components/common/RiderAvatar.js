import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Animated } from "react-native";
import { Marker } from "react-native-maps";

const RiderMarker = forwardRef((props, ref) => {
  const position = useRef(
    new Animated.Region({
      latitude: 19.0896,
      longitude: 72.8656,
    })
  ).current;

  useImperativeHandle(ref, () => ({
    move: ({ latitude, longitude }) => {
      position.timing({
        latitude,
        longitude,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    },
  }));

  return (
    <Marker.Animated coordinate={position}>
      <Animated.View
        style={{
          width: 16,
          height: 16,
          backgroundColor: "#2E86DE",
          borderRadius: 8,
        }}
      />
    </Marker.Animated>
  );
});

export default RiderMarker;
