import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Linking, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const GPSContext = createContext();

export const useGPS = () => useContext(GPSContext);

export const GPSProvider = ({ children }) => {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    checkGPS();

    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") {
        checkGPS(); // 🔥 user returned after turning GPS OFF
      }
    });

    return () => subscription.remove();
  }, []);

  const checkGPS = async () => {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      setGpsEnabled(true);
      setShowPopup(false);
    } else {
      setGpsEnabled(false);
      setShowPopup(true); // 🔔 SHOW POPUP EVERYWHERE
    }
  };

  const requestGPS = async () => {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await request(permission);

    if (result !== RESULTS.GRANTED) {
      Linking.openSettings();
    }

    checkGPS();
  };

  return (
    <GPSContext.Provider
      value={{
        gpsEnabled,
        showPopup,
        requestGPS,
        hidePopup: () => setShowPopup(false),
      }}
    >
      {children}
    </GPSContext.Provider>
  );
};
