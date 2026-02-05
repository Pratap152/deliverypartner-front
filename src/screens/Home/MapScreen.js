import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderService } from '../../services/order/OrderService';

import SwipeButton from '../../components/common/SwipeButton';
import LiveMap from '../../components/map/LiveMap';

const MapScreen = ({ route, navigation }) => {
  const { nextStatus, orderId } = route.params;
  console.log("orderId from  MapScreen", orderId);

  const isPickup = nextStatus === ORDER_STATUS.AT_RESTAURANT;
  const isDrop = nextStatus === ORDER_STATUS.QR_SCAN_REQUIRED || nextStatus === ORDER_STATUS.AT_DROP;

  const handleArrival = async () => {
    try {
      console.log('🚗 MapScreen handleArrival - orderId:', orderId, 'nextStatus:', nextStatus);

      // Always update status and navigate back to OrderDetailsScreen
      // Bypass QR scanner completely
      console.log('🚗 Updating order status to:', nextStatus, 'for orderId:', orderId);
      await orderService.updateOrderStatus(orderId, nextStatus);
      console.log('🚗 Navigating back to OrderDetailsScreen with orderId:', orderId);
      navigation.replace('OrderDetailsScreen', {
        status: nextStatus,
        orderId: orderId,
      });
    } catch (error) {
      console.error('❌ MapScreen handleArrival error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fake Map */}
      <View style={styles.mapPlaceholder}>
        {/* <Image
          source={require('../../assets/map.png')}
          style={styles.mapImage}
          resizeMode="cover"
        /> */}
        <LiveMap />
        {/* <Text style={styles.mapText}>🗺 Full Map Navigation</Text>
        <Text style={styles.etaText}>ETA: 5 mins</Text> */}
      </View>

      {/* Swipe to Confirm Arrival */}
      <SwipeButton
        title={isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
        onSwipeSuccess={handleArrival}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: wp('6%'),
    fontWeight: '700',
  },
  etaText: {
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    color: '#374151',
  },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: hp('2%'),
    margin: wp('4%'),
    borderRadius: wp('12%'),
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: wp('4%'),
    fontWeight: '700',
  },
});

