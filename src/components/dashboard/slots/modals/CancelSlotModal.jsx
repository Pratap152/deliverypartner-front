import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SlotModalWrapper from './SlotModalWrapper';
import SlotDetailsCard from '../SlotDetailsCard';

/**
 * CancelSlotModal - Modal for confirming slot cancellation
 * Uses SlotModalWrapper and SlotDetailsCard for consistency
 * 
 * @param {boolean} visible - Whether modal is visible
 * @param {object} slot - Slot to cancel
 * @param {function} onClose - Handler for closing modal
 * @param {function} onConfirm - Handler for confirming cancellation
 */
export default function CancelSlotModal({ visible, slot, onClose, onConfirm }) {
  if (!slot) return null;

  return (
    <SlotModalWrapper
      visible={visible}
      title="Slot Cancellation"
      headerColor="#FF3B30"
      onClose={onClose}
      primaryButtonText="Yes, Cancel"
      primaryButtonColor="#FF3B30"
      onPrimaryPress={onConfirm}
      secondaryButtonText="Don't Cancel"
      onSecondaryPress={onClose}
    >
      {/* --- SLOT INFO --- */}
      <SlotDetailsCard slot={slot} />

      {/* --- CANCELLATION CHARGES BOX --- */}
      <View style={styles.chargesBox}>
        <View style={styles.chargesHeader}>
          <Text style={styles.chargesTitle}>Cancellation Charges</Text>
          <Text style={styles.chargesAmount}>Rs 0</Text>
        </View>
        <Text style={styles.chargesSubtext}>
          Yay! You have a Free Cancellation for this Slot
        </Text>
        <Text style={styles.chargesWarning}>
          No Amount Will be deducted form Payout
        </Text>
      </View>

      {/* --- WARNING MESSAGE --- */}
      <View style={styles.warningBox}>
        <Ionicons name="warning-outline" size={20} color="#D97706" style={{ marginRight: 10 }} />
        <Text style={styles.warningText}>
          Please review all information carefully before cancelling your slot booking.
        </Text>
      </View>
    </SlotModalWrapper>
  );
}

const styles = StyleSheet.create({
  // Cancellation Charges Box
  chargesBox: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chargesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chargesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  chargesAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  chargesSubtext: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 20,
  },
  chargesWarning: {
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '500',
  },

  // Warning
  warningBox: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});
