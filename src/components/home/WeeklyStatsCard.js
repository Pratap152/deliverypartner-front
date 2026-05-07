import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import { formatMoney } from '../../utils/formatMoney';

const StatRow = ({ label, value }) => {

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const WeeklyStatsCard = ({ earnings, orders, hours, onPress }) => {
  const navigation = useNavigation();
  const { data } = useEarningsDashboard();
  const { weeklyTotal = 0, weeklyOrders = 0 } = data;
  return (
    <TouchableOpacity onPress={() => navigation.navigate('EarningsHistoryScreen', { mode: 'WEEK' })
    }>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>This Week</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EarningsHistoryScreen', { mode: 'WEEK' })
          }>
            <Text style={styles.link}>View Details</Text>
          </TouchableOpacity>
        </View>


        {/* Stats */}
        <StatRow label="Total Earnings" value={`₹${formatMoney(weeklyTotal)}`} />
        <StatRow label="Orders Delivered" value={weeklyOrders} />
        <StatRow label="Online Hours" value={hours} />
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#16A34A',
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
