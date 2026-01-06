import SelectCityScreen from './SelectCityScreen';
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
  requestNotifications,
  check,
} from 'react-native-permissions';
// import Icon from 'react-native-vector-icons/Ionicons';
import PermissionItem from '../../components/onboarding/AppPermissions/PermissionItem';
import axios from 'axios';
import WEBSITE_URL from '../../utils/host';
import { useAuth } from '../../hooks/useAuth';
import PrimaryButton from '../../components/common/PrimaryButton';

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

  notification: {
    title: 'Notifications',
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
  },
};

const AppPermissionScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState({
    location: 'location',
    backgroundLocation: '',
    camera: '',
    notification: '',
  });
  const [error, setError] = useState('');
  const { authToken } = useAuth();
  async function handleSubmit() {
    try {
      const response = await axios.post(
        WEBSITE_URL + '/api/rider/permissions',
        {
          camera: true,
          foregroundLocation: true,
          backgroundLocation: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            'x-client': 'mobile',
          },
        },
      );
      navigation.replace('SplashScreen');
    } catch (e) {
      setError(e.message);
    }
  }
  async function handleLocation(permissionType) {
    const perm =
      Platform.OS === 'android'
        ? APP_PERMISSIONS[permissionType].android
        : APP_PERMISSIONS[permissionType].ios;
    const permission = await check(perm);

    if (permission === 'granted') {
      setPermissionStatus(status => ({
        ...status,
        [permissionType]: 'granted',
      }));
      return 'granted';
    }
    if (permission === 'denied') {
      const responce = await request(perm);
      if (responce === 'blocked') {
        setPermissionStatus(status => ({
          ...status,
          [permissionType]: 'granted',
        }));
        openSettings('application');
      }
      setPermissionStatus(status => ({
        ...status,
        [permissionType]: responce,
      }));
      return responce;
    }
    if (permission === 'blocked') {
      setPermissionStatus(status => ({
        ...status,
        [permissionType]: 'granted',
      }));
      openSettings('application');
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
          permissionStatus={permissionStatus}
          onPress={() => handleLocation('location')}
          isTick={permissionStatus.location === 'granted'}
          isEnabled={permissionStatus.location !== 'granted'}
        />

        <PermissionItem
          icon="locate"
          title="Background Location"
          desc="We require background location permission for accurate rider updates and geographical detection"
          permissionStatus={permissionStatus}
          onPress={() => handleLocation('backgroundLocation')}
          isTick={permissionStatus.backgroundLocation === 'granted'}
          isEnabled={
            permissionStatus.location === 'granted' &&
            permissionStatus.backgroundLocation !== 'granted'
          }
        />

        <PermissionItem
          icon="camera"
          title="Camera"
          desc="We need this permission to scan codes and take picture"
          permissionStatus={permissionStatus}
          isTick={permissionStatus.camera === 'granted'}
          isEnabled={
            permissionStatus.backgroundLocation === 'granted' &&
            permissionStatus.camera !== 'granted'
          }
          onPress={() => handleLocation('camera')}
        />
      </View>

      {permissionStatus.backgroundLocation === 'granted' &&
        permissionStatus.location === 'granted' &&
        permissionStatus.camera === 'granted' && (
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

export default AppPermissionScreen;
