import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import colors from '../../../../utils/colors';

export default function SlotCard({ slot, selected, onSelect, onBook, onCancel }) {
  const isFull = slot.bookedRiders >= slot.maxRiders;
  const isAvailable = slot.isAvailable && !slot.isLocked && !isFull;
  const isBooked = slot.bookedRiders > 0;

  return (
    <TouchableOpacity
      style={[
        styles.slotCard,
        selected && { borderWidth: 2, borderColor: colors.primary },
      ]}
      onPress={() => onSelect(slot.slotId)}
      activeOpacity={0.9}
    >
      <View style={styles.slotHeader}>
        <Text style={styles.slotTime}>
          {slot.startTime} - {slot.endTime}
        </Text>

        {slot.isPeakSlot && (
          <View style={styles.highDemand}>
            <Text style={styles.highDemandText}>
              {slot.incentiveText || 'High Demand'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.earning}>
        Duration: {slot.durationInHours} hrs
      </Text>

      {isAvailable && (
        <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
          <Text style={styles.bookText}>Book Slot</Text>
        </TouchableOpacity>
      )}

      {isBooked && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel Slot</Text>
        </TouchableOpacity>
      )}

      {!isAvailable && !isBooked && (
        <Text style={styles.cancelledLabel}>Unavailable</Text>
      )}
    </TouchableOpacity>
  );
}
