import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const OrderEarningsCard = ({ pricing }) => {
  if (!pricing) return null;

  const { itemTotal, deliveryFee, tax, platformCommission, totalAmount } = pricing;

  const renderRow = (label, value, isBold = false) => (
    <View style={styles.row}>
      <Text style={[styles.label, isBold && styles.boldLabel]}>{label}</Text>
      <Text style={[styles.value, isBold && styles.boldValue]}>₹{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Details</Text>

      <View style={styles.content}>
        {renderRow('Item Total', itemTotal)}
        {renderRow('Delivery Fee', deliveryFee)}
        {renderRow('Tax', tax)}
        {renderRow('Platform Fee', platformCommission)}

        <View style={styles.divider} />

        {renderRow('Total Amount', totalAmount, true)}
      </View>
    </View>
  );
};

export default memo(OrderEarningsCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#009966',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginVertical: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: 'white',
    marginBottom: hp('1.5%'),
  },
  content: {
    gap: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: wp('3.5%'),
    color: "white",
    fontWeight: '500',
  },
  value: {
    fontSize: wp('3.5%'),
    color: 'white',
    fontWeight: '600',
  },
  boldLabel: {
    color: 'white',
    fontWeight: '700',
    fontSize: wp('3.8%'),
  },
  boldValue: {
    color: 'white',
    fontWeight: '800',
    fontSize: wp('4%'),
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: hp('0.5%'),
  },
});
