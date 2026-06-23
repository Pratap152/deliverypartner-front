import {
  PermissionsAndroid,
  Linking,
  AppState,
  Alert,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import DeviceInfo from 'react-native-device-info';

export const checkLocationRequirements = async () => {
  try {
    const fineGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const backgroundGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    const gpsEnabled =
      await DeviceInfo.isLocationEnabled();

    return (
      fineGranted &&
      backgroundGranted &&
      gpsEnabled
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const requestLocationRequirements = async () => {
  try {
    console.log('Request started');
    const finePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Please allow location access.',
        buttonPositive: 'Allow',
      },
    );
    console.log('Fine:', finePermission);

    if (
      finePermission !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      return false;
    }

    const backgroundPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: 'Allow All The Time',
        message:
          'Please allow all the time location access.',
        buttonPositive: 'Allow',
      },
    );

    if (
      backgroundPermission !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      Linking.openSettings();
      return false;
    }

    // GPS
    try {
      console.log('Opening GPS dialog');

      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      },
      );
      console.log('GPS enabled');
    } catch (e) {
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
      console.log('GPS not enabled');
      return false;
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