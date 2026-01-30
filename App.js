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
import apiClient, { updateFcmToken } from './src/services/ApiClient'; 

import { useDispatch } from 'react-redux';
import NotificationService from './src/services/NotificationService';
import { addNotification } from './src/redux/slices/notificationSlice';

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

useEffect(() => {
  NotificationService.init(); // 🔥 ADD (safe)
  initFCM();
}, []);

const dispatch = useDispatch();

const initFCM = async () => {
  try {
    /* ---------------- ANDROID 13 PERMISSION (UNCHANGED) ---------------- */
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return;
      }
    }

    /* ---------------- FIREBASE PERMISSION (UNCHANGED) ---------------- */
    const permissionGranted = await FCMService.requestUserPermission();
    if (!permissionGranted) return;

    /* ---------------- TOKEN (UNCHANGED) ---------------- */
    const token = await FCMService.getFCMToken();
    console.log('FCM TOKEN:', token);

    await updateFcmToken({
      token,
      platform: Platform.OS,
      appVersion: '1.0.0',
      deviceType: 'mobile',
    });

    /* ---------------- TOKEN REFRESH (UNCHANGED) ---------------- */
    FCMService.listenTokenRefresh(async newToken => {
      await updateFcmToken({
        token: newToken,
        platform: Platform.OS,
        appVersion: '1.0.0',
        deviceType: 'mobile',
      });
    });

    /* ---------------- FOREGROUND (UPGRADED) ---------------- */
    FCMService.listenForegroundMessages(async msg => {
  await NotificationService.show(msg);

  dispatch(addNotification(normalize(msg)));
});

    /* ---------------- OPEN FROM BACKGROUND (UNCHANGED) ---------------- */
    FCMService.handleNotificationOpen(handleNotificationClick);

    /* ---------------- OPEN FROM KILLED (UNCHANGED) ---------------- */
    const initialMsg = await FCMService.handleInitialNotification();
    if (initialMsg) handleNotificationClick(initialMsg);

  } catch (error) {
    console.log('FCM init error:', error);
  }
};

/* ===================================================== */
/* =============== MESSAGE HANDLERS ==================== */
/* ===================================================== */

// const handleForegroundMessage = async remoteMessage => {
//   const { notification, data } = remoteMessage;

//   console.log('FCM FOREGROUND:', notification);

//   // 🔔 REAL SYSTEM NOTIFICATION (instead of Alert)
//   await NotificationService.show({
//     title: notification?.title || 'New Update',
//     body: notification?.body || '',
//     data,
//     channelId: data?.channelId || 'system',
//   });

//   // 💾 SAVE TO REDUX (notification screen)
//   dispatch(
//     addNotification({
//       id: data?.id || Date.now().toString(),
//       title: notification?.title,
//       body: notification?.body,
//       screen: data?.screen,
//       params: data?.params ? JSON.parse(data.params) : {},
//       read: false,
//       createdAt: Date.now(),
//       type: data?.type,
//     })
//   );
// };

const handleForegroundMessage = async remoteMessage => {
  const { notification, data } = remoteMessage;

  await NotificationService.show({
    title: notification?.title,
    body: notification?.body,
    data,
    channelId: data?.channelId || 'slots',
  });

  dispatch(
    addNotification({
      id: data.id,
      title: notification.title,
      body: notification.body,
      type: data.type,
      screen: data.screen,
      params: data.params ? JSON.parse(data.params) : {},
      read: false,
      createdAt: Date.now(),
    })
  );
};


// const handleNotificationClick = remoteMessage => {
//   if (!remoteMessage) return;

//   console.log('FCM CLICK:', remoteMessage);

//   const { type, orderId, screen, params } = remoteMessage.data || {};

//   if (screen) {
//     navigate(screen, params ? JSON.parse(params) : {});
//   }

//   if (type === 'FORCE_LOGOUT') {
//     authService.forceLogout();
//   }
// };

const handleNotificationClick = remoteMessage => {
  if (!remoteMessage) return;

  const { type, screen, params } = remoteMessage.data || {};

  // 🎯 SLOT ROUTING
  if (type?.startsWith('SlotBookingScreen') && screen) {
    navigate(screen, params ? JSON.parse(params) : {});
  }
};


  return (
   <AuthProvider>
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  </AuthProvider>
  );
};

export default App;
