import notifee, { AndroidImportance } from '@notifee/react-native';
import { CHANNELS } from '../components/notifications/channels';
import apiClient from './ApiClient';

class NotificationService {
  async init() {
    for (const key in CHANNELS) {
      const c = CHANNELS[key];
      await notifee.createChannel({
        id: c.id,
        name: key,
        importance: AndroidImportance[c.importance],
      });
    }
  }

  async show(remoteMessage) {
    const { notification, data } = remoteMessage;

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      android: {
        channelId: data.channelId || 'system',
        pressAction: { id: 'default' },
      },
      data,
    });
  }
}

export default new NotificationService();

export const getNotifications = async () => {
  const response = await apiClient.get('/api/rider/notifications/all',);
  return response.data;
}
