import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function BookedSummary({ weeklySlots, onHistory }) {
  const bookedCount = useMemo(() => {
    return weeklySlots?.reduce((acc, day) => {
      return acc + day.slots.filter(s => s.bookedRiders > 0).length;
    }, 0);
  }, [weeklySlots]);

  if (!bookedCount) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>
        Your Booked Slots ({bookedCount})
      </Text>

      <TouchableOpacity onPress={onHistory}>
        <Text style={styles.summaryLink}>View Shift History →</Text>
      </TouchableOpacity>
    </View>
  );
}
