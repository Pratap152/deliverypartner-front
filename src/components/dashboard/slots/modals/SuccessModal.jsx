import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BaseModal from './BaseModal';

/**
 * SuccessModal - Modal for successful slot booking
 * Uses BaseModal wrapper with custom card styling
 * 
 * @param {boolean} visible - Whether modal is visible
 * @param {function} onClose - Handler for closing modal
 */
export default function SuccessModal({ visible, onClose }) {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      cardStyle={styles.successCard}
    >
      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Slot Booked</Text>

      <Text style={styles.subTitle}>
        Shift Login : 4hrs
      </Text>

      <Text style={styles.earning}>
        Estimated Earnings ₹180–250
      </Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
        <Text style={styles.primaryText}>
          Go Online & Start Earning
        </Text>
      </TouchableOpacity>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  successCard: {
    backgroundColor: '#E9F9EF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  check: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 8,
  },

  subTitle: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 6,
  },

  earning: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E7F3D',
    marginTop: 10,
  },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  primaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
