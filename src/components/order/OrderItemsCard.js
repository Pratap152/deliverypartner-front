import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderItemsCard = ({ items = [] }) => {
  console.log("[OrderItemsCard] Received items count:", items?.length);

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Ordered Items</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={wp('10%')} color="#94A3B8" />
          <Text style={styles.emptyText}>No items found for this order</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Ordered Items</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length} {items.length === 1 ? 'Item' : 'Items'}</Text>
        </View>
      </View>

      {items.map((item, index) => {
        const name = item.itemName || item.name || 'Unknown Item';
        const qty = item.quantity || item.qty || 1;
        const imageUrl = item.image || item.itemImage;
        console.log("imageUrl", imageUrl);

        return (
          <View key={item._id || index} style={[styles.row, index === items.length - 1 && styles.lastRow]}>
            <View style={styles.left}>
              <View style={styles.imageContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.itemImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="fast-food-outline" size={wp('5%')} color="#94A3B8" />
                  </View>
                )}
              </View>
              <Text style={styles.itemName} numberOfLines={1}>{name}</Text>
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
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: hp('1.5%'),
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  header: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#1E293B',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
  },
  countText: {
    fontSize: wp('3%'),
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('3%'),
  },
  emptyText: {
    fontSize: wp('3.5%'),
    color: '#94A3B8',
    marginTop: hp('1%'),
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('3%'),
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: wp('3.8%'),
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  qtyBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    marginLeft: wp('2%'),
  },
  qtyText: {
    fontSize: wp('3.2%'),
    fontWeight: '700',
    color: '#0369A1',
  },
});

