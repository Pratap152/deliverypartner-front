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
import { Dimensions } from 'react-native';



const { width } = Dimensions.get('window');
const isTablet = width >= 768;
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

  // Check for peak slot (handle string or boolean)
  const isPeakSlot = String(slot.isPeakSlot) === "true" || slot.isPeakSlot === true;

  const isBooked = displayStatus === DISPLAY_STATUS.BOOKED;
  const isCancelled = displayStatus === DISPLAY_STATUS.CANCELLED;
  const isAvailable = displayStatus === DISPLAY_STATUS.AVAILABLE;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={selectable ? onSelect : null}
      style={[
        styles.card,
        isPeakSlot && styles.peakCard, // Apply peak style base
        selected && styles.selectedCard,
        isBooked && styles.bookedCard,
        isCancelled && styles.cancelledCard,
      ]}
    >
      {/* ---------- TOP HEADER ROW ---------- */}
      <View style={styles.headerRow}>
        {/* Left: Icon + Time info */}
        <View style={styles.leftContent}>
          <View style={[styles.iconWrapper, isPeakSlot && styles.peakIconWrapper]}>
            <Ionicons name="flash" size={18} color={isPeakSlot ? "#4C4CFF" : "#FF6A00"} />
          </View>
          <View>
            <Text style={styles.time}>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </Text>
            <Text style={styles.earn}>
              Duration {slot.durationInHours} hrs • Break {slot.breakInMinutes} mins
            </Text>

            {/* Peak Slot Indicator */}
            {isPeakSlot && (
              <View style={styles.peakInfoContainer}>
                <Ionicons name="wallet-outline" size={16} color="#4C4CFF" style={{ marginRight: 4 }} />
                <Text style={styles.peakText}>Peak Slot • Get 20% more orders</Text>
              </View>
            )}
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
            <Checkbox checked={selected} onPress={selectable ? onSelect : null} />
          )}

          {/* Status Badge (Moved to right for better layout if needed, or keep at bottom) */}
          {/* The user didn't explicitly ask to move badge but image suggests a cleaner layout. 
                 I'll keep badge at bottom for now to minimize structure change unless it looks bad. 
                 Actually, let's keep the existing badge structure but maybe adjust if peak.
             */}
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
    borderRadius: isTablet ? 24 : 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: isTablet ? 28 : 16,
    marginVertical: isTablet ? 14 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
},
  peakCard: {
    backgroundColor: '#F5F5FF', 
    borderColor: '#C7C7FF',     
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
    alignItems: 'flex-start', // Changed to flex-start for multiline text alignment
    flex: 1,
  },
  rightContent: {
    paddingLeft: 10,
    alignItems: 'flex-end',
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
    width: isTablet ? 72 : 40,
    height: isTablet ? 72 : 40,
    borderRadius: isTablet ? 36 : 20,
    backgroundColor: '#FFE5D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 20 : 12,
},
  peakIconWrapper: {
    backgroundColor: '#E0E0FF', 
  },
  time: {
    fontSize: isTablet ? 30 : 16,
    fontWeight: '700',
    color: '#000',
},
  earn: {
    fontSize: isTablet ? 18 : 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 6,
},
  // Peak specific text styles
  peakInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  peakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4C4CFF', // Brand color for text
  },

  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center', // Keep centered as before
  },
});
