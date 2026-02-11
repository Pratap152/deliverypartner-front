import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderService } from '../../services/order/OrderService';

// SwipeButton removed - using normal button now
import LiveMap from '../../components/map/LiveMap';

const MapScreen = ({ route, navigation }) => {
  const { nextStatus, orderId } = route.params;
  console.log("orderId from  MapScreen", orderId);
  
  const [buttonLoading, setButtonLoading] = useState(false);

  const isPickup = nextStatus === ORDER_STATUS.AT_RESTAURANT;
  const isDrop = nextStatus === ORDER_STATUS.QR_SCAN_REQUIRED || nextStatus === ORDER_STATUS.AT_DROP;

  const handleArrival = async () => {
    try {
      setButtonLoading(true);
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
    } finally {
      setButtonLoading(false);
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

      {/* Button to Confirm Arrival */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, buttonLoading && styles.actionButtonDisabled]}
          onPress={handleArrival}
          disabled={buttonLoading}
          activeOpacity={0.8}
        >
          {buttonLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.actionButtonText}>Loading...</Text>
            </>
          ) : (
            <Text style={styles.actionButtonText}>
              {isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: hp('2.2%'),
    borderRadius: wp('14%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
    shadowOpacity: 0.15,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

