// import React, { useRef, useState, useEffect, useMemo } from 'react';
// import { View, StyleSheet, Platform, Linking, ActivityIndicator, Alert, Text } from 'react-native';
// import { AnimatedRegion } from 'react-native-maps';
// import Geolocation from "@react-native-community/geolocation";

// import LiveMap from '../../components/map/LiveMap';
// import EtaBanner from '../../components/map/EtaBanner';
// import SwipeButton from '../../components/common/SwipeButton';

// // import { useRiderSocket } from '../../hooks/useRiderSocket';
// // import { useLocation } from '../../hooks/useLocation'; 
// // Replaced custom hooks with direct implementation for stability in this task
// import { orderUIConfig } from '../../config/orderUIConfig';

// import { ORDER_STATUS } from '../../config/orderStates';
// import { orderService } from '../../services/order/OrderService';
// import { getDistance } from '../../utils/mapUtils';
// import { GOOGLE_MAPS_API_KEY } from '../../config/env';

// const MapScreen = ({ route, navigation }) => {
//   const { orderId, nextStatus, orderDetails: passedOrderDetails } = route.params;

//   /* ---------------- STATE ---------------- */
//   const [orderDetails, setOrderDetails] = useState(passedOrderDetails || null);
//   const [loading, setLoading] = useState(!passedOrderDetails);
//   const [riderLocation, setRiderLocation] = useState(null);
//   const [distanceToTarget, setDistanceToTarget] = useState(null);

//   const mapRef = useRef(null);

//   // Fetch Order Details only if not provided
//   useEffect(() => {
//     if (passedOrderDetails) {
//       return; // Already have order details
//     }

//     const fetchOrder = async () => {
//       try {
//         const data = await orderService.getOrderDetails(orderId);
//         setOrderDetails(data);
//       } catch (err) {
//         Alert.alert("Error", "Failed to fetch order details");
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId, passedOrderDetails]);

//   /* ---------------- TARGET LOGIC ---------------- */
//   const isPickup = nextStatus === ORDER_STATUS.AT_RESTAURANT;
//   const isDrop = nextStatus === ORDER_STATUS.QR_SCAN_REQUIRED || nextStatus === ORDER_STATUS.AT_DROP;

//   const targetLocation = useMemo(() => {
//     if (!orderDetails) return null;
//     return isPickup
//       ? { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng }
//       : { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };
//   }, [orderDetails, isPickup]);

//   /* ---------------- LOCATION TRACKING ---------------- */
//   useEffect(() => {
//     const watchId = Geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setRiderLocation({ latitude, longitude });

//         if (targetLocation) {
//           const dist = getDistance({ latitude, longitude }, targetLocation);
//           setDistanceToTarget(dist);
//         }
//       },
//       (error) => console.log(error),
//       { enableHighAccuracy: true, distanceFilter: 10 }
//     );
//     return () => Geolocation.clearWatch(watchId);
//   }, [targetLocation]);

//   const handleArrival = async () => {
//     // Distance Check: 10m (using 150km for testing as established)
//     const MAX_DISTANCE = 150000;
//     if (distanceToTarget && distanceToTarget > MAX_DISTANCE) {
//       Alert.alert("Too Far", `You are ${(distanceToTarget).toFixed(0)}m away. Reach within 10m.`);
//       return;
//     }

//     try {
//       // Update order status
//       await orderService.updateOrderStatus(orderId, nextStatus);

//       // Navigate back to OrderDetailsScreen with updated status
//       navigation.navigate('OrderDetailsScreen', {
//         orderId,
//         status: nextStatus
//       });
//     } catch (err) {
//       console.error('Arrival error:', err);
//       Alert.alert("Error", "Failed to update status");
//     }
//   };

//   /* ---------------- UI ---------------- */
//   if (loading || !orderDetails) {
//     return <View style={styles.center}><ActivityIndicator size="large" color="#00C4B4" /></View>;
//   }

//   const targetName = isPickup ? orderDetails.vendorShopName : orderDetails.deliveryAddress.name;
//   const targetAddress = isPickup ? orderDetails.pickupAddress.addressLine : orderDetails.deliveryAddress.addressLine;

//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <LiveMap
//           ref={mapRef}
//           riderPosition={riderLocation}
//           pickup={isPickup ? targetLocation : null}
//           drop={!isPickup ? targetLocation : null}
//         // Route handled by LiveMap via MapViewDirections
//         />

//         {/* Helper Button to Open Google Maps */}
//         <View style={styles.topOverlay}>
//           <Text style={styles.distanceBadge}>
//             {distanceToTarget ? `${(distanceToTarget / 1000).toFixed(2)} km` : "..."}
//           </Text>
//         </View>
//       </View>

//       {/* BOTTOM CARD */}
//       <View style={styles.bottomCard}>
//         {/* Drag Handle */}
//         <View style={styles.dragHandle} />

//         <View style={styles.locationRow}>
//           <View style={styles.iconCircle}>
//             <Text style={{ fontSize: 20 }}>{isPickup ? '🏪' : '🏠'}</Text>
//           </View>
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.locationTitle}>{targetName}</Text>
//             <Text style={styles.locationAddress} numberOfLines={2}>{targetAddress}</Text>
//           </View>
//         </View>

//         <View style={{ marginTop: 20 }}>
//           <SwipeButton
//             title={isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
//             onSwipeSuccess={handleArrival}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   mapContainer: {
//     flex: 1,
//   },
//   topOverlay: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     backgroundColor: '#fff',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5
//   },
//   distanceBadge: {
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   bottomCard: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     padding: 20,
//     paddingBottom: 30,
//     elevation: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   dragHandle: {
//     width: 40,
//     height: 5,
//     backgroundColor: '#ccc',
//     borderRadius: 2.5,
//     alignSelf: 'center',
//     marginBottom: 20
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   locationTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4
//   },
//   locationAddress: {
//     fontSize: 14,
//     color: '#777'
//   }
// });
// screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Text, 
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ORDER_STATUS } from '../../config/orderStates';
import { orderService } from '../../services/order/OrderService';
import LiveMap from '../../components/map/LiveMap';
import SwipeButton from '../../components/common/SwipeButton';
import { updateOrderStatus } from '../../redux/orders/orderSlice';

const MapScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // const activeOrder = useSelector(state => state.orders.activeOrder);
  
  const { 
    orderId, 
    nextStatus, 
    destinationType = 'pickup'
  } = route.params || {};

  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState(null);
  const [destination, setDestination] = useState(null);

  // Set destination
  useEffect(() => {
    const getDestination = () => {
      if (destinationType === 'pickup') {
        return {
          latitude: 17.4300,
          longitude: 78.3895,
          name: "Burger King",
          address: "123 Restaurant Street, Madhapur",
          type: 'pickup'
        };
      } else {
        return {
          latitude: 19.1015,
          longitude: 72.8743,
          name: "John Doe",
          address: "456 Customer Avenue, Mumbai",
          type: 'drop'
        };
      }
    };

    setDestination(getDestination());
  }, [destinationType]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (isTracking) {
        Alert.alert(
          "Stop Navigation?",
          "Are you sure you want to stop navigation?",
          [
            { text: "No", style: "cancel" },
            { 
              text: "Yes", 
              onPress: () => {
                setIsTracking(false);
                navigation.goBack();
              }
            }
          ]
        );
        return true;
      }
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isTracking, navigation]);

  // Handle start tracking
  const handleStartTracking = () => {
    setIsTracking(true);
    Alert.alert(
      "Navigation Started",
      "Live tracking is now active. Your route is being calculated.",
      [{ text: 'OK' }]
    );
  };

  // Handle stop tracking
  const handleStopTracking = () => {
    Alert.alert(
      "Stop Navigation?",
      "Do you want to stop live tracking?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Stop", 
          onPress: () => {
            setIsTracking(false);
            Alert.alert("Navigation Stopped", "Live tracking has been paused.");
          }
        }
      ]
    );
  };

  // Handle arrival confirmation
  const handleArrival = async () => {
    try {
      setIsLoading(true);

      if (!orderId || !nextStatus) {
        Alert.alert('Error', 'Missing order information');
        setIsLoading(false);
        return;
      }

      // Update order status
      const result = await orderService.updateOrderStatus(orderId, nextStatus);
      
      if (result.success) {
        // Update Redux
        dispatch(updateOrderStatus(nextStatus));
        
        Alert.alert(
          'Success!',
          destinationType === 'pickup' 
            ? 'You have arrived at the restaurant'
            : 'You have arrived at the drop location',
          [
            {
              text: 'Continue',
              onPress: () => {
                setIsTracking(false);
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update status');
      }

    } catch (err) {
      console.log('Arrival error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!destination) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C4B4" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {destinationType === 'pickup' ? 'Navigate to Restaurant' : 'Navigate to Customer'}
          </Text>
          <Text style={styles.headerSubtitle}>{destination.name}</Text>
        </View>
        
        <View style={styles.headerRight}>
          {isTracking && (
            <View style={styles.trackingIndicator}>
              <View style={styles.trackingDot} />
              <Text style={styles.trackingText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>

      {/* Full Screen Map */}
      <View style={styles.mapContainer}>
        <LiveMap 
          pickup={destinationType === 'pickup' ? destination : null}
          drop={destinationType === 'drop' ? destination : null}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          isTracking={isTracking}
        />
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Stop Navigation Button (when tracking) */}
        {isTracking && (
          <TouchableOpacity 
            style={styles.stopButton}
            onPress={handleStopTracking}
            disabled={isLoading}
          >
            <Icon name="stop" size={20} color="white" />
            <Text style={styles.stopButtonText}>STOP NAVIGATION</Text>
          </TouchableOpacity>
        )}

        {/* Destination Info Card */}
        <View style={styles.destinationCard}>
          <View style={styles.destinationIcon}>
            <Icon 
              name={destination.type === 'pickup' ? 'restaurant' : 'home'} 
              size={24} 
              color={destination.type === 'pickup' ? '#4CAF50' : '#FF5252'} 
            />
          </View>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>{destination.name}</Text>
            <Text style={styles.destinationAddress} numberOfLines={2}>
              {destination.address}
            </Text>
          </View>
        </View>

        {/* Swipe to Confirm Arrival */}
        {isTracking && (
          <View style={styles.swipeContainer}>
            <SwipeButton
              title={
                destinationType === 'pickup'
                  ? 'Swipe to Confirm Arrival at Restaurant'
                  : 'Swipe to Confirm Arrival at Customer'
              }
              onSwipeSuccess={handleArrival}
              disabled={isLoading}
              backgroundColor="#00C4B4"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  trackingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  destinationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 14,
    color: '#666',
  },
  swipeContainer: {
    marginTop: 8,
  },
});
