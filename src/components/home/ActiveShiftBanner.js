import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'; // safer
import apiClient from '../../services/ApiClient';
import SlotBookingScreen from "../../screens/dashboard/SlotBookingScreen";
/* ================= TIME FORMAT HELPERS ================= */
const formatTime = time => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const hour = h % 12 || 12;
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
};

// Convert minutes to "X hrs Y mins" format
const formatDelay = minutes => {
  if (!minutes || minutes === 0) return '0 mins';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return mins > 0 ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`;
  }
  return `${mins} mins`;
};

const ActiveShiftBanner = () => {
  const navigation = useNavigation();
  const [slot, setSlot] = useState(null);
  const [delayMinutes, setDelayMinutes] = useState(0);

  const fetchSlot = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/api/slots/current');
      if (data?.success && data?.data?.slot) {
        setSlot(data.data.slot);
        setDelayMinutes(data.data.delayMinutes || 0);
      } else {
        setSlot(null);
        setDelayMinutes(0);
      }
    } catch (error) {
      console.error('Failed to fetch slot:', error);
      setSlot(null);
      setDelayMinutes(0);
    }
  }, []);

  useEffect(() => {
    fetchSlot();
    const interval = setInterval(fetchSlot, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSlot]);

  const slotState = !slot
    ? 'NONE'
    : slot.status === 'ACTIVE'
    ? 'ACTIVE'
    : 'UPCOMING';

  const uiConfig = {
    ACTIVE: {
      title: 'Active Shift',
      subtitleSuffix: '',
      info: slot?.incentiveText || 'Go online and earn more',
      background: styles.active,
      onPress: () => navigation.navigate(SlotBookingScreen),
    },
    UPCOMING: {
      title: 'Next Shift',
      subtitleSuffix: ' (Upcoming)',
      info: 'Upcoming shift — wait until it becomes active',
      background: styles.inactive,
      onPress: () => Alert.alert('No Active Slot', 'Currently no active slot'),
    },
    NONE: {
      title: 'Shift',
      subtitleSuffix: '',
      info: 'Please check back later',
      background: styles.inactive,
      onPress: () => Alert.alert('No Slot', 'No shifts available today'),
    },
  };

  const config = uiConfig[slotState];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={config.onPress}
      style={[styles.container, config.background]}
    >
      {delayMinutes > 0 && (
        <View style={styles.delayBadge}>
          <Text style={styles.delayText}>
            Delay {formatDelay(delayMinutes)}
          </Text>
        </View>
      )}

      <Text style={styles.title}>{config.title}</Text>

      {slot ? (
        <View>
          <Text style={styles.subtitle}>
            {slot.isPeakSlot ? 'Peak Hours • ' : ''}
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            {config.subtitleSuffix}
          </Text>

          <Text style={styles.meta}>
            Duration: {slot.durationInHours} hrs | Break: {slot.breakInMinutes}{' '}
            mins
          </Text>

          <Text style={styles.info}>{config.info}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.subtitle}>No shift today</Text>
          <Text style={styles.info}>{config.info}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ActiveShiftBanner;

const styles = StyleSheet.create({
  container: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginTop: wp('4%'),
    position: 'relative',
  },

  active: {
    backgroundColor: '#6D5DF6',
  },
  inactive: {
    backgroundColor: '#9CA3AF',
  },
  title: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: '#E0E7FF',
    marginTop: 4,
  },
  meta: {
    fontSize: wp('3.2%'),
    color: '#E5E7FF',
    marginTop: 4,
  },
  info: {
    fontSize: wp('3.4%'),
    color: '#D1D5FF',
    marginTop: 6,
  },
  delayBadge: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    // backgroundColor: '#544e58',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('4%'),
    zIndex: 10,
  },

  delayText: {
    color: '#FFFFFF',
    fontSize: wp('3%'),
    fontWeight: '700',
  },
});
