import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const OrderEarningsCard = ({ basePay, distancePay, bonus }) => {
  const total = basePay + distancePay + bonus;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Earnings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Base pay</Text>
        <Text style={styles.value}>₹{basePay}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Distance pay</Text>
        <Text style={styles.value}>₹{distancePay}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Surge/peak bonus</Text>
        <Text style={styles.value}>₹{bonus}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalValue}>₹{total}</Text>
      </View>
    </View>
  );
};

export default memo(OrderEarningsCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00B26F',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    marginTop:hp('1.5%')
  },
  title: {
    color: '#FFFFFF',
    fontSize: wp('3.6%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.6%'),
    padding: wp('1.5%'),
  },
  label: {
    color: '#FFFFFF',
    fontSize: wp('3.2%'),
  },
  value: {
    color: '#FFFFFF',
    fontSize: wp('3.2%'),
    fontWeight: '600',
  },
  divider: {
    height: hp('0.15%'),
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: hp('1.2%'),
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: wp('3.6%'),
    fontWeight: '600',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },
});
