import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SlotModalWrapper from './SlotModalWrapper';
import SlotDetailsCard from '../SlotDetailsCard';



export default function BookSlotModal({ visible, slots, date: selectedDateStr, onClose, onConfirm }) {
  return (
    <SlotModalWrapper
      visible={visible}
      title="Slot Information"
      headerColor="#4C4CFF"
      onClose={onClose}
      primaryButtonText="Confirm Slot"
      primaryButtonColor="#4C4CFF"
      onPrimaryPress={onConfirm}
      secondaryButtonText="Cancel"
      onSecondaryPress={onClose}
    >
      {/* --- SLOTS LIST --- */}
      {slots.map((slot, index) => (
        <View key={slot.slotId} style={index > 0 && styles.slotCardBorder}>
          <SlotDetailsCard slot={slot} selectedDate={selectedDateStr} />
        </View>
      ))}

      {/* --- RULES SECTION --- */}
      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>Rules / Conditions</Text>
        <View style={styles.ruleItem}>
          <View style={styles.dot} />
          <Text style={styles.ruleText}>Mandatory login is required.</Text>
        </View>
        <View style={styles.ruleItem}>
          <View style={styles.dot} />
          <Text style={styles.ruleText}>No-show penalty may apply.</Text>
        </View>
        <View style={styles.ruleItem}>
          <View style={styles.dot} />
          <Text style={styles.ruleText}>Late login reduces priority.</Text>
        </View>
      </View>

      {/* --- WARNING BOX --- */}
      <View style={styles.warningBox}>
        <Ionicons name="warning-outline" size={20} color="#D97706" style={{ marginRight: 10 }} />
        <Text style={styles.warningText}>
          Please review all information carefully before confirming your slot booking.
        </Text>
      </View>
    </SlotModalWrapper>
  );
}

const styles = StyleSheet.create({
  slotCardBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },

  // Rules
  rulesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BCD4',
    marginTop: 8,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
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
