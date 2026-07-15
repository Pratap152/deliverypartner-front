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
import { formatDuration } from '../../../utils/slotHelpers';



const { width } = Dimensions.get('window');
const isTablet = width >= 768;
export default function SlotCard({
  slot,
  weekData,
  selectable,
  selected,
  onSelect,
  onCancel,
  activeFilter,
}) {
  // Get display status using utility
  const displayStatus = getDisplayStatus(slot, activeFilter);

  const isPeakSlot =
    String(slot.isPeakSlot ?? weekData?.isPeakSlot) === "true" ||
    slot.isPeakSlot === true ||
    weekData?.isPeakSlot === true;

  const isBooked = displayStatus === DISPLAY_STATUS.BOOKED;
  const isCancelled = displayStatus === DISPLAY_STATUS.CANCELLED;
  const isAvailable = displayStatus === DISPLAY_STATUS.AVAILABLE;

  const duration =
    slot.durationMinutes ??
    weekData?.durationMinutes;

  const breakTime =
    slot.breakInMinutes ??
    weekData?.breakInMinutes;

  const iconColor = isBooked
    ? "#34C759"
    : isCancelled
    ? "#FF8A00"
    : isPeakSlot
    ? "#4C4CFF"
    : "#2563EB";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={selectable ? onSelect : null}
      style={[
        styles.card,
        isPeakSlot && styles.peakCard, 
        selected && styles.selectedCard,
        isBooked && styles.bookedCard,
        isCancelled && styles.cancelledCard,
      ]}
    >
      {/* ---------- TOP HEADER ROW ---------- */}
      <View style={styles.headerRow}>
        {/* Left: Icon + Time info */}
        <View style={styles.leftContent}>
            <View
              style={[
                styles.iconWrapper,
                isPeakSlot && styles.peakIconWrapper,
                isBooked && styles.bookedIconWrapper,
                isCancelled && styles.cancelledIconWrapper,
              ]}>
              <Ionicons
                name="time-outline"
                size={isTablet ? 34 : 22}
                color={iconColor}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.time}>
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </Text>

              <Text style={styles.details}>
                Duration {formatDuration(duration)} • Break{" "}
                {formatDuration(breakTime)}
              </Text>

              {isPeakSlot && (
                <View style={styles.peakInfoContainer}>
                  <Ionicons
                    name="flash"
                    size={14}
                    color="#4C4CFF"
                    style={{marginRight: 5}}
                  />
                  <Text style={styles.peakText}>
                    Peak Slot • High Demand
                  </Text>
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
  backgroundColor: '#F5F5FF',
  borderRadius: isTablet ? 24 : 16,
  borderWidth: 1,
  borderColor: '#D9E0FF',
  padding: isTablet ? 28 : 16,
  marginVertical: isTablet ? 14 : 8,
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 3,
},

peakCard: {
  backgroundColor: '#EEF1FF',
  shadowColor: '#4C4CFF',
  shadowOffset: {width: 0, height: 3},
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 5,
},

selectedCard: {
  borderColor: '#4C4CFF',
  borderWidth: 2,
},

bookedCard: {
  backgroundColor: '#F1FFF6',
  borderColor: '#34C759',
},

cancelledCard: {
  backgroundColor: '#FFF4EC',
  borderColor: '#FF8A00',
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
  width: isTablet ? 72 : 42,
  height: isTablet ? 72 : 42,
  borderRadius: isTablet ? 36 : 21,
  backgroundColor: '#E8EDFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: isTablet ? 20 : 12,
},

peakIconWrapper: {
  backgroundColor: '#D7DEFF',
},

bookedIconWrapper: {
  backgroundColor: '#E8F8ED',
},

cancelledIconWrapper: {
  backgroundColor: '#FFF0E5',
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
  peakInfoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  marginTop: 8,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 20,
  borderWidth: 1,
  backgroundColor: '#E8ECFF',
  borderColor: '#C7D2FE',
},

peakText: {
  color: '#3730A3',
  fontWeight: '700',
  fontSize: isTablet ? 16 : 12,
},

  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  details: {
  fontSize: isTablet ? 18 : 14,
  marginTop: 4,
},
});
