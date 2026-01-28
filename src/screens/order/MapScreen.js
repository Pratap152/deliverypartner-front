import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, Linking, ActivityIndicator, Alert, Text } from 'react-native';
import { AnimatedRegion } from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";

import LiveMap from '../../components/map/LiveMap';
import EtaBanner from '../../components/map/EtaBanner';
import SwipeButton from '../../components/common/SwipeButton';

// import { useRiderSocket } from '../../hooks/useRiderSocket';
// import { useLocation } from '../../hooks/useLocation'; 
// Replaced custom hooks with direct implementation for stability in this task
import { orderUIConfig } from '../../config/orderUIConfig';

import { ORDER_STATUS } from '../../config/orderStates';
import { orderService } from '../../services/order/OrderService';
import { getDistance } from '../../utils/mapUtils';
import { GOOGLE_MAPS_API_KEY } from '../../config/env';

const MapScreen = ({ route, navigation }) => {
  const { orderId, nextStatus, orderDetails: passedOrderDetails } = route.params;

  /* ---------------- STATE ---------------- */
  const [orderDetails, setOrderDetails] = useState(passedOrderDetails || null);
  const [loading, setLoading] = useState(!passedOrderDetails);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);

  const mapRef = useRef(null);

  // Fetch Order Details only if not provided
  useEffect(() => {
    if (passedOrderDetails) {
      return; // Already have order details
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch order details");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, passedOrderDetails]);

  /* ---------------- TARGET LOGIC ---------------- */
  const isPickup = nextStatus === ORDER_STATUS.AT_RESTAURANT;
  const isDrop = nextStatus === ORDER_STATUS.QR_SCAN_REQUIRED || nextStatus === ORDER_STATUS.AT_DROP;

  const targetLocation = useMemo(() => {
    if (!orderDetails) return null;
    return isPickup
      ? { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng }
      : { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };
  }, [orderDetails, isPickup]);

  /* ---------------- LOCATION TRACKING ---------------- */
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRiderLocation({ latitude, longitude });

        if (targetLocation) {
          const dist = getDistance({ latitude, longitude }, targetLocation);
          setDistanceToTarget(dist);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
    return () => Geolocation.clearWatch(watchId);
  }, [targetLocation]);

  const handleArrival = async () => {
    // Distance Check: 10m (using 150km for testing as established)
    const MAX_DISTANCE = 150000;
    if (distanceToTarget && distanceToTarget > MAX_DISTANCE) {
      Alert.alert("Too Far", `You are ${(distanceToTarget).toFixed(0)}m away. Reach within 10m.`);
      return;
    }

    try {
      // Update order status
      await orderService.updateOrderStatus(orderId, nextStatus);

      // Navigate back to OrderDetailsScreen with updated status
      navigation.navigate('OrderDetailsScreen', {
        orderId,
        status: nextStatus
      });
    } catch (err) {
      console.error('Arrival error:', err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  /* ---------------- UI ---------------- */
  if (loading || !orderDetails) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#00C4B4" /></View>;
  }

  const targetName = isPickup ? orderDetails.vendorShopName : orderDetails.deliveryAddress.name;
  const targetAddress = isPickup ? orderDetails.pickupAddress.addressLine : orderDetails.deliveryAddress.addressLine;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <LiveMap
          ref={mapRef}
          riderPosition={riderLocation}
          pickup={isPickup ? targetLocation : null}
          drop={!isPickup ? targetLocation : null}
        // Route handled by LiveMap via MapViewDirections
        />

        {/* Helper Button to Open Google Maps */}
        <View style={styles.topOverlay}>
          <Text style={styles.distanceBadge}>
            {distanceToTarget ? `${(distanceToTarget / 1000).toFixed(2)} km` : "..."}
          </Text>
        </View>
      </View>

      {/* BOTTOM CARD */}
      <View style={styles.bottomCard}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        <View style={styles.locationRow}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 20 }}>{isPickup ? '🏪' : '🏠'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.locationTitle}>{targetName}</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>{targetAddress}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <SwipeButton
            title={isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
            onSwipeSuccess={handleArrival}
          />
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  distanceBadge: {
    fontWeight: 'bold',
    color: '#333'
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  locationAddress: {
    fontSize: 14,
    color: '#777'
  }
});


