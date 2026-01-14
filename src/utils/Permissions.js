import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

const requestLocation = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permission);

  if (result === RESULTS.GRANTED) {
    console.log("Location permission granted");
  }
};
export default requestLocation;