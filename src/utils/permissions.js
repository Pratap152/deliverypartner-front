import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

export const requestLocationPermission = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};
