import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import apiClient from '../../services/ApiClient';

dayjs.extend(relativeTime);

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get(
        '/api/notifications/all',
      );

      setNotifications(response?.data?.data || []);
    } catch (error) {
      console.log(
        'Notifications Error:',
        error?.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };

  const getIconText = type => {
    if (type?.includes('SLOT')) return '🕒';
    if (type?.includes('ORDER')) return '📦';
    if (type?.includes('EARNING')) return '₹';
    return '🔔';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {getIconText(item.type)}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.body}>
          {item.body}
        </Text>

        <Text style={styles.time}>
          {dayjs(item.createdAt).fromNow()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#192A51" />
        </View>
      </SafeAreaView>
    );
  }

  return (
   <SafeAreaView
  edges={['top']}
  style={{ flex: 1, backgroundColor: '#192A51' }}
>
  <View style={styles.container}>
      <StatusBar
        backgroundColor="#192A51"
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        <Text style={styles.headerSubTitle}>
          Stay updated with your delivery activities
        </Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No Notifications
          </Text>

          <Text style={styles.emptyText}>
            You're all caught up.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    backgroundColor: '#192A51',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingVertical: 18,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  headerSubTitle: {
    marginTop: 4,
    color: '#D7DDEA',
    fontSize: 13,
  },

  list: {
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 18,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  body: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },

  time: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  emptyText: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },
});