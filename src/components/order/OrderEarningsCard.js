import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * OrderEarningsCard - Displays items with quantity, individual price, and total bill
 * @param {Object} pricing - Pricing object with itemTotal, deliveryFee, tax, platformCommission, totalAmount
 * @param {Array} items - Items array with { itemName, quantity, price/itemPrice }
 */
const OrderEarningsCard = ({ pricing, items }) => {
  console.log('[OrderEarningsCard] Received pricing:', JSON.stringify(pricing));

  if (!pricing || Object.keys(pricing).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Bill Details</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Pricing information unavailable</Text>
        </View>
      </View>
    );
  }

  // Extract values with fallbacks
  const itemTotal = pricing.itemTotal || pricing.basePay || 0;
  const deliveryFee = pricing.deliveryFee || pricing.distancePay || 0;
  const tax = pricing.tax || 0;
  const platformFee = pricing.platformCommission || pricing.platformFee || 0;
  const total = pricing.totalAmount || pricing.total || (itemTotal + deliveryFee + tax - platformFee);

  const renderRow = (label, value, isBold = false, isNegative = false) => (
    <View style={styles.row}>
      <Text style={[styles.label, isBold && styles.boldLabel]}>{label}</Text>
      <Text style={[
        styles.value,
        isBold && styles.boldValue,
        isNegative && styles.negativeValue
      ]}>
        {isNegative ? '-' : ''}₹{Math.abs(parseFloat(value || 0)).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Details</Text>
      <View style={styles.content}>
        {renderRow('Total Amount', total, true)}
      </View>
    </View>
  );
};

export default memo(OrderEarningsCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4.5%'),
    marginVertical: hp('2%'),
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  header: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#065F46',
    marginBottom: hp('2%'),
    fontFamily: 'System',
    paddingBottom: hp('1%'),
    borderBottomWidth: 2,
    borderBottomColor: '#D1FAE5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
  },
  emptyText: {
    fontSize: wp('3.8%'),
    color: '#94A3B8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1FAE5',
    marginVertical: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
    paddingVertical: hp('0.6%'),
    paddingHorizontal: wp('1%'),
    borderRadius: wp('2%'),
  },
  label: {
    fontSize: wp('3.6%'),
    color: '#4B5563',
    fontWeight: '500',
    fontFamily: 'System',
  },
  value: {
    fontSize: wp('3.6%'),
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: 'System',
  },
  boldLabel: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: wp('4%'),
  },
  boldValue: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: wp('4.2%'),
  },
  negativeValue: {
    color: '#EF4444',
    fontWeight: '600',
  },
});