import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const getButtonColor = (time) => {
  if (time > 15) return '#16a34a';
  if (time > 7) return '#f59e0b';
  return '#ef4444';
};

const OrderCard = ({
  distance,
  price,
  items,
  pickup,
  drop,
  timeLeft,
  onAccept, // ✅ new
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.distance}>{distance}</Text>
          <View style={styles.itemsBadge}>
            <Text style={styles.itemsText}>{items} items</Text>
          </View>
        </View>

        <Text style={styles.price}>₹{price}</Text>
      </View>

      <View style={styles.locationRow}>
        <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
        <Text style={styles.locationText}>{pickup}</Text>
      </View>

      <View style={styles.locationRow}>
        <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
        <Text style={styles.locationText}>{drop}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.acceptButton,
          { backgroundColor: getButtonColor(timeLeft) },
        ]}
        disabled={timeLeft === 0}
        activeOpacity={0.85}
        onPress={onAccept}   // ✅ hook added
      >
        <Text style={styles.acceptText}>
          {timeLeft > 0 ? `Accept in ${timeLeft}` : 'Expired'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: wp("4%"),
    padding: wp("4%"),
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  distance: {
    fontSize: wp("4.5%"),
    fontWeight: '700',
  },

  itemsBadge: {
    backgroundColor: '#e0f2fe',
    borderRadius: wp("6%"),
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.6%"),
    marginTop: hp("0.8%"),
  },

  itemsText: {
    fontSize: wp("3%"),
    color: '#0369a1',
    fontWeight: '600',
  },

  price: {
    fontSize: wp("5.5%"),
    fontWeight: '800',
    color: '#16a34a',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp("1.5%"),
  },

  dot: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.25%"),
    marginRight: wp("2%"),
  },

  locationText: {
    fontSize: wp("3.6%"),
    fontWeight: '500',
  },

  acceptButton: {
    marginTop: hp("2%"),
    borderRadius: hp("3%"),
    paddingVertical: hp("1.5%"),
    alignItems: 'center',
  },

  acceptText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp("3.8%"),
  },
});
