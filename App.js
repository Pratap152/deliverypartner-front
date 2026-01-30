import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { AuthProvider } from './src/hooks/useAuth';
import { navigationRef, navigate } from './src/navigation/RootNavigation';

import { authEvents, AUTH_EVENTS } from './src/services/AuthEvents';
import { authService } from './src/services/AuthService';

import FCMService from './src/services/fcmService';
import apiClient, { updateFcmToken } from './src/services/ApiClient'; // 👈 your backend api wrapper

const App = () => {

  /* ---------------- AUTH EVENTS (UNCHANGED) ---------------- */
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(event => {
      if (event === AUTH_EVENTS.FORCE_LOGOUT) {
        authService.forceLogout();
      }
    });

    return unsubscribe;
  }, []);

  /* ---------------- FCM BOOTSTRAP ---------------- */
  useEffect(() => {
    initFCM();
  }, []);

  const initFCM = async () => {
    try {
      // 🔐 Android 13+ permission (CRITICAL)
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission denied');
          return;
        }
      }

      // 🔔 Firebase permission (iOS + Android)
      const permissionGranted = await FCMService.requestUserPermission();
      if (!permissionGranted) return;

      // 🎯 Get token
      const token = await FCMService.getFCMToken();
      console.log('FCM TOKEN:', token);

      // 🚀 Send token to backend (MANDATORY)
      await updateFcmToken({
        token,
        platform: Platform.OS,
        appVersion: '1.0.0',     // real apps always send this
        deviceType: 'mobile',
      });

      // 🔁 Token refresh handling (VERY IMPORTANT)
      FCMService.listenTokenRefresh(async newToken => {
        await updateFcmToken({
          token: newToken,
          platform: Platform.OS,
          appVersion: '1.0.0',
          deviceType: 'mobile',
        });
      });


      // 📩 Foreground messages
      FCMService.listenForegroundMessages(handleForegroundMessage);

      // 🌙 Background / killed state
      FCMService.registerBackgroundHandler();

      // 📲 App opened from background
      FCMService.handleNotificationOpen(handleNotificationClick);

      // 🚀 App opened from killed state
      const initialMsg = await FCMService.handleInitialNotification();
      if (initialMsg) handleNotificationClick(initialMsg);

    } catch (error) {
      console.log('FCM init error:', error);
    }
  };

  /* ---------------- MESSAGE HANDLERS ---------------- */

  const handleForegroundMessage = remoteMessage => {
    console.log('FCM FOREGROUND:', remoteMessage.notification
);

    // 🚫 System notification NOT used in foreground
    Alert.alert(
      remoteMessage.notification?.title || 'New Update',
      remoteMessage.notification?.body || ''
    );
  };

  const handleNotificationClick = remoteMessage => {
    console.log('FCM CLICK:', remoteMessage);

    const { type, orderId } = remoteMessage.data || {};

    // 🧭 Deep-link navigation (real delivery logic)
    if (type === 'ORDER_ASSIGNED') {
      navigate('OrderDetails', { orderId });
    }

    if (type === 'FORCE_LOGOUT') {
      authService.forceLogout();
    }
  };

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
};

export default App;
