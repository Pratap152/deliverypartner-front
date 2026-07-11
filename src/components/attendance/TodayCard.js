import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const TodayCard = ({ attendance }) => {

  const getStatus = status => {
    switch (status) {
      case 'FULL_DAY':
        return {
          label: 'Full Day',
          color: '#4CAF50',
          icon: 'checkmark-circle',
        };

      case 'HALF_DAY':
        return {
          label: 'Half Day',
          color: '#FFC107',
          icon: 'time',
        };

      case 'ABSENT':
        return {
          label: 'Absent',
          color: '#F44336',
          icon: 'close-circle',
        };

      case 'HOLIDAY':
        return {
          label: 'Holiday',
          color: '#FF9800',
          icon: 'calendar',
        };

      default:
        return {
          label: '--',
          color: '#999',
          icon: 'help-circle',
        };
    }
  };

  if (!attendance) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Today's Attendance
        </Text>

        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={50}
            color="#BDBDBD"
          />

          <Text style={styles.emptyText}>
            No attendance available today
          </Text>
        </View>
      </View>
    );
  }

  const status = getStatus(attendance.status);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Today's Attendance
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Check In</Text>
        <Text style={styles.value}>
          {attendance.checkIn || '--'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Check Out</Text>
        <Text style={styles.value}>
          {attendance.checkOut || '--'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Working Hours</Text>
        <Text style={styles.value}>
          {attendance.workingHours || '--'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>

        <View style={styles.statusContainer}>
          <Ionicons
            name={status.icon}
            size={18}
            color={status.color}
          />

          <Text
            style={[
              styles.statusText,
              { color: status.color },
            ]}>
            {status.label}
          </Text>
        </View>

      </View>

    </View>
  );
};

export default TodayCard;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: responsiveHeight(5),
  },

  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    fontWeight: '500',
  },

  value: {
    fontSize: responsiveFontSize(1.9),
    color: '#1F3365',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 6,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    marginLeft: 6,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },

  emptyText: {
    marginTop: 12,
    fontSize: responsiveFontSize(1.8),
    color: '#888',
    textAlign: 'center',
  },

});