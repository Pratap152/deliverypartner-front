import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Image, Text, TouchableOpacity, ActivityIndicator, Alert, BackHandler } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { orderService } from '../../services/order/OrderService';
import { getDistance } from 'geolib';

// Using the API Key provided in your snippet or fallback to env
const GOOGLE_MAPS_API_KEY = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";
const DISTANCE_THRESHOLD = 30; // meters for rerouting

const MapScreen = ({ route, navigation }) => {
  const { orderId, type, orderDetails: passedOrderDetails } = route.params;

  // --- STATE ---
  const [orderDetails, setOrderDetails] = useState(passedOrderDetails || null);
  const [loading, setLoading] = useState(!passedOrderDetails);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [lastRouteOrigin, setLastRouteOrigin] = useState(null);

  // --- REFS ---
  const watchId = useRef(null);
  const mapRef = useRef(null);
  const lastRouteOriginRef = useRef(null);

  // --- PREVENT BACK NAVIGATION ---
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    navigation.setOptions({ gestureEnabled: false });
    return () => backHandler.remove();
  }, [navigation]);

  // --- FETCH ORDER DETAILS ---
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

  // --- CALCULATE TARGET ---
  const isPickup = type === 'pickupOrder' || type === 'navigateToPickup';
  const targetLocation = useMemo(() => {
    if (!orderDetails) return null;
    const addr = isPickup ? orderDetails.pickupAddress : orderDetails.deliveryAddress;
    
    // Ensure coordinates are numbers
    const lat = parseFloat(addr?.lat);
    const lng = parseFloat(addr?.lng);

    if (isNaN(lat) || isNaN(lng)) {
      console.warn('[MapScreen] Invalid target coordinates:', addr);
      return null;
    }

    return { latitude: lat, longitude: lng };
  }, [orderDetails, isPickup]);

  // --- PERMISSIONS & TRACKING ---
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for navigation.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getInitialPosition = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const initialLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('[MapScreen] Initial Position:', initialLoc);
        setCurrentLocation(initialLoc);
        setLastRouteOrigin(initialLoc);
        lastRouteOriginRef.current = initialLoc;
        
        if (targetLocation && mapRef.current) {
          mapRef.current.fitToCoordinates([initialLoc, targetLocation], {
            edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
            animated: true,
          });
        }
      },
      error => console.log('[MapScreen] Initial Location Error:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const startLocationWatch = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    watchId.current = Geolocation.watchPosition(
      position => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const heading = position.coords.heading || 0;

        setCurrentLocation(newLocation);
        setCurrentHeading(heading);

        if (targetLocation) {
          const dist = getDistance(newLocation, targetLocation);
          setDistanceToTarget(dist);
        }

        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: newLocation,
            zoom: 17,
            pitch: 45,
            heading: heading,
          }, { duration: 1000 });
        }

        const routeOrigin = lastRouteOriginRef.current;
        if (routeOrigin) {
          const distanceMoved = getDistance(routeOrigin, newLocation);
          if (distanceMoved >= DISTANCE_THRESHOLD) {
            setLastRouteOrigin(newLocation);
            lastRouteOriginRef.current = newLocation;
          }
        }
      },
      error => console.log('[MapScreen] Watch Error:', error),
      { enableHighAccuracy: true, distanceFilter: 5, interval: 2000 }
    );
  };

  useEffect(() => {
    getInitialPosition();
    startLocationWatch();
    return () => {
      if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
    };
  }, [targetLocation]);

  // --- ACTION HANDLER ---
  const handleArrival = async () => {
    try {
      setButtonLoading(true);
      if (isPickup) {
        await orderService.pickupOrder(orderId);
        navigation.replace('OrderDetailsScreen', { orderId });
      } else {
        navigation.replace('OrderDetailsScreen', { orderId, status: 'EN_ROUTE_TO_DROP' });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setButtonLoading(false);
    }
  };

  // --- UI RENDER ---
  if (loading || !orderDetails) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C4B4" />
      </View>
    );
  }

  const targetName = isPickup ? orderDetails.vendorShopName : orderDetails.deliveryAddress.name;
  const targetAddress = isPickup ? orderDetails.pickupAddress.addressLine : orderDetails.deliveryAddress.addressLine;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || 17.3850,
          longitude: currentLocation?.longitude || 78.4866,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        followsUserLocation={false}
      >
        {/* TARGET MARKER (Pickup/Drop) */}
        {targetLocation && (
          <Marker 
            coordinate={targetLocation} 
            title={isPickup ? "Pickup Location" : "Drop Location"}
            zIndex={2}
          >
            <View style={styles.targetMarkerContainer}>
              <Text style={{ fontSize: 32 }}>{isPickup ? '🏪' : '🏠'}</Text>
            </View>
          </Marker>
        )}

        {/* RIDER MARKER (Real-time Animated) */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={currentHeading}
            flat={true}
            zIndex={3}
          >
            <Image
              source={require('../../assets/Bike.png')}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </Marker>
        )}

        {/* DYNAMIC ROUTE POLYLINE */}
        {currentLocation && targetLocation && (
          <MapViewDirections
            origin={lastRouteOrigin || currentLocation}
            destination={targetLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="#1E90FF"
            optimizeWaypoints={true}
            onError={(errorMessage) => {
              console.log('[MapScreen] Directions Error:', errorMessage);
            }}
            onReady={(result) => {
              console.log('[MapScreen] Route ready. Duration:', result.duration, 'Distance:', result.distance);
            }}
          />
        )}
      </MapView>

      {/* TOP OVERLAY - DISTANCE BADGE */}
      <View style={styles.topOverlay}>
        <Text style={styles.distanceBadge}>
          {distanceToTarget ? `${(distanceToTarget / 1000).toFixed(2)} km away` : "Calculating..."}
        </Text>
      </View>


      {/* BOTTOM ACTION CARD */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandle} />
        
        <View style={styles.locationRow}>
          <View style={styles.iconCircle}>
             <Text style={{ fontSize: 24 }}>{isPickup ? '🏪' : '🏠'}</Text>
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.locationTitle}>{targetName}</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>{targetAddress}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, buttonLoading && styles.actionButtonDisabled]}
          onPress={handleArrival}
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <ActivityIndicator color="#fff" />
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
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  distanceBadge: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0.1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  targetMarkerContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00C4B4',
  }
});