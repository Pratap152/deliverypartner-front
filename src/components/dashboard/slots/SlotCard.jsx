import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatTime, getDisplayStatus } from '../../../utils/slotHelpers';
import { DISPLAY_STATUS } from '../../../utils/constants/slotConstants';
import StatusBadge from './StatusBadge';
import Checkbox from './Checkbox';

/**
 * SlotCard Component
 * Displays slot information with status, time, and actions
 * 
 * @param {object} slot - Slot data object
 * @param {boolean} selectable - Whether slot can be selected
 * @param {boolean} selected - Whether slot is currently selected
 * @param {function} onSelect - Handler for selection
 * @param {function} onCancel - Handler for cancellation
 * @param {string} activeFilter - Current active filter
 */
export default function SlotCard({
  slot,
  selectable,
  selected,
  onSelect,
  onCancel,
  activeFilter,
}) {
  // Get display status using utility
  const displayStatus = getDisplayStatus(slot, activeFilter);

  const isBooked = displayStatus === DISPLAY_STATUS.BOOKED;
  const isCancelled = displayStatus === DISPLAY_STATUS.CANCELLED;
  const isAvailable = displayStatus === DISPLAY_STATUS.AVAILABLE;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={selectable ? onSelect : null}
      style={[
        styles.card,
        selected && styles.selectedCard,
        isBooked && styles.bookedCard,
        isCancelled && styles.cancelledCard,
      ]}
    >
      {/* ---------- TOP HEADER ROW ---------- */}
      <View style={styles.headerRow}>
        {/* Left: Icon + Time info */}
        <View style={styles.leftContent}>
          <View style={styles.iconWrapper}>
            <Ionicons name="flash" size={18} color="#FF6A00" />
          </View>
          <View>
            <Text style={styles.time}>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </Text>
            <Text style={styles.earn}>
              Duration {slot.durationInHours} hrs • Break {slot.breakInMinutes} mins
            </Text>
          </View>
        </View>


        {/* Right Content */}
        <View style={styles.rightContent}>
          {/* TRASH ICON (Top-Right) for Booked Slots */}
          {isBooked && (
            <TouchableOpacity onPress={onCancel} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          )}

          {/* Checkbox for Available slots */}
          {isAvailable && selectable && (
            <Checkbox checked={selected} onPress={selectable ? onSelect : null}  />
          )}
        </View>
      </View>

      {/* ---------- STATUS ROW ---------- */}
      <View style={styles.statusRow}>
        <StatusBadge status={displayStatus} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#4C4CFF',
    backgroundColor: '#F0F0FF',
  },
  bookedCard: {
    borderColor: '#34C759',
    backgroundColor: '#F1FFF6',
  },
  cancelledCard: {
    borderColor: '#FF6A00',
    backgroundColor: '#FFF4EC',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContent: {
    paddingLeft: 10,
  },
  trashBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  earn: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
