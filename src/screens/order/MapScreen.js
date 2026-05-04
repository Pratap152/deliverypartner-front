import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import Geolocation from "@react-native-community/geolocation";
import LiveMap from '../../components/map/LiveMap';
import { orderService } from '../../services/order/OrderService';
import { getDistance } from 'geolib';

const MapScreen = ({ route, navigation }) => {

  const { orderId, type, orderDetails: passedOrderDetails } = route.params;

  const [orderDetails, setOrderDetails] = useState(passedOrderDetails || null);
  const [loading, setLoading] = useState(!passedOrderDetails);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const mapRef = useRef(null);

  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    if (passedOrderDetails) return;

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
  }, [orderId]);

  /* ---------------- TARGET ---------------- */
const isPickup =
  type === 'pickupOrder' ||
  type === 'navigateToPickup';
  
  const targetLocation = useMemo(() => {
    if (!orderDetails) return null;

    return isPickup
      ? {
          latitude: orderDetails.pickupAddress.lat,
          longitude: orderDetails.pickupAddress.lng,
        }
      : {
          latitude: orderDetails.deliveryAddress.lat,
          longitude: orderDetails.deliveryAddress.lng,
        };
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

  /* ---------------- ACTION ---------------- */
  const handleArrival = async () => {
    try {
      setButtonLoading(true);

      const MAX_DISTANCE = 150000; // testing
      if (distanceToTarget && distanceToTarget > MAX_DISTANCE) {
        Alert.alert("Too Far", `You are ${(distanceToTarget).toFixed(0)}m away`);
        return;
      }

      if (type === 'pickupOrder' || type === 'navigateToPickup') {
        const res = await orderService.pickupOrder(orderId);
        console.log("Map API response (pickup):", res);
        navigation.replace('OrderDetailsScreen', { orderId });
      } 
      else if (type === 'deliverOrder' || type === 'navigateToDrop') {
        console.log("Arrived at drop location. Navigating back with UI state.");
        navigation.replace('OrderDetailsScreen', {
          orderId,
          status: 'EN_ROUTE_TO_DROP',   // ✅ FORCE correct UI state
        });
      } 
      else {
        console.log("Invalid type received:", type);
        Alert.alert("Error", "Invalid action type");
        return;
      }

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update status");
    } finally {
      setButtonLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading || !orderDetails) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C4B4" />
      </View>
    );
  }

  const targetName = isPickup
    ? orderDetails.vendorShopName
    : orderDetails.deliveryAddress.name;

  const targetAddress = isPickup
    ? orderDetails.pickupAddress.addressLine
    : orderDetails.deliveryAddress.addressLine;

  return (
    <View style={styles.container}>

      <View style={styles.mapContainer}>
        <LiveMap
          ref={mapRef}
          riderPosition={riderLocation}
          pickup={isPickup ? targetLocation : null}
          drop={!isPickup ? targetLocation : null}
        />

        <View style={styles.topOverlay}>
          <Text style={styles.distanceBadge}>
            {distanceToTarget ? `${(distanceToTarget / 1000).toFixed(2)} km` : "..."}
          </Text>
        </View>
      </View>

      {/* BOTTOM CARD */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandle} />

        <View style={styles.locationRow}>
          <Text style={{ fontSize: 20 }}>{isPickup ? '🏪' : '🏠'}</Text>

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.locationTitle}>{targetName}</Text>
            <Text style={styles.locationAddress}>{targetAddress}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, buttonLoading && styles.actionButtonDisabled]}
          onPress={handleArrival}
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <>
              <ActivityIndicator color="#fff" />
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
  },
  actionButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: 18,
    borderRadius: 50,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
 