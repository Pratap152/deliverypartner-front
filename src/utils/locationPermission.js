import {
  PermissionsAndroid,
  Linking,
  AppState,
  Alert,
  Platform,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import DeviceInfo from 'react-native-device-info';

export const checkLocationRequirements = async () => {
  try {
    const fineGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const gpsEnabled =
      await DeviceInfo.isLocationEnabled();

    return (
      fineGranted &&
      gpsEnabled
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const requestLocationRequirements = async () => {
  try {
    if (Platform.OS !== 'android') {
      return true;
    }

    const finePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (
      finePermission === PermissionsAndroid.RESULTS.DENIED ||
      finePermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      return false;
    }

    // GPS
    try {
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });

      return true;
    } catch (e) {

      const gpsEnabled = await DeviceInfo.isLocationEnabled();
      if (!gpsEnabled) {
        Alert.alert(
          'GPS Required',
          'Please enable GPS to continue.',
          [
            {
              text: 'Open Settings',
              onPress: async () => {
                Linking.sendIntent(
                  'android.settings.LOCATION_SOURCE_SETTINGS',
                )
              },
            },
          ],
          { cancelable: false },
        );
      }
    }

    // Final verification
    return await checkLocationRequirements();
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const listenAppResume = callback => {
  return AppState.addEventListener('change', state => {
    if (state === 'active') {
      callback();
    }
  });
};