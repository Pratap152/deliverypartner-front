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
        pressAction: {
          id: 'default',
        },
      },
      data,
    });
  }
}

export default new NotificationService();


// GET notifications
export const getNotifications = async ({
  page = 1,
  limit = 20,
  isRead,
  type,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (typeof isRead === 'boolean') {
    params.isRead = isRead;
  }

  if (type) {
    params.type = type;
  }

  const response = await apiClient.get(
    '/api/rider/notifications',
    { params },
  );

  return response.data;
};


// GET unread count
export const getUnreadNotificationCount = async () => {
  const response = await apiClient.get(
    '/api/rider/notifications/unread-count',
  );

  return response.data;
};


// DELETE one notification
export const deleteNotification = async notificationId => {
  const response = await apiClient.delete(
    `/api/rider/notifications/${notificationId}`,
  );

  return response.data;
};


// DELETE all notifications
export const clearAllNotifications = async () => {
  const response = await apiClient.delete(
    '/api/rider/notifications',
  );

  return response.data;
};

// "mark as read" API
export const markNotificationAsRead = async notificationId => {
  try {
    const response = await apiClient.patch(
      `/api/rider/notifications/${notificationId}/read`,
    );

    return response?.data;
  } catch (error) {
    console.log(
      'Mark Notification Read Error:',
      error?.response?.data || error,
    );

    throw error;
  }
};

// Mark All Read API
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.patch(
      '/api/rider/notifications/read-all',
    );

    return response?.data;
  } catch (error) {
    console.log(
      'Mark All Notifications Read Error:',
      error?.response?.data || error,
    );

    throw error;
  }
};