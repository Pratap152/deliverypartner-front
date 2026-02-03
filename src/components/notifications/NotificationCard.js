import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * item shape (real world):
 * {
 *   id,
 *   type,
 *   title,
 *   body,
 *   timeAgo,
 *   read,
 * }
 */

const NotificationCard = ({ item, onPress }) => {
  const isUnread = !item.read;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        isUnread && styles.unreadCard,
      ]}
    >
      {/* LEFT ICON / INDICATOR */}
      <View style={styles.left}>
        <View
          style={[
            styles.dot,
            isUnread && styles.unreadDot,
          ]}
        />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isUnread && styles.unreadTitle,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text
          style={styles.body}
          numberOfLines={2}
        >
          {item.body}
        </Text>

        <Text style={styles.time}>
          {item.timeAgo}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#EDEDED',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 2, // Android
  },

  unreadCard: {
    backgroundColor: '#FFF7ED', // subtle highlight
    borderColor: '#FED7AA',
  },

  /* LEFT INDICATOR */
  left: {
    width: 24,
    alignItems: 'center',
    paddingTop: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },

  unreadDot: {
    backgroundColor: '#F97316', // orange highlight
  },

  /* CONTENT */
  content: {
    flex: 1,
    paddingLeft: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  unreadTitle: {
    fontWeight: '700',
  },

  body: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },

  time: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
