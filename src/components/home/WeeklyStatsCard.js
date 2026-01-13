import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const StatRow = ({ label, value, percent }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.percent}>+{percent}%</Text>
      </View>
    </View>
  );
};

const WeeklyStatsCard = ({ earnings, orders, hours, onPress }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.link}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <StatRow label="Total Earnings" value={10} percent={12} />
      <StatRow label="Orders Delivered" value={orders} percent={8} />
      <StatRow label="Online Hours" value={hours} percent={5} />
    </View>
  );
};

export default memo(WeeklyStatsCard);
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D9FDE6',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginTop: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#22C55E',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp('3%'),
  },

  title: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#16A34A',
  },

  link: {
    fontSize: wp('3.2%'),
    color: 'white',
    fontWeight: '600',
    backgroundColor:'#16A34A',
    paddingVertical: wp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp('2.8%'),
  },

  label: {
    fontSize: wp('3.4%'),
    color: '#065F46',
    fontWeight: '500',
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  value: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#022C22',
  },

  percent: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: '#16A34A',
    marginLeft: wp('1.5%'),
  },
});
