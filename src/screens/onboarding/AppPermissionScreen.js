import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {
  request,
  RESULTS,
  PERMISSIONS,
  openSettings,
  check,
} from 'react-native-permissions';

import DeviceInfo from 'react-native-device-info';
import PermissionItem from '../../components/onboarding/AppPermissions/PermissionItem';
import apiClient from '../../services/ApiClient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingAppPermissions } from '../../services/onboardingApi';

const isTablet = DeviceInfo.isTablet();

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

const insets = useSafeAreaInsets();
useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const [permissionStatus, setPermissionStatus] = useState({
    location: '',
    backgroundLocation: '',
    camera: '',
  });
  const [error, setError] = useState('');

  async function handleSubmit() {
    try {
      await onboardingAppPermissions();
      navigation.replace('RiderTypeScreen');
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
      setPermissionStatus(s => ({ ...s, [permissionType]: RESULTS.GRANTED }));
      return RESULTS.GRANTED;
    }
    if (permission === RESULTS.DENIED) {
      const response = await request(perm);
      if (response === RESULTS.BLOCKED) openSettings();
      setPermissionStatus(s => ({ ...s, [permissionType]: response }));
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

  const allGranted =
    permissionStatus.location === RESULTS.GRANTED &&
    permissionStatus.backgroundLocation === RESULTS.GRANTED &&
    permissionStatus.camera === RESULTS.GRANTED;

  return (
  <View style={styles.screenWrapper}>

  <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <Image
      source={require('../../assets/permissionsImage.png')}
      style={[styles.image, isTablet && styles.imageTablet]}
      resizeMode="contain"
    />

    <Text style={styles.title}>
      We need the following permissions to serve you better
    </Text>

    <View style={styles.permissionsWrapper}>
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
  </ScrollView>

  <View
    style={[
      styles.fixedButtonContainer,
      { bottom: 50 + insets.bottom, 
        opacity: allGranted ? 1 : 0 },
    ]}
    pointerEvents={allGranted ? 'auto' : 'none'}
  >
    <TouchableOpacity
      style={styles.submitButton}
      onPress={handleSubmit}
      disabled={!allGranted}
    >
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
  </View>

</View>
  );
};

export default AppPermissionScreen;

const styles = StyleSheet.create({
scrollContent: {
  paddingHorizontal: isTablet ? 40 : 20,
  paddingTop: 20,
  paddingBottom: 200,
  alignItems: 'center',
},

fixedButtonContainer: {
  position: 'absolute',
  left: 20,
  right: 20,
  alignItems: 'center',
},

content: {
  flexGrow: 1,
  alignItems: 'center',
  paddingHorizontal: isTablet ? 40 : 20,
  paddingTop: 20,
  paddingBottom: 24,
},

buttonWrapper: {
  width: '100%',
  maxWidth: isTablet ? 700 : '100%',
  alignSelf: 'center',
  marginTop: 'auto',
  paddingTop: 20,
},

submitButton: {
  width: isTablet ? 700 : '100%',
  alignSelf: 'center',
  backgroundColor:"#1F3365",
  paddingVertical: isTablet ? 18 : 15,
  borderRadius: 40,
  alignItems: 'center',
  justifyContent: 'center',
},

submitButtonText: {
  color: '#fff',
  fontSize: isTablet ? 22 : 18,
  fontWeight: '700',
},
screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },

imageTablet: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },

title: {
    fontSize: isTablet ? 24 : 17,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
    color: '#000',
    lineHeight: isTablet ? 34 : 24,
    maxWidth: isTablet ? 600 : '100%',
  },

permissionsWrapper: {
    width: '100%',
    maxWidth: isTablet ? 700 : '100%',
    alignSelf: 'center',
  },
});