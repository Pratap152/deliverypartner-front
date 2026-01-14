
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StatItem = ({ icon, value, label, bgColor }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={wp('5%')} color="#fff" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const StatsCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatItem
          icon="trending-up"
          value="₹842"
          label="Earnings"
          bgColor="#2ECC71" // green
        />
        <StatItem
          icon="time-outline"
          value="4h 23m"
          label="Online"
          bgColor="#8E7CF3" // purple
        />
        <StatItem
          icon="cart-outline"
          value="12"
          label="Orders"
          bgColor="#FF6FAE" // pink
        />
      </View>
    </View>
  );
};

export default React.memo(StatsCard);
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('2%'),
    marginTop: wp('4%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: wp('4%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  card: {
    width: wp('28%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    paddingVertical: wp('4%'),
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    // Android shadow
    elevation: 4,
  },
  iconWrapper: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('3%'),
  },
  value: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#111',
  },
  label: {
    fontSize: wp('3.2%'),
    color: '#8E8E93',
    marginTop: wp('1%'),
  },
});
