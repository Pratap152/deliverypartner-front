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

const getAttendanceColor = status => {
  switch (status) {
    case 'FULL_DAY':
      return '#22C55E';
    case 'HALF_DAY':
      return '#F59E0B';
    case 'ABSENT':
      return '#EF4444';
    case 'IN_PROGRESS':
      return '#13ACBE';
    case 'HOLIDAY':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
};

const SummaryRow = ({icon, color, label, value, isLast}) => (
  <View
    style={[
      styles.row,
      !isLast && styles.rowBorder,
    ]}>
    <View style={styles.left}>
      <Ionicons
        name={icon}
        size={20}
        color={color}
      />

      <Text style={styles.label}>
        {label}
      </Text>
    </View>

    <Text style={styles.value}>
      {value}
    </Text>
  </View>
);

const DailySummaryCard = ({summary}) => {
  if (!summary) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="stats-chart-outline"
            size={22}
            color="#3558B5"
          />

          <Text style={styles.title}>
            Daily Summary
          </Text>
        </View>
      </View>

      <SummaryRow
        icon="calendar-outline"
        color="#3558B5"
        label="Slots Booked"
        value={summary.slotsBooked}
      />

      <SummaryRow
        icon="checkmark-circle-outline"
        color="#22C55E"
        label="Slots Completed"
        value={summary.slotsCompleted}
      />

      <SummaryRow
        icon="exit-outline"
        color="#F59E0B"
        label="Left Early"
        value={summary.leftEarly}
      />

      <SummaryRow
        icon="cube-outline"
        color="#16A34A"
        label="Orders Delivered"
        value={summary.ordersCompleted}
      />

      <SummaryRow
        icon="close-circle-outline"
        color="#EF4444"
        label="Rejected Orders"
        value={summary.ordersRejected}
      />

      <SummaryRow
        icon="time-outline"
        color="#3558B5"
        label="Total Online Time"
        value={summary.totalOnlineTime}
        isLast
      />

      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: `${getAttendanceColor(
              summary.attendanceStatus,
            )}18`,
          },
        ]}>
        <Text style={styles.statusLabel}>
          Attendance Status
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                getAttendanceColor(
                  summary.attendanceStatus,
                ),
            },
          ]}>
          <Text style={styles.statusText}>
            {summary.attendanceStatus.replace(
              '_',
              ' ',
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DailySummaryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderRadius: 16,
    paddingVertical: hp(1.2),

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  header: {
    paddingHorizontal: wp(4),
    marginBottom: hp(0.6),
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    marginLeft: 8,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#111827',
  },

  row: {
    height: hp(5.6),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    marginLeft: 10,
    fontSize: responsiveFontSize(1.7),
    color: '#4B5563',
  },

  value: {
    fontSize: responsiveFontSize(1.85),
    fontWeight: '700',
    color: '#111827',
  },

  statusContainer: {
    marginTop: hp(1.2),
    marginHorizontal: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.3),
    borderRadius: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusLabel: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    color: '#166534',
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.55),
    fontWeight: '700',
  },
});