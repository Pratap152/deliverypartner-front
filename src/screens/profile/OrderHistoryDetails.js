import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
 
const OrderHistoryDetails = ({ navigation, route }) => {
  const { order } = route.params;
 
  return (
<SafeAreaView style={styles.container}>
      {/* Header */}
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
</TouchableOpacity>
 
        <View>
<Text style={styles.headerTitle}>
            Order History
</Text>
<Text style={styles.orderIdText}>
            Order ID : #{order?.orderId}
</Text>
</View>
 
        <TouchableOpacity>
<Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color="#06B6D4"
          />
</TouchableOpacity>
</View>
 
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: rh(3),
        }}>
 
        {/* Order Summary Card */}
<View style={styles.orderCard}>
<View style={styles.topRow}>
<View style={styles.avatar} />
 
            <View style={styles.detailsContainer}>
<Text style={styles.restaurantName}>
                {order?.vendorShopName || 'Pizza Place'}
</Text>
 
              <Text style={styles.customerName}>
                {order?.userName || 'Amit Sharma'}
</Text>
 
              <Text style={styles.addressText}>
                {order?.deliveredAddress ||
                  'Andheri, West Mumbai'}
</Text>
</View>
 
            <View style={styles.amountContainer}>
<Text style={styles.amountText}>
                ₹{order?.earning || 105}
</Text>
 
              <Text style={styles.earnedText}>
                EARNED
</Text>
</View>
</View>
 
          <View style={styles.ratingContainer}>
<Ionicons
              name="star"
              size={15}
              color="#F59E0B"
            />
<Text style={styles.ratingText}>
              {order?.rating || '4.8'}
</Text>
</View>
 
          <View style={styles.dateTimeRow}>
<View style={styles.chip}>
<Ionicons
                name="calendar-outline"
                size={14}
                color="#22C55E"
              />
 
              <Text style={styles.chipText}>
                {order?.date || '12-06-2026'}
</Text>
</View>
 
            <View style={styles.chip}>
<Ionicons
                name="time-outline"
                size={14}
                color="#22C55E"
              />
 
              <Text style={styles.chipText}>
                {order?.time || '01:30 PM'}
</Text>
</View>
</View>
</View>
 
        {/* Earnings Breakdown */}
<Text style={styles.sectionHeading}>
          Earnings Breakdown :
</Text>
 
        <View style={styles.card}>
<InfoRow
            label="Base Fare"
            value={`₹${order?.baseFare || 70}`}
          />
 
          <InfoRow
            label="Distance Fare"
            value={`₹${order?.distanceFare || 15}`}
          />
 
          <InfoRow
            label="Surge"
            value={`₹${order?.surge || 0}`}
            valueStyle={{
              color: '#EF4444',
            }}
          />
 
          <InfoRow
            label="Customer Tip"
            value={`+₹${order?.tip || 20}`}
            valueStyle={{
              color: '#22C55E',
            }}
          />
 
          <View style={styles.divider} />
 
          <InfoRow
            label="Total Amount"
            value={`₹${order?.earning || 105}`}
            valueStyle={{
              color: '#22C55E',
              fontWeight: '700',
              fontSize: rf(2),
            }}
          />
</View>
 
        {/* Order Information */}
<Text style={styles.sectionHeading}>
          Order Information :
</Text>
 
        <View style={styles.card}>
<InfoRow
            label="Order ID"
            value={`#${order?.orderId || 1}`}
          />
 
          <InfoRow
            label="Distance Travelled"
            value={`${order?.distance || 3.2} km`}
          />
 
          <InfoRow
            label="Payment Status"
            value="Credited"
            valueStyle={{
              color: '#22C55E',
            }}
          />
 
          <InfoRow
            label="Order Status"
            value="Delivered"
          />
 
          <InfoRow
            label="Credited on"
            value={`${order?.date || '12-06-26'} ${order?.time || '01:30 PM'}`}
          />
</View>
</ScrollView>
</SafeAreaView>
  );
};
 
const InfoRow = ({
  label,
  value,
  valueStyle,
}) => {
  return (
<View style={styles.infoRow}>
<Text style={styles.infoLabel}>
        {label}
</Text>
 
      <Text
        style={[
          styles.infoValue,
          valueStyle,
        ]}>
        {value}
</Text>
</View>
  );
};
 
export default OrderHistoryDetails;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: rw(4),
  },
 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: rh(1.5),
  },
 
  headerTitle: {
    fontSize: rf(2.2),
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
 
  orderIdText: {
    fontSize: rf(1.3),
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
 
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: rw(4),
    marginTop: rh(1),
    marginBottom: rh(2),
  },
 
  topRow: {
    flexDirection: 'row',
  },
 
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F4E4DD',
    marginRight: 12,
  },
 
  detailsContainer: {
    flex: 1,
  },
 
  restaurantName: {
    fontSize: rf(1.7),
    fontWeight: '600',
    color: '#111827',
  },
 
  customerName: {
    fontSize: rf(1.55),
    fontWeight: '600',
    color: '#111827',
    marginTop: 6,
  },
 
  addressText: {
    fontSize: rf(1.35),
    color: '#6B7280',
    marginTop: 2,
  },
 
  amountContainer: {
    alignItems: 'flex-end',
  },
 
  amountText: {
    color: '#22C55E',
    fontSize: rf(2),
    fontWeight: '700',
  },
 
  earnedText: {
    color: '#22C55E',
    fontSize: rf(1.2),
    fontWeight: '700',
  },
 
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: rh(0.8),
  },
 
  ratingText: {
    marginLeft: 4,
    color: '#111827',
    fontWeight: '600',
    fontSize: rf(1.4),
  },
 
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rh(1.5),
  },
 
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '48%',
  },
 
  chipText: {
    marginLeft: 6,
    fontSize: rf(1.35),
    color: '#111827',
  },
 
  sectionHeading: {
    fontSize: rf(1.55),
    color: '#374151',
    marginBottom: rh(1),
    marginLeft: 2,
  },
 
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: rw(4),
    marginBottom: rh(2),
  },
 
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: rh(0.7),
  },
 
  infoLabel: {
    color: '#6B7280',
    fontSize: rf(1.4),
  },
 
  infoValue: {
    color: '#111827',
    fontSize: rf(1.4),
    fontWeight: '600',
  },
 
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: rh(1),
  },
});