import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  request,
  RESULTS,
  PERMISSIONS,
  openSettings,
  check,
} from 'react-native-permissions';

import PermissionItem from '../../components/onboarding/AppPermissions/PermissionItem';
import PrimaryButton from '../../components/common/PrimaryButton';
import apiClient from '../../services/ApiClient';

const APP_PERMISSIONS = {
  location: {
    title: 'Location',
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  },

  backgroundLocation: {
    title: 'Background Location',
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  },

  camera: {
    title: 'Camera',
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  },
};

const AppPermissionScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState({
    location: '',
    backgroundLocation: '',
    camera: '',
  });
  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      await apiClient.post(
        '/api/rider/permissions',
        {
          camera: true,
          foregroundLocation: true,
          backgroundLocation: true,
        },
        {
          headers: {
            'x-client': 'mobile', // non-auth header
          },
        },
      );

      // ✅ Always go through Splash
      navigation.replace('SplashScreen');
    } catch (e) {
      console.log('Permission API error:', e);
    }
  }

  async function handleLocation(permissionType) {
    const perm =
      Platform.OS === 'android'
        ? APP_PERMISSIONS[permissionType].android
        : APP_PERMISSIONS[permissionType].ios;

    const permission = await check(perm);

    if (permission === RESULTS.GRANTED) {
      setPermissionStatus(status => ({
        ...status,
        [permissionType]: RESULTS.GRANTED,
      }));
      return RESULTS.GRANTED;
    }

    if (permission === RESULTS.DENIED) {
      const response = await request(perm);

      if (response === RESULTS.BLOCKED) {
        openSettings();
      }

      setPermissionStatus(status => ({
        ...status,
        [permissionType]: response,
      }));
      return response;
    }

    if (permission === RESULTS.BLOCKED) {
      openSettings();
      return RESULTS.BLOCKED;
    }
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/permissionsImage.png')} />
      </View>

      <Text style={styles.title}>
        We need the following permissions to serve you better
      </Text>

      <View
        style={{
          width: '100%',
          height: 450,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PermissionItem
          icon="location"
          title="Location"
          desc="We need this permission to intelligently surface location and allocate orders"
          onPress={() => handleLocation('location')}
          isTick={permissionStatus.location === RESULTS.GRANTED}
          isEnabled={permissionStatus.location !== RESULTS.GRANTED}
        />

        <PermissionItem
          icon="locate"
          title="Background Location"
          desc="We require background location permission for accurate rider updates"
          onPress={() => handleLocation('backgroundLocation')}
          isTick={permissionStatus.backgroundLocation === RESULTS.GRANTED}
          isEnabled={
            permissionStatus.location === RESULTS.GRANTED &&
            permissionStatus.backgroundLocation !== RESULTS.GRANTED
          }
        />

        <PermissionItem
          icon="camera"
          title="Camera"
          desc="We need this permission to scan codes and take picture"
          onPress={() => handleLocation('camera')}
          isTick={permissionStatus.camera === RESULTS.GRANTED}
          isEnabled={
            permissionStatus.backgroundLocation === RESULTS.GRANTED &&
            permissionStatus.camera !== RESULTS.GRANTED
          }
        />
      </View>

      {permissionStatus.location === RESULTS.GRANTED &&
        permissionStatus.backgroundLocation === RESULTS.GRANTED &&
        permissionStatus.camera === RESULTS.GRANTED && (
          <PrimaryButton
            title="Submit"
            onPress={handleSubmit}
            bgColor="#00B5CC"
            textColor="#fff"
          />
        )}
    </ScrollView>
  );
};

export default AppPermissionScreen;

const styles = StyleSheet.create({
  placeholderBox: {
    width: 200,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 20,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#56dcee',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
