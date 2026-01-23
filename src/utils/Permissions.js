import { request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";
import { Platform, Alert } from "react-native";

const requestLocation = async () => {
  try {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await request(permission);

    console.log("Permission result:", result);

    switch (result) {
      case RESULTS.GRANTED:
        console.log("✅ Location permission granted");
        return true;

      case RESULTS.DENIED:
        console.log("❌ Permission denied");
        return false;

      case RESULTS.BLOCKED:
        Alert.alert(
          "Location Required",
          "Please enable location from settings to go online",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => openSettings(),
            },
          ]
        );
        return false;

      default:
        return false;
    }
  } catch (error) {
    console.log("Permission error:", error);
    return false;
  }
};

export default requestLocation;
