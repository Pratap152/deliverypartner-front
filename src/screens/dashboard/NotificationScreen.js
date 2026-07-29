
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeviceInfo from 'react-native-device-info';

import { getNotifications } from '../../services/NotificationService';

import apiClient from '../../services/ApiClient';
import { routeNotification } from '../../components/notifications/router';

dayjs.extend(relativeTime);
const isTablet = DeviceInfo.isTablet();
const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();

      setNotifications(response?.data || []);
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => routeNotification(item)}
    >
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
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1F3365" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: '#0284C7' }}
    >
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#0284C7"
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
    backgroundColor: '#0284C7',
    paddingHorizontal: isTablet ? wp('4%') : 18,
    paddingTop: isTablet ? hp('1%') : 4,
    paddingVertical: isTablet ? hp('2.5%') : 18,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: isTablet ? wp('3.2%') : 22,
    fontWeight: '700',
  },

  headerSubTitle: {
    marginTop: isTablet ? hp('0.6%') : 4,
    color: '#E0F2FE',
    fontSize: isTablet ? wp('2%') : 13,
  },

  list: {
    padding: isTablet ? wp('3%') : 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: isTablet ? 18 : 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: isTablet ? wp('2.8%') : 14,
    marginBottom: isTablet ? hp('1.8%') : 12,
    alignItems: 'center',
  },

  iconContainer: {
    width: isTablet ? wp('6%') : 42,
    height: isTablet ? wp('6%') : 42,
    borderRadius: isTablet ? wp('1.4%') : 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? wp('2.5%') : 12,
  },

  icon: {
    fontSize: isTablet ? wp('2.5%') : 18,
    color: '#0284C7',
    fontWeight: '700',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: isTablet ? wp('2.5%') : 15,
    fontWeight: '600',
    color: '#111827',
  },

  body: {
    marginTop: isTablet ? hp('0.5%') : 4,
    fontSize: isTablet ? wp('2%') : 13,
    lineHeight: isTablet ? hp('2.6%') : 18,
    color: '#6B7280',
  },

  time: {
    marginTop: isTablet ? hp('0.8%') : 8,
    fontSize: isTablet ? wp('1.8%') : 12,
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
    fontSize: isTablet ? wp('3%') : 18,
    fontWeight: '600',
    color: '#111827',
  },

  emptyText: {
    marginTop: isTablet ? hp('0.8%') : 6,
    color: '#6B7280',
    fontSize: isTablet ? wp('2%') : 14,
  },
});