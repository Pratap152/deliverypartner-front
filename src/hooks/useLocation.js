import { useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useLocation = onLocation => {
  const watchId = useRef(null);

  useEffect(() => {
    const requestPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    };

    const startTracking = async () => {
      const granted = await requestPermission();
      if (!granted) return;

      watchId.current = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;

          if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
          )
            return;

          onLocation({
            latitude,
            longitude,
          });
        },
        error => {
          console.log('GPS error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5, // 🔥 only update if moved 5 meters
          interval: 3000,
          fastestInterval: 2000,
        }
      );
    };

    startTracking();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [onLocation]);
};
