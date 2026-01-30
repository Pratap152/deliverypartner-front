import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import { store } from './src/redux/store';
import NotificationService from './src/services/NotificationService';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async msg => {
  await NotificationService.show(msg);



  await NotificationService.show({
    title: notification?.title || 'New Update',
    body: notification?.body || '',
    data,
    channelId: data?.channelId || 'slots',
  });
});

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
