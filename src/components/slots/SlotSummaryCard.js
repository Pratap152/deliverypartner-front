import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import dayjs from 'dayjs';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const SlotSummaryCard = ({summary}) => {
  if (!summary) return null;

  const attendance = Number(summary.overallAttendance || 0);

  const getAttendanceColor = () => {
    if (attendance >= 75) return '#22C55E';
    if (attendance >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.card}>
      {/* Left */}
      <View style={styles.leftSection}>
        <Text style={styles.date}>
          {dayjs(summary.date).format('DD MMMM YYYY')}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.infoText}>
            {summary.slotsBooked} Slots Booked
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.infoText}>
            Online Time: {summary.onlineTime}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="cube-outline"
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.infoText}>
            Orders Delivered: {summary.ordersCompleted}
          </Text>
        </View>
      </View>

      {/* Right */}
      <AnimatedCircularProgress
        size={wp(20)}
        width={5}
        fill={attendance}
        tintColor={getAttendanceColor()}
        backgroundColor="#5B74C7"
        rotation={0}>
        {() => (
          <View style={styles.circleContent}>
            <Text style={styles.percent}>
              {attendance}%
            </Text>

            <Text style={styles.circleText}>
              Overall
            </Text>

            <Text style={styles.circleText}>
              Attendance
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default SlotSummaryCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    backgroundColor: '#3558B5',
    borderRadius: 14,
    padding: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  leftSection: {
    flex: 1,
    paddingRight: wp(3),
  },

  date: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.05),
    fontWeight: '700',
    marginBottom: hp(1.2),
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },

  infoText: {
    color: '#FFFFFF',
    marginLeft: wp(2),
    fontSize: responsiveFontSize(1.65),
    fontWeight: '500',
  },

  circleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  percent: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: responsiveFontSize(2.15),
  },

  circleText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.1),
    lineHeight: 14,
    textAlign: 'center',
  },
});