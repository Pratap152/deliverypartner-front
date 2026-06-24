import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import App from './App';
import { store } from './src/redux/store';
import NotificationService from './src/services/NotificationService';
import { name as appName } from './app.json';

/* Firebase Messaging Instance */
const messaging = getMessaging(getApp());

/* Background Notification Handler */
setBackgroundMessageHandler(
  messaging,
  async remoteMessage => {
    console.log(
      'BACKGROUND MESSAGE:',
      JSON.stringify(remoteMessage, null, 2)
    );

    try {
      await NotificationService.init();

      await NotificationService.show(remoteMessage);
    } catch (error) {
      console.log(
        'Background notification error:',
        error
      );
    }
  }
);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(
  appName,
  () => Root
);