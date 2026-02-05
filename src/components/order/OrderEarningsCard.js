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
  console.log('[OrderEarningsCard] Received items:', JSON.stringify(items));

  if (!pricing) {
    console.log('[OrderEarningsCard] No pricing data');
    return null;
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
        {/* Item-wise breakdown with Name, Qty, Individual Price */}
        {items && items.length > 0 && (
          <View style={styles.itemsSection}>
            <Text style={styles.itemsSectionHeader}>Items Ordered</Text>
            {items.map((item, index) => {
              // Support multiple naming conventions
              const name = item.name || item.itemName || 'Item';
              const qty = item.qty || item.quantity || 1;
              const unitPrice = item.price || item.itemPrice || item.unitPrice || 0;
              const lineTotal = qty * unitPrice;

              console.log(`[OrderEarningsCard] Item ${index}:`, { name, qty, unitPrice, lineTotal });

              return (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{name}</Text>
                    <Text style={styles.itemMeta}>
                      {qty} × ₹{parseFloat(unitPrice).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>₹{lineTotal.toFixed(2)}</Text>
                </View>
              );
            })}
            <View style={styles.lightDivider} />
          </View>
        )}

        {renderRow('Item Total', itemTotal)}
        {renderRow('Delivery Fee', deliveryFee)}
        {tax > 0 && renderRow('Tax & Charges', tax)}
        {platformFee > 0 && renderRow('Platform Fee', platformFee, false, true)}

        <View style={styles.divider} />

        {renderRow('Total Amount', total, true)}
      </View>
    </View>
  );
};

export default memo(OrderEarningsCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#009966',
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    marginVertical: hp('1.5%'),
    shadowColor: '#00B26F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#00B26F',
  },
  header: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
    letterSpacing: 0.5,
  },
  content: {
    gap: hp('0.8%'),
  },
  itemsSection: {
    marginBottom: hp('1%'),
  },
  itemsSectionHeader: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: hp('1%'),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
    paddingVertical: hp('0.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: wp('2%'),
    borderRadius: wp('2%'),
  },
  itemInfo: {
    flex: 1,
    marginRight: wp('2%'),
  },
  itemName: {
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
    fontWeight: '500',
  },
  itemMeta: {
    fontSize: wp('2.8%'),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: hp('0.2%'),
  },
  itemValue: {
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lightDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('0.3%'),
  },
  label: {
    fontSize: wp('3.6%'),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  value: {
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  boldLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp('4%'),
  },
  boldValue: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: wp('4.5%'),
  },
  negativeValue: {
    color: '#FFCDD2',  // Light red for deductions
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: hp('1%'),
  },
});
