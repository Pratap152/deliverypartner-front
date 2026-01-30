import { Platform } from 'react-native';
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onTokenRefresh,
  setBackgroundMessageHandler,
  getInitialNotification,
  onNotificationOpenedApp,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const messaging = getMessaging(getApp());

const FCMService = {

  /* ---------------- PERMISSION ---------------- */
  async requestUserPermission() {
    const authStatus = await requestPermission(messaging);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  },

  /* ---------------- TOKEN ---------------- */
  async getFCMToken() {
    const token = await getToken(messaging);
    return token;
  },

  listenTokenRefresh(callback) {
    return onTokenRefresh(messaging, callback);
  },

  /* ---------------- FOREGROUND ---------------- */
  listenForegroundMessages(callback) {
    return onMessage(messaging, callback);
  },

  /* ---------------- BACKGROUND ---------------- */
  registerBackgroundHandler() {
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('FCM BACKGROUND:', remoteMessage);
    });
  },

  /* ---------------- NOTIFICATION OPEN ---------------- */
  handleNotificationOpen(callback) {
    return onNotificationOpenedApp(messaging, callback);
  },

  async handleInitialNotification() {
    return await getInitialNotification(messaging);
  },
};

export default FCMService;
