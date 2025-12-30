import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

export default function NextWeekLocked() {
  return (
    <View style={styles.lockContainer}>
      <Text style={styles.lockText}>
        The next week slots will be available only after Saturday, post 2:00 PM.
      </Text>
    </View>
  );
}
