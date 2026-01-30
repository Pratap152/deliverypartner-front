import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Marker } from "react-native-maps";

const RiderMarker = forwardRef((props, ref) => {
  const [location, setLocation] = useState(null);

  useImperativeHandle(ref, () => ({
    updateLocation: (coords) => {
      console.log("coords",coords);
      setLocation(coords);
    },
  }));

  if (!location) return null;

  return (
    <Marker
      coordinate={location}
      title="You"
      description="Rider Location"
    />
  );
});

export default RiderMarker;
