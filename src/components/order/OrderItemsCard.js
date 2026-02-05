import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const OrderItemsCard = ({ items }) => {
  console.log("[OrderItemsCard] Received items:", JSON.stringify(items));

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Ordered Items</Text>
        <Text style={styles.emptyText}>No items to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ordered Items</Text>

      {items.map((item, index) => {
        // API returns: itemName, quantity, price, total, _id
        const name = item.itemName || item.name || 'Unknown Item';
        const qty = item.quantity || item.qty || 1;

        console.log(`[OrderItemsCard] Item ${index}:`, { name, qty });

        return (
          <View key={item._id || index} style={styles.row}>
            <View style={styles.left}>
              <Image source={require('../../assets/pizza.png')} style={styles.image} />
              <Text style={styles.itemName}>{name}</Text>
            </View>

            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x{qty}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(OrderItemsCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('3.5%'),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: hp('1.5%'),
    marginTop: 15
  },
  header: {
    fontSize: wp('4.6%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
    color: '#1C1C1C',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: wp('3.8%'),
    color: '#333333',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: wp('3.2%'),
    color: '#666666',
    marginTop: hp('0.3%'),
  },
  qtyBadge: {
    backgroundColor: '#E3F3FF',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    marginLeft: wp('2%'),
  },
  qtyText: {
    fontSize: wp('3.2%'),
    fontWeight: '700',
    color: '#007ACC',
  },
  emptyText: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
});
