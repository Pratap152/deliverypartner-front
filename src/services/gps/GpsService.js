import apiClient from '../ApiClient';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { LocationService } = NativeModules;

class GpsService {
  watchId = null;

  initializeTracking(setLocation) {
    this.setLocation = setLocation;

    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'always',
      locationProvider: 'playServices',
    });
  }

  async startTracking() {
    // Prevent creating multiple location watchers.
    if (this.watchId !== null) return;

    if (Platform.OS === 'android') {
      LocationService.startService();
    }

    this.watchId = Geolocation.watchPosition(
      async position => {
        const coords = position.coords;

        const location = {
          isEnabled: true,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy || 0,
          speed: coords.speed || 0,
          heading: coords.heading || 0,
        };

        this.setLocation?.(location);

        await this.updateRiderLocation(location);
      },

      error => {
        // Ignore temporary GPS unavailable errors.
        if (error.code === 2) return;

        console.error('[GpsService]', error);
      },

      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 5000,
        fastestInterval: 3000,
      }
    );
  }

  async stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (Platform.OS === 'android') {
      LocationService.stopService();
    }
  }

  async updateRiderLocation(locationData) {
    try {
      await apiClient.put('/api/rider-gps/update-gps', locationData);
    } catch (e) {
      console.error(
        '[GpsService] Failed to update rider location',
        e.response?.data || e.message
      );
    }
  }
}

export const gpsService = new GpsService();