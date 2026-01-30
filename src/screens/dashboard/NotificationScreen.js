import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { markAllRead, clearAll, markRead } from '../../redux/slices/notificationSlice';
import NotificationCard from '../../components/notifications/NotificationCard';
import { groupNotificationsByDate } from '../../utils/notificationUtils';
import { navigate } from '../../navigation/RootNavigation';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.list);

  const grouped = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const onPressNotification = item => {
    dispatch(markRead(item.id));

    // 🔗 Deep link navigation (real-world)
    if (item.screen) {
      navigate(item.screen, item.params || {});
    }
  };

  const renderSection = ({ title, data }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {data.map(item => (
        <NotificationCard
          key={item.id}
          item={item}
          onPress={() => onPressNotification(item)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => dispatch(markAllRead())}>
            <Text style={styles.action}>Mark All Read</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => dispatch(clearAll())}>
            <Text style={styles.action}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([key]) => key}
        renderItem={({ item }) =>
          renderSection({ title: item[0], data: item[1] })
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9', // light app background
  },

  /* ================= HEADER ================= */

  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EC',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },

  headerActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },

  action: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF', // iOS / delivery blue
  },

  /* ================= SECTIONS ================= */

  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280', // muted grey
    marginBottom: 8,
  },
});
