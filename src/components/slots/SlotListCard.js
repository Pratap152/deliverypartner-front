import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import dayjs from 'dayjs';

const SlotListCard = ({slots = []}) => {
  if (!slots.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No slots available
        </Text>
      </View>
    );
  }

  const getStatusColor = status => {
    switch (status) {
      case 'COMPLETED':
        return '#22C55E';

      case 'BOOKED':
      case 'ASSIGNED':
        return '#F59E0B';

      case 'MISSED':
      case 'CANCELLED':
        return '#EF4444';

      default:
        return '#64748B';
    }
  };

  const formatTime = time => {
    if (!time) return '--';

    return dayjs(time).format('hh:mm A');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        List of Slots
      </Text>

      {slots.map(slot => (
        <View
          key={slot.slotId}
          style={styles.card}>

          {/* Header */}

          <View style={styles.header}>
            <Text style={styles.slotTitle}>
              Slot #{slot.slotNumber}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: getStatusColor(
                    slot.status,
                  ),
                },
              ]}>
              <Text style={styles.badgeText}>
                {slot.status}
              </Text>
            </View>
          </View>

          {/* Slot Time */}

          <View style={styles.slotTimeRow}>
            <Ionicons
              name="time-outline"
              size={18}
              color="#3558B5"
            />

            <Text style={styles.slotTime}>
              {slot.slotTime}
            </Text>
          </View>

          {/* Details */}

          <View style={styles.grid}>

            <View style={styles.item}>
              <Text style={styles.label}>
                Login Time
              </Text>

              <Text style={styles.value}>
                {formatTime(slot.loginTime)}
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>
                Logout Time
              </Text>

              <Text style={styles.value}>
                {formatTime(slot.logoutTime)}
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>
                Worked Time
              </Text>

              <Text style={styles.value}>
                {slot.workedTime}
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>
                Orders Delivered
              </Text>

              <Text style={styles.value}>
                {slot.completedOrders}
              </Text>
            </View>

          </View>
        </View>
      ))}
    </View>
  );
};

export default SlotListCard;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    paddingHorizontal: wp(4),
  },

  heading: {
    fontSize: responsiveFontSize(2.07),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp(1.2),
  },

 card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  paddingTop: hp(1.5),
  paddingBottom: hp(1.8),
  paddingHorizontal: wp(4),
  paddingVertical: hp(1.5), 
  marginBottom: hp(1.3),  
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.7),
  },

  slotTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#111827',
  },

  badge: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.45),
    borderRadius: 20,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '700',
  },

  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  slotTime: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#3558B5',
    fontSize: responsiveFontSize(1.7),
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: hp(0.5),
  },

  item: {
    width: '48%',
    marginBottom: hp(1),
  },

  label: {
    color: '#6B7280',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 2,
  },

  value: {
    color: '#111827',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },

  emptyContainer: {
    marginTop: hp(3),
    alignItems: 'center',
  },

  emptyText: {
    color: '#6B7280',
    fontSize: responsiveFontSize(1.8),
  },
});