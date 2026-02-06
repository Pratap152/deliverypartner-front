import { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";

export const useLiveLocation = () => {
//   const [location, setLocation] = useState(null);

 useEffect(() => {
  const watchId = Geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;

      setRiderLocation({
        latitude,
        longitude,
      });
    },
    error => console.log(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 5, // move 5 meters
      interval: 3000,
      fastestInterval: 2000,
    }
  );

  return () => Geolocation.clearWatch(watchId);
}, []);

};
