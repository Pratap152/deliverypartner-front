import apiClient from '../ApiClient';
import BackgroundGeolocation from 'react-native-background-geolocation';

class GpsService {
  /**
   * Initialize background geolocation listener and configuration.
   * This should be called once when the app starts.
   */
  async initializeTracking() {
    // 1. Listen to location events
    BackgroundGeolocation.onLocation(
      async (location) => {
        const { coords } = location;
        
        await this.updateRiderLocation({
          isEnabled: true,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy || 0,
          heading: coords.heading || 0,
          speed: coords.speed || 0,
        });
      },
      (error) => {
        console.warn('[GpsService] BackgroundGeolocation error:', error);
      }
    );

    // 2. Ready the plugin
    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1, // update every 1 meters
      stopTimeout: 5, // keep tracking for 5 minutes after stopping
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
      stopOnTerminate: false, // keep tracking even if the app is killed
      startOnBoot: true,
      // We do not use the built-in HTTP sync because we rely on our apiClient for Auth tokens
      autoSync: false,
    });

    console.log('[GpsService] BackgroundGeolocation ready. Enabled:', state.enabled);
  }

  /**
   * Start tracking manually
   */
  async startTracking() {
    const state = await BackgroundGeolocation.getState();
    if (!state.enabled) {
      await BackgroundGeolocation.start();
      console.log('[GpsService] Tracking started');
    }
  }

  /**
   * Stop tracking manually
   */
  async stopTracking() {
    await BackgroundGeolocation.stop();
    console.log('[GpsService] Tracking stopped');
  }

  /**
   * Update the rider's GPS location on the backend
   * @param {Object} locationData
   */
  async updateRiderLocation(locationData) {
    try {
      console.log('[GpsService] Updating location:', locationData);
      const response = await apiClient.put('/api/rider-gps/update-gps', locationData);
      console.log('[GpsService] Update location response:', response.data);
      return response.data;
    
    } catch (error) {
      // Safely log the error, preventing huge HTML blobs from taking over the console
      console.log('[GpsService] Error updating location:', error?.response?.data || error.message);
      const errorMessage =
        typeof error?.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>')
          ? `HTML Error Page: ${error.message} (HTTP ${error.response.status})`
          : error?.response?.data || error.message;

      console.warn('[GpsService] Error updating location:', errorMessage);
      return null;
    }
  }
}

export const gpsService = new GpsService();
