import React from 'react';
import { View, StyleSheet } from 'react-native';
import SlotInfoRow from './SlotInfoRow';
import { formatTime, formatDate } from '../../../utils/slotHelpers';


export default function SlotDetailsCard({ slot, selectedDate }) {
    return (
        <View style={styles.container}>
            {/* Day Row */}
            <SlotInfoRow
                icon="calendar-outline"
                iconColor="#4C4CFF"
                backgroundColor="#EBF5FF"
                label="Day"
                value={slot.day || formatDate(slot.date || selectedDate, { weekday: 'long' })}
            />

            {/* Time Row */}
            <SlotInfoRow
                icon="time-outline"
                iconColor="#9333EA"
                backgroundColor="#F3E8FF"
                label="Time"
                value={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
            />

            {/* Slot Type Row */}
            <SlotInfoRow
                icon="alert-circle-outline"
                iconColor="#EF4444"
                backgroundColor="#FEE2E2"
                label="Slot Type"
                value={slot.slotType || 'FILLING FAST'}
            />

            {/* Additional Earnings Row */}
            <SlotInfoRow
                icon="checkmark-circle-outline"
                iconColor="#16A34A"
                backgroundColor="#DCFCE7"
                label="Additional Earnings"
                value="Yes"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
});
