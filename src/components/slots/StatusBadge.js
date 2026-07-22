import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const getStatusColor = status => {
  switch (status) {
    case 'ASSIGNED':
      return '#2563EB';

    case 'COMPLETED':
      return '#16A34A';

    case 'MISSED':
      return '#DC2626';

    case 'CANCELLED':
      return '#6B7280';

    case 'ONGOING':
      return '#F59E0B';

    default:
      return '#64748B';
  }
};

const StatusBadge = ({status}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${getStatusColor(status)}20`,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: getStatusColor(status),
          },
        ]}>
        {status || '--'}
      </Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});