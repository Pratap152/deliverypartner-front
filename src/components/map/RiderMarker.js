import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Marker, AnimatedRegion } from "react-native-maps";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const RiderMarker = forwardRef((props, ref) => {
  const position = useRef(
    new AnimatedRegion({
      latitude: 19.0896,
      longitude: 72.8656,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
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
    <Marker.Animated
      coordinate={position}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      zIndex={999}
      title="Rider"
    >
      <MaterialCommunityIcons
        name="motorbike"
        size={32}
        color="#1E90FF"
      />
    </Marker.Animated>
  );
});

export default RiderMarker;
