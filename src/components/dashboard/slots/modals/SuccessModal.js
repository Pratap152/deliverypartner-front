import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BaseModal from './BaseModal';
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
    borderRadius: isTablet ? 32 : 20,
    padding: isTablet ? 42 : 24,
    alignItems: 'center',
    width: isTablet ? '70%' : '100%',
},

 checkCircle: {
    width: isTablet ? 110 : 64,
    height: isTablet ? 110 : 64,
    borderRadius: isTablet ? 55 : 32,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 24 : 12,
},
  check: {
    color: '#FFF',
    fontSize: isTablet ? 52 : 32,
    fontWeight: '900',
},
  title: {
    fontSize: isTablet ? 34 : 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 8,
},
subTitle: {
    fontSize: isTablet ? 22 : 14,
    color: '#4A4A4A',
    marginTop: 10,
},

  earning: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '700',
    color: '#1E7F3D',
    marginTop: 14,
},

 primaryBtn: {
    marginTop: isTablet ? 30 : 20,
    backgroundColor: '#34C759',
    paddingVertical: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? 50 : 30,
    borderRadius: isTablet ? 20 : 14,
},

 primaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: isTablet ? 20 : 14,
},
});
