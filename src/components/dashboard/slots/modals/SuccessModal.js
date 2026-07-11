import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BaseModal from './BaseModal';
import {formatDuration, formatTime} from '../../../../utils/slotHelpers';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export default function SuccessModal({
  visible,
  onClose,
  slots = [],
}){
  const navigation = useNavigation();
  
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      cardStyle={styles.successCard}>
      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Slot Booked Successfully</Text>

      {slots.length > 0 ? (
        slots.map(slot => {
          const duration = slot.durationMinutes;
          const breakTime = slot.breakInMinutes;
          return (
            <View key={slot.slotId} style={styles.slotContainer}>
              <Text style={styles.slotTime}>
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </Text>

             <Text style={styles.slotDuration}>
                Duration {formatDuration(duration)}
                {breakTime != null
                  ? ` • Break ${formatDuration(breakTime)}`
                  : ""}
              </Text>
            </View>
          );
        })
      ) : (
        <Text style={styles.slotDuration}>
          Your slot has been booked successfully.
        </Text>
      )}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'MainTabs'}],
          })
        }>
        <Text style={styles.primaryText}>
          Go Online & Earn
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
    width: isTablet ? '70%' : '90%',
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
    marginBottom: 16,
  },

  slotContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },

  slotTime: {
    fontSize: isTablet ? 22 : 16,
    fontWeight: '700',
    color: '#000',
  },

  slotDuration: {
    fontSize: isTablet ? 18 : 14,
    color: '#555',
    marginTop: 4,
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