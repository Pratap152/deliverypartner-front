import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }) {
  const getBadge = () => {
    switch (status) {
      case 'FULL_DAY':
        return {
          text: 'Full Day',
          bg: '#DCFCE7',
          color: '#16A34A',
        };

      case 'HALF_DAY':
        return {
          text: '2/3 Day',
          bg: '#FEF3C7',
          color: '#D97706',
        };

      case 'ONE_THIRD_DAY':
        return {
          text: '1/3 Day',
          bg: '#FFEDD5',
          color: '#EA580C',
        };

      case 'ABSENT':
        return {
          text: 'Absent',
          bg: '#FEE2E2',
          color: '#DC2626',
        };

      case 'HOLIDAY':
        return {
          text: 'Holiday',
          bg: '#F3F4F6',
          color: '#6B7280',
        };

      default:
        return {
          text: '-',
          bg: '#F3F4F6',
          color: '#6B7280',
        };
    }
  };

  const badge = getBadge();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badge.bg,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: badge.color,
          },
        ]}
      >
        {badge.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});