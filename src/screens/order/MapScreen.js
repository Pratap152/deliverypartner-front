// import React, { useEffect, useState, useRef, useMemo } from 'react';
// import {
//     View,
//     StyleSheet,
//     PermissionsAndroid,
//     Platform,
//     Image,
//     Text,
//     Alert,
//     ActivityIndicator,
//     TouchableOpacity,
//     Animated,
//     Easing,
//     BackHandler,
// } from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';
// import NetInfo from '@react-native-community/netinfo';
// import { VehicleMarker, StoreMarker } from '../../components/map/markers/MapMarkers';
// import { orderService } from '../../services/order/OrderService';

// // ─────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────
// const GOOGLE_MAPS_API_KEY = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";

// const FALLBACK_START_LOCATION = {
//     latitude: 17.3850,
//     longitude: 78.4866,
// };

// // ─────────────────────────────────────────────────────────────
// // CUSTOM GOOGLE MAPS STYLE (Clean / No clutter)
// // ─────────────────────────────────────────────────────────────
// const MAP_STYLE = [
//     { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
//     { elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
//     { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
//     { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
//     { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
//     { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
//     { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
//     { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5f5e0' }] },
//     { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
//     { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
//     { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
//     { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
//     { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
//     { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
//     { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
//     { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
//     { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
//     { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
// ];

// // ─────────────────────────────────────────────────────────────
// // PULSING DESTINATION MARKER COMPONENT
// // ─────────────────────────────────────────────────────────────
// const PulsingMarker = ({ isPickup }) => {
//     const pulseAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         const loop = Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, {
//                     toValue: 1,
//                     duration: 1200,
//                     easing: Easing.out(Easing.ease),
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(pulseAnim, {
//                     toValue: 0,
//                     duration: 400,
//                     useNativeDriver: true,
//                 }),
//             ])
//         );
//         loop.start();
//         return () => loop.stop();
//     }, []);

//     const pulse1Scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
//     const pulse1Opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
//     const pulse2Scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
//     const pulse2Opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

//     return (
//         <View style={styles.pulseWrapper}>
//             <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse1Scale }], opacity: pulse1Opacity }]} />
//             <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse2Scale }], opacity: pulse2Opacity }]} />
//             <View style={styles.pulseCenter}>
//                 {isPickup ? (
//                     <Image 
//                         source={require('../../assets/Restuarant.png')} 
//                         style={{ width: 42, height: 42 }} 
//                         resizeMode="contain" 
//                     />
//                 ) : (
//                     <Image 
//                         source={require('../../assets/home.png')} 
//                         style={{ width: 42, height: 42 }} 
//                         resizeMode="contain" 
//                     />
//                 )}
//             </View>
//         </View>
//     );
// };

// // ─────────────────────────────────────────────────────────────
// // MAIN MAP SCREEN COMPONENT
// // ─────────────────────────────────────────────────────────────
// const MapScreen = ({ route, navigation }) => {
//     const { orderId, type, orderDetails: passedOrderDetails } = route.params;

//     // --- ORDER STATE ---
//     const [orderDetails, setOrderDetails] = useState(passedOrderDetails || null);
//     const [isFetchingOrder, setIsFetchingOrder] = useState(!passedOrderDetails);
//     const [buttonLoading, setButtonLoading] = useState(false);

//     // --- MAP & LOCATION STATE ---
//     const [currentLocation, setCurrentLocation] = useState(null);
//     const [currentHeading, setCurrentHeading] = useState(0);
//     const [isLocating, setIsLocating] = useState(true);
//     const [isOffline, setIsOffline] = useState(false);
//     const [isTracking, setIsTracking] = useState(true);
//     const isTrackingRef = useRef(true); 
//     const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
//     const [locationError, setLocationError] = useState(null);

//     // --- REFS ---
//     const mapRef = useRef(null);
//     const watchId = useRef(null);
//     const hasRouteFitted = useRef(false);
//     const offlineBannerAnim = useRef(new Animated.Value(-60)).current;

//     // --- DERIVED DATA ---
//     const isPickup = type === 'pickupOrder' || type === 'navigateToPickup';

//     const targetLocation = useMemo(() => {
//         if (!orderDetails) return null;
//         const addr = isPickup ? orderDetails.pickupAddress : orderDetails.deliveryAddress;

//         const lat = parseFloat(addr?.lat);
//         const lng = parseFloat(addr?.lng);

//         if (isNaN(lat) || isNaN(lng)) {
//             console.warn('[MapScreen] Invalid target coordinates:', addr);
//             return null;
//         }

//         return { latitude: lat, longitude: lng };
//     }, [orderDetails, isPickup]);

//     const targetName = useMemo(() => {
//         if (!orderDetails) return '';
//         return isPickup ? orderDetails.vendorShopName : (orderDetails.deliveryAddress?.name || 'Customer Location');
//     }, [orderDetails, isPickup]);

//     const targetAddress = useMemo(() => {
//         if (!orderDetails) return '';
//         return isPickup ? orderDetails.pickupAddress?.addressLine : orderDetails.deliveryAddress?.addressLine;
//     }, [orderDetails, isPickup]);

//     // ── Prevent back navigation ────────────────────────────────
//     useEffect(() => {
//         const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
//         navigation.setOptions({ gestureEnabled: false });
//         return () => backHandler.remove();
//     }, [navigation]);

//     // ── Offline detection ──────────────────────────────────────
//     useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//             const offline = !state.isConnected;
//             setIsOffline(offline);
//             Animated.timing(offlineBannerAnim, {
//                 toValue: offline ? 0 : -60,
//                 duration: 300,
//                 useNativeDriver: true,
//             }).start();
//         });
//         return () => unsubscribe();
//     }, []);

//     // ── Fetch order details ───────────────────────────────────
//     useEffect(() => {
//         if (passedOrderDetails) return;
//         const fetchOrder = async () => {
//             try {
//                 const data = await orderService.getOrderDetails(orderId);
//                 setOrderDetails(data);
//             } catch (err) {
//                 Alert.alert("Error", "Failed to fetch order details");
//                 navigation.goBack();
//             } finally {
//                 setIsFetchingOrder(false);
//             }
//         };
//         fetchOrder();
//     }, [orderId, passedOrderDetails]);

//     // ── Location Permission ────────────────────────────────────
//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Location Permission',
//                         message: 'This app needs access to your location for navigation.',
//                         buttonPositive: 'Allow',
//                         buttonNegative: 'Deny',
//                     }
//                 );
//                 return granted === PermissionsAndroid.RESULTS.GRANTED;
//             } catch {
//                 return false;
//             }
//         }
//         return true;
//     };

//     // ── Smart GPS: Low accuracy first, then upgrade ────────────
//     const initializeLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             setLocationError('Location permission denied');
//             setCurrentLocation(FALLBACK_START_LOCATION);
//             setIsLocating(false);
//             return;
//         }

//         Geolocation.getCurrentPosition(
//             position => {
//                 const roughLocation = {
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,
//                 };
//                 setCurrentLocation(roughLocation);
//                 setIsLocating(false);
//                 setLocationError(null);
//                 startHighAccuracyWatch();
//             },
//             () => {
//                 setLocationError('GPS timeout — finding signal...');
//                 setCurrentLocation(FALLBACK_START_LOCATION);
//                 setIsLocating(false);
//                 startHighAccuracyWatch();
//             },
//             { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
//         );
//     };

//     // ── High-accuracy watch for real-time tracking ─────────────
//     const startHighAccuracyWatch = () => {
//         watchId.current = Geolocation.watchPosition(
//             position => {
//                 const newLocation = {
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude,
//                 };
//                 const heading = position.coords.heading ?? 0;

//                 setCurrentLocation(newLocation);
//                 setCurrentHeading(heading);
//                 setLocationError(null);

//                 if (isTrackingRef.current && mapRef.current) {
//                     mapRef.current.animateCamera({
//                         center: newLocation,
//                         zoom: 17,
//                         pitch: 45,
//                         heading: heading,
//                     }, { duration: 1000 });
//                 }
//             },
//             error => {
//                 console.log('[MapScreen] Watch error:', error.message);
//                 setLocationError('GPS signal lost');
//             },
//             { enableHighAccuracy: true, distanceFilter: 5, interval: 2000, fastestInterval: 1000 }
//         );
//     };

//     useEffect(() => {
//         initializeLocation();
//         return () => {
//             if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
//         };
//     }, []);

//     // ── Recenter camera ────────────────────────────────────────
//     const handleRecenter = () => {
//         if (!currentLocation || !mapRef.current) return;
//         isTrackingRef.current = true;
//         setIsTracking(true);
//         mapRef.current.animateCamera({
//             center: currentLocation,
//             zoom: 17,
//             pitch: 45,
//             heading: currentHeading,
//         }, { duration: 800 });
//     };

//     // ── Action Handler ─────────────────────────────────────────
//     const handleArrival = async () => {
//         try {
//             setButtonLoading(true);
//             if (isPickup) {
//                 await orderService.pickupOrder(orderId);
//                 navigation.replace('OrderDetailsScreen', { orderId });
//             } else {
//                 navigation.replace('OrderDetailsScreen', { orderId, status: 'EN_ROUTE_TO_DROP' });
//             }
//         } catch (err) {
//             Alert.alert("Error", "Failed to update status. Please try again.");
//         } finally {
//             setButtonLoading(false);
//         }
//     };

//     // ── UI Render ──────────────────────────────────────────────
//     if (isFetchingOrder && !passedOrderDetails) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color="#00C4B4" />
//                 <Text style={{ marginTop: 10, color: '#64748B' }}>Loading Map...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>

//             {/* ── OFFLINE BANNER ── */}
//             <Animated.View style={[styles.offlineBanner, { transform: [{ translateY: offlineBannerAnim }] }]}>
//                 <Text style={styles.offlineBannerText}>⚠️  No Internet Connection</Text>
//             </Animated.View>

//             {/* ── MAP ── */}
//             <MapView
//                 ref={mapRef}
//                 provider={PROVIDER_GOOGLE}
//                 style={styles.map}
//                 customMapStyle={MAP_STYLE}
//                 initialRegion={{
//                     latitude: currentLocation?.latitude || FALLBACK_START_LOCATION.latitude,
//                     longitude: currentLocation?.longitude || FALLBACK_START_LOCATION.longitude,
//                     latitudeDelta: 0.05,
//                     longitudeDelta: 0.05,
//                 }}
//                 showsUserLocation={false}
//                 showsCompass={false}
//                 onPanDrag={() => { isTrackingRef.current = false; setIsTracking(false); }}
//                 showsScale={false}
//             >
//                 {/* TARGET: pulsing marker */}
//                 {targetLocation && (
//                     <Marker coordinate={targetLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
//                         <PulsingMarker isPickup={isPickup} />
//                     </Marker>
//                 )}

//                 {/* RIDER: bike marker */}
//                 {currentLocation && (
//                     <Marker
//                         anchor={{ x: 0.5, y: 0.5 }}
//                         coordinate={currentLocation}
//                         rotation={currentHeading}
//                         flat={true}
//                         tracksViewChanges={false}
//                         zIndex={10}
//                     >
//                         <Image
//                             source={require('../../assets/Applogo.png')}
//                             style={{ width: 65, height: 65 }}
//                             resizeMode="contain"
//                         />
//                     </Marker>
//                 )}

//                 {/* ROUTE POLYLINE */}
//                 {currentLocation && targetLocation && !isOffline && (
//                     <MapViewDirections
//                         origin={currentLocation}
//                         destination={targetLocation}
//                         apikey={GOOGLE_MAPS_API_KEY}
//                         strokeWidth={5}
//                         strokeColor="#00C4B4"
//                         optimizeWaypoints={true}
//                         onError={(errorMessage) => {
//                             console.log('[MapScreen] Directions API Error:', errorMessage);
//                         }}
//                         onReady={result => {
//                             setRouteInfo({ distance: result.distance.toFixed(1), duration: Math.ceil(result.duration) });
//                             if (mapRef.current && !hasRouteFitted.current) {
//                                 hasRouteFitted.current = true;
//                                 mapRef.current.fitToCoordinates(result.coordinates, {
//                                     edgePadding: { top: 100, right: 60, bottom: 350, left: 60 },
//                                     animated: true,
//                                 });
//                             }
//                         }}
//                     />
//                 )}
//             </MapView>

//             {/* ── TOP BADGES ── */}
//             <View style={styles.topBadgeContainer}>
//                 {isLocating && (
//                     <View style={styles.topBadge}>
//                         <ActivityIndicator size="small" color="#000080" />
//                         <Text style={styles.topBadgeText}>Acquiring GPS…</Text>
//                     </View>
//                 )}

//                 {!isLocating && locationError && (
//                     <View style={[styles.topBadge, styles.topBadgeError]}>
//                         <Text style={styles.topBadgeErrorText}>⚠ {locationError}</Text>
//                     </View>
//                 )}

//                 {!isLocating && routeInfo.distance && !locationError && (
//                     <View style={styles.topBadge}>
//                         <Text style={styles.topBadgeText}>🕐 {routeInfo.duration} min  ·  📍 {routeInfo.distance} km</Text>
//                     </View>
//                 )}
//             </View>

//             {/* ── RECENTER BUTTON ── */}
//             {!isTracking && (
//                 <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter}>
//                     <Text style={styles.recenterIcon}>🎯</Text>
//                 </TouchableOpacity>
//             )}

//             {/* ── BOTTOM ACTION CARD (MANDATORY) ── */}
//             <View style={styles.bottomCard}>
//                 <View style={styles.dragHandle} />

//                 <View style={styles.locationRow}>
//                     <View style={styles.iconCircle}>
//                         <Text style={{ fontSize: 24 }}>{isPickup ? '🏪' : '🏠'}</Text>
//                     </View>
//                     <View style={{ marginLeft: 12, flex: 1 }}>
//                         <Text style={styles.locationTitle}>{targetName}</Text>
//                         <Text style={styles.locationAddress} numberOfLines={2}>{targetAddress}</Text>
//                     </View>
//                     {routeInfo.duration && (
//                         <View style={styles.etaBadge}>
//                             <Text style={styles.etaBadgeText}>{routeInfo.duration} min</Text>
//                         </View>
//                     )}
//                 </View>

//                 <TouchableOpacity
//                     style={[styles.actionButton, buttonLoading && styles.actionButtonDisabled]}
//                     onPress={handleArrival}
//                     disabled={buttonLoading}
//                 >
//                     {buttonLoading ? (
//                         <ActivityIndicator color="#fff" />
//                     ) : (
//                         <Text style={styles.actionButtonText}>
//                             {isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
//                         </Text>
//                     )}
//                 </TouchableOpacity>
//             </View>

//         </View>
//     );
// };

// export default MapScreen;

// // ─────────────────────────────────────────────────────────────
// // STYLES
// // ─────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f5f5f5' },
//     map: { flex: 1 },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//     // Offline Banner
//     offlineBanner: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 100,
//         backgroundColor: '#E53E3E',
//         height: 52,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     offlineBannerText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 14,
//         marginTop: 10,
//     },

//     // Top Badge Container
//     topBadgeContainer: {
//         position: 'absolute',
//         top: 52,
//         left: 0,
//         right: 0,
//         alignItems: 'center',
//         zIndex: 50,
//     },
//     topBadge: {
//         backgroundColor: 'rgba(255,255,255,0.96)',
//         paddingHorizontal: 18,
//         paddingVertical: 10,
//         borderRadius: 30,
//         flexDirection: 'row',
//         alignItems: 'center',
//         elevation: 6,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.12,
//         shadowRadius: 6,
//     },
//     topBadgeText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#1a1a2e',
//         marginLeft: 6,
//     },
//     topBadgeError: {
//         backgroundColor: 'rgba(254,226,226,0.97)',
//     },
//     topBadgeErrorText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#C53030',
//     },

//     // Recenter button
//     recenterBtn: {
//         position: 'absolute',
//         bottom: 240,
//         right: 18,
//         width: 54,
//         height: 54,
//         borderRadius: 27,
//         backgroundColor: '#FFFFFF',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         zIndex: 60,
//     },
//     recenterIcon: { fontSize: 24 },

//     // Bottom Card
//     bottomCard: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: '#FFFFFF',
//         borderTopLeftRadius: 28,
//         borderTopRightRadius: 28,
//         paddingHorizontal: 20,
//         paddingTop: 12,
//         paddingBottom: Platform.OS === 'ios' ? 40 : 25,
//         elevation: 25,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -10 },
//         shadowOpacity: 0.1,
//         shadowRadius: 20,
//     },
//     dragHandle: {
//         width: 40,
//         height: 5,
//         backgroundColor: '#E2E8F0',
//         borderRadius: 2.5,
//         alignSelf: 'center',
//         marginBottom: 20,
//     },
//     locationRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 25,
//     },
//     iconCircle: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     locationTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#1E293B',
//         marginBottom: 4,
//     },
//     locationAddress: {
//         fontSize: 14,
//         color: '#64748B',
//         lineHeight: 20,
//     },
//     etaBadge: {
//         backgroundColor: '#EFF6FF',
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         borderRadius: 12,
//         marginLeft: 8,
//     },
//     etaBadgeText: {
//         color: '#000080',
//         fontWeight: '700',
//         fontSize: 12,
//     },
//     actionButton: {
//         backgroundColor: '#00C4B4',
//         paddingVertical: 18,
//         borderRadius: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#00C4B4',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     actionButtonDisabled: {
//         backgroundColor: '#CBD5E1',
//         shadowOpacity: 0.1,
//     },
//     actionButtonText: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#FFFFFF',
//         letterSpacing: 0.5,
//     },

//     // Pulsing Marker Extra
//     pulseWrapper: {
//         width: 60,
//         height: 60,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     pulseRing: {
//         position: 'absolute',
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: '#FF0000',
//     },
//     pulseCenter: {
//         width: 62,
//         height: 62,
//         borderRadius: 31,
//         backgroundColor: '#fff',
//         borderWidth: 2.5,
//         borderColor: '#FF0000',
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 6,
//         shadowColor: '#FF0000',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//     },
//     houseMarker: {
//         width: 50,
//         height: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     }
// });
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Image,
    Text,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    BackHandler,
} from 'react-native';

import MapView, {
    PROVIDER_GOOGLE,
    Marker,
} from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';

import { orderService } from '../../services/order/OrderService';
// import { GOOGLE_MAPS_API_KEY } from '../../config/env';

import Config from 'react-native-config';
console.log("hello")
console.log('KEY', Config.GOOGLE_MAPS_API_KEY);
// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const FALLBACK_START_LOCATION = {
    latitude: 17.3850,
    longitude: 78.4866,
};

const APP_LOGO = require('../../assets/Applogo.png');
const RESTAURANT_ICON = require('../../assets/restaurant.png');
const HOME_ICON = require('../../assets/drop.png');

// ─────────────────────────────────────────────────────────────
// CLEAN GOOGLE MAP STYLE
// ─────────────────────────────────────────────────────────────

const MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
];



// ─────────────────────────────────────────────────────────────
// MAIN MAP SCREEN
// ─────────────────────────────────────────────────────────────

const MapScreen = ({ route, navigation }) => {

    const {
        orderId,
        type,
        orderDetails: passedOrderDetails,
    } = route.params;

    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────

    const [markerReady, setMarkerReady] = useState(false);

    const [orderDetails, setOrderDetails] = useState(
        passedOrderDetails || null
    );

    const [isFetchingOrder, setIsFetchingOrder] = useState(
        !passedOrderDetails
    );

    const [buttonLoading, setButtonLoading] = useState(false);

    const [currentLocation, setCurrentLocation] = useState(null);

    const [currentHeading, setCurrentHeading] = useState(0);

    const [isLocating, setIsLocating] = useState(true);

    const [isOffline, setIsOffline] = useState(false);

    const [isTracking, setIsTracking] = useState(true);

    const [routeInfo, setRouteInfo] = useState({
        distance: null,
        duration: null,
    });

    const [locationError, setLocationError] = useState(null);

    // ─────────────────────────────────────────────────────────
    // REFS
    // ─────────────────────────────────────────────────────────

    const mapRef = useRef(null);

    const watchId = useRef(null);

    const hasRouteFitted = useRef(false);

    const isTrackingRef = useRef(true);

    const offlineBannerAnim = useRef(
        new Animated.Value(-60)
    ).current;

    // ─────────────────────────────────────────────────────────
    // PICKUP OR DROP
    // ─────────────────────────────────────────────────────────

    const isPickup =
        type === 'pickupOrder' ||
        type === 'navigateToPickup';

    // ─────────────────────────────────────────────────────────
    // DESTINATION ICON
    // ─────────────────────────────────────────────────────────

    const destinationMarkerIcon = useMemo(() => {
        return isPickup
            ? RESTAURANT_ICON
            : HOME_ICON;
    }, [isPickup]);

    // ─────────────────────────────────────────────────────────
    // TARGET LOCATION
    // ─────────────────────────────────────────────────────────

    const targetLocation = useMemo(() => {

        if (!orderDetails) return null;

        const addr = isPickup
            ? orderDetails.pickupAddress
            : orderDetails.deliveryAddress;

        const lat = parseFloat(addr?.lat);
        const lng = parseFloat(addr?.lng);

        if (isNaN(lat) || isNaN(lng)) {

            console.warn(
                '[MapScreen] Invalid coordinates:',
                addr
            );

            return null;
        }

        return {
            latitude: lat,
            longitude: lng,
        };

    }, [orderDetails, isPickup]);

    // ─────────────────────────────────────────────────────────
    // TARGET NAME
    // ─────────────────────────────────────────────────────────

    const targetName = useMemo(() => {

        if (!orderDetails) return '';
        console.log(" checking orderDetails", orderDetails, "addressLine", orderDetails?.deliveryAddress?.addressLine)

        return isPickup
            ? orderDetails.vendorShopName
            : (
                orderDetails?.deliveryAddress?.addressLine
            );

    }, [orderDetails, isPickup]);

    // ─────────────────────────────────────────────────────────
    // TARGET ADDRESS
    // ─────────────────────────────────────────────────────────

    const targetAddress = useMemo(() => {

        if (!orderDetails) return '';

        return isPickup
            ? orderDetails.pickupAddress?.addressLine
            : orderDetails.deliveryAddress?.addressLine;

    }, [orderDetails, isPickup]);

    // ─────────────────────────────────────────────────────────
    // PREVENT BACK
    // ─────────────────────────────────────────────────────────

    useEffect(() => {

        const backHandler =
            BackHandler.addEventListener(
                "hardwareBackPress",
                () => true
            );

        navigation.setOptions({
            gestureEnabled: false,
        });

        return () => backHandler.remove();

    }, [navigation]);

    // ─────────────────────────────────────────────────────────
    // RESET ROUTE FIT
    // ─────────────────────────────────────────────────────────

    useEffect(() => {
        hasRouteFitted.current = false;
    }, [targetLocation]);

    // ─────────────────────────────────────────────────────────
    // OFFLINE DETECTION
    // ─────────────────────────────────────────────────────────

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(
            state => {

                const offline = !state.isConnected;

                setIsOffline(offline);

                Animated.timing(offlineBannerAnim, {
                    toValue: offline ? 0 : -60,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => unsubscribe();

    }, []);

    // ─────────────────────────────────────────────────────────
    // FETCH ORDER DETAILS
    // ─────────────────────────────────────────────────────────

    useEffect(() => {

        if (passedOrderDetails) return;

        const fetchOrder = async () => {

            try {

                const data =
                    await orderService.getOrderDetails(orderId);

                setOrderDetails(data);

            } catch (err) {

                Alert.alert(
                    "Error",
                    "Failed to fetch order details"
                );

                navigation.goBack();

            } finally {

                setIsFetchingOrder(false);
            }
        };

        fetchOrder();

    }, [orderId, passedOrderDetails]);

    // ─────────────────────────────────────────────────────────
    // LOCATION PERMISSION
    // ─────────────────────────────────────────────────────────

    const requestLocationPermission = async () => {

        if (Platform.OS === 'android') {

            try {

                const granted =
                    await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message:
                                'This app needs access to your location for navigation.',
                            buttonPositive: 'Allow',
                            buttonNegative: 'Deny',
                        }
                    );

                return (
                    granted ===
                    PermissionsAndroid.RESULTS.GRANTED
                );

            } catch {

                return false;
            }
        }

        return true;
    };

    // ─────────────────────────────────────────────────────────
    // INITIAL LOCATION
    // ─────────────────────────────────────────────────────────

    const initializeLocation = async () => {

        const hasPermission =
            await requestLocationPermission();

        if (!hasPermission) {

            setLocationError('Location permission denied');

            setCurrentLocation(
                FALLBACK_START_LOCATION
            );

            setIsLocating(false);

            return;
        }

        Geolocation.getCurrentPosition(

            position => {

                const roughLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                setCurrentLocation(roughLocation);

                setIsLocating(false);

                setLocationError(null);

                startHighAccuracyWatch();
            },

            () => {

                setLocationError(
                    'GPS timeout — finding signal...'
                );

                setCurrentLocation(
                    FALLBACK_START_LOCATION
                );

                setIsLocating(false);

                startHighAccuracyWatch();
            },

            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 30000,
            }
        );
    };

    // ─────────────────────────────────────────────────────────
    // LIVE TRACKING
    // ─────────────────────────────────────────────────────────

    const startHighAccuracyWatch = () => {

        watchId.current = Geolocation.watchPosition(

            position => {

                const newLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                const heading =
                    position.coords.heading ?? 0;

                setCurrentLocation(newLocation);

                setCurrentHeading(heading);

                setLocationError(null);

                if (
                    isTrackingRef.current &&
                    mapRef.current
                ) {

                    mapRef.current.animateCamera({
                        center: newLocation,
                        zoom: 17,
                        pitch: 45,
                        heading,
                    }, {
                        duration: 1000,
                    });
                }
            },

            error => {

                console.log(
                    '[MapScreen] Watch Error:',
                    error.message
                );

                setLocationError('GPS signal lost');
            },

            {
                enableHighAccuracy: true,
                distanceFilter: 5,
                interval: 2000,
                fastestInterval: 1000,
            }
        );
    };

    // ─────────────────────────────────────────────────────────
    // INITIALIZE LOCATION
    // ─────────────────────────────────────────────────────────

    useEffect(() => {

        initializeLocation();

        return () => {

            if (watchId.current !== null) {

                Geolocation.clearWatch(
                    watchId.current
                );

                watchId.current = null;
            }
        };

    }, []);

    // ─────────────────────────────────────────────────────────
    // RECENTER
    // ─────────────────────────────────────────────────────────

    const handleRecenter = () => {

        if (!currentLocation || !mapRef.current)
            return;

        isTrackingRef.current = true;

        setIsTracking(true);

        mapRef.current.animateCamera({
            center: currentLocation,
            zoom: 17,
            pitch: 45,
            heading: currentHeading,
        }, {
            duration: 800,
        });
    };

    // ─────────────────────────────────────────────────────────
    // ARRIVAL ACTION
    // ─────────────────────────────────────────────────────────

    const handleArrival = async () => {

        try {

            setButtonLoading(true);

            if (isPickup) {

                await orderService.pickupOrder(orderId);

                navigation.replace(
                    'OrderDetailsScreen',
                    { orderId }
                );

            } else {

                navigation.replace(
                    'OrderDetailsScreen',
                    {
                        orderId,
                        status: 'EN_ROUTE_TO_DROP',
                    }
                );
            }

        } catch (err) {

            Alert.alert(
                "Error",
                "Failed to update status. Please try again."
            );

        } finally {

            setButtonLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // LOADING STATE
    // ─────────────────────────────────────────────────────────

    if (isFetchingOrder && !passedOrderDetails) {

        return (
            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                    color="#00C4B4"
                />

                <Text style={{
                    marginTop: 10,
                    color: '#64748B',
                }}>
                    Loading Map...
                </Text>

            </View>
        );
    }

    // ─────────────────────────────────────────────────────────
    // INVALID LOCATION
    // ─────────────────────────────────────────────────────────

    if (!targetLocation) {

        return (
            <View style={styles.center}>
                <Text style={{
                    color: 'red',
                    fontSize: 16,
                }}>
                    Invalid destination coordinates
                </Text>
            </View>
        );
    }

    // ─────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────

    return (

        <View style={styles.container}>

            {/* OFFLINE BANNER */}

            <Animated.View
                style={[
                    styles.offlineBanner,
                    {
                        transform: [
                            {
                                translateY:
                                    offlineBannerAnim,
                            }
                        ]
                    }
                ]}
            >
                <Text style={styles.offlineBannerText}>
                    ⚠️ No Internet Connection
                </Text>
            </Animated.View>

            {/* MAP */}

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={MAP_STYLE}
                showsUserLocation={false}
                showsCompass={false}
                showsScale={false}
                initialRegion={{
                    latitude:
                        currentLocation?.latitude ||
                        FALLBACK_START_LOCATION.latitude,

                    longitude:
                        currentLocation?.longitude ||
                        FALLBACK_START_LOCATION.longitude,

                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onPanDrag={() => {
                    isTrackingRef.current = false;
                    setIsTracking(false);
                }}
            >

                {/* DESTINATION MARKER */}

                {targetLocation && (

                    <Marker
                        coordinate={targetLocation}
                        anchor={{ x: 0.5, y: 0.5 }}
                        tracksViewChanges={!markerReady}
                    >

                        <Image
                            source={destinationMarkerIcon}
                            style={styles.riderMarkerImage}
                            resizeMode="contain"
                            fadeDuration={0}
                            onLoadEnd={() =>
                                setMarkerReady(true)
                            }
                        />

                    </Marker>
                )}

                {/* RIDER CURRENT LOCATION */}

                {currentLocation && (

                    <Marker
                        coordinate={currentLocation}
                        anchor={{ x: 0.5, y: 0.5 }}
                        rotation={currentHeading}
                        flat={true}
                        tracksViewChanges={false}
                        zIndex={10}
                    >

                        <Image
                            source={APP_LOGO}
                            style={styles.riderMarkerImage}
                            resizeMode="contain"
                            fadeDuration={0}
                        />

                    </Marker>
                )}

                {/* ROUTE */}

                {currentLocation &&
                    targetLocation &&
                    !isOffline && (

                        <MapViewDirections
                            origin={currentLocation}
                            destination={targetLocation}
                            apikey={Config.GOOGLE_MAPS_API_KEY}
                            strokeWidth={5}
                            strokeColor="#00C4B4"
                            optimizeWaypoints={true}
                            precision="high"
                            timePrecision="now"
                            resetOnChange={false}

                            onReady={result => {

                                setRouteInfo({
                                    distance:
                                        result.distance.toFixed(1),

                                    duration:
                                        Math.ceil(result.duration),
                                });

                                if (
                                    mapRef.current &&
                                    !hasRouteFitted.current
                                ) {

                                    hasRouteFitted.current = true;

                                    mapRef.current.fitToCoordinates(
                                        result.coordinates,
                                        {
                                            edgePadding: {
                                                top: 100,
                                                right: 60,
                                                bottom: 350,
                                                left: 60,
                                            },
                                            animated: true,
                                        }
                                    );
                                }
                            }}

                            onError={errorMessage => {

                                console.log(
                                    '[MapScreen] Directions API Error:',
                                    errorMessage
                                );
                            }}
                        />
                    )}
            </MapView>

            {/* TOP BADGES */}

            <View style={styles.topBadgeContainer}>

                {isLocating && (

                    <View style={styles.topBadge}>

                        <ActivityIndicator
                            size="small"
                            color="#000080"
                        />

                        <Text style={styles.topBadgeText}>
                            Acquiring GPS…
                        </Text>

                    </View>
                )}

                {!isLocating &&
                    locationError && (

                        <View style={[
                            styles.topBadge,
                            styles.topBadgeError,
                        ]}>

                            <Text style={
                                styles.topBadgeErrorText
                            }>
                                ⚠ {locationError}
                            </Text>

                        </View>
                    )}

                {!isLocating &&
                    routeInfo.distance &&
                    !locationError && (

                        <View style={styles.topBadge}>

                            <Text style={styles.topBadgeText}>
                                🕐 {routeInfo.duration} min · 📍 {routeInfo.distance} km
                            </Text>

                        </View>
                    )}
            </View>

            {/* RECENTER BUTTON */}

            {!isTracking && (

                <TouchableOpacity
                    style={styles.recenterBtn}
                    onPress={handleRecenter}
                >

                    <Text style={styles.recenterIcon}>
                        🎯
                    </Text>

                </TouchableOpacity>
            )}

            {/* BOTTOM CARD */}

            <View style={styles.bottomCard}>

                <View style={styles.dragHandle} />

                <View style={styles.locationRow}>

                    <View style={styles.iconCircle}>

                        <Text style={{ fontSize: 24 }}>
                            {isPickup ? '🏪' : '🏠'}
                        </Text>

                    </View>

                    <View style={{
                        marginLeft: 12,
                        flex: 1,
                    }}>

                        <Text style={styles.locationTitle}>
                            {targetName}
                        </Text>

                        <Text
                            style={styles.locationAddress}
                            numberOfLines={2}
                        >
                            {targetAddress}
                        </Text>

                    </View>

                    {routeInfo.duration && (

                        <View style={styles.etaBadge}>

                            <Text style={styles.etaBadgeText}>
                                {routeInfo.duration} min
                            </Text>

                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        buttonLoading &&
                        styles.actionButtonInactive
                    ]}
                    onPress={handleArrival}
                    disabled={buttonLoading}
                >

                    {buttonLoading ? (

                        <ActivityIndicator color="#fff" />

                    ) : (

                        <Text style={styles.actionButtonText}>
                            {isPickup
                                ? 'Arrived at Restaurant'
                                : 'Arrived at Drop Location'}
                        </Text>
                    )}
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default MapScreen;

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    map: {
        flex: 1,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // OFFLINE BANNER

    offlineBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#E53E3E',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },

    offlineBannerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 10,
    },

    // TOP BADGES

    topBadgeContainer: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 50,
    },

    topBadge: {
        backgroundColor: 'rgba(255,255,255,0.96)',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
    },

    topBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a2e',
        marginLeft: 6,
    },

    topBadgeError: {
        backgroundColor: 'rgba(254,226,226,0.97)',
    },

    topBadgeErrorText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#C53030',
    },

    // RECENTER BUTTON

    recenterBtn: {
        position: 'absolute',
        bottom: 240,
        right: 18,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        zIndex: 60,
    },

    recenterIcon: {
        fontSize: 24,
    },

    // BOTTOM CARD

    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom:
            Platform.OS === 'ios'
                ? 40
                : 25,
        elevation: 25,
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

    etaBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
    },

    etaBadgeText: {
        color: '#000080',
        fontWeight: '700',
        fontSize: 12,
    },

    // ACTION BUTTON

    actionButton: {
        backgroundColor: '#00C4B4',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },

    actionButtonInactive: {
        backgroundColor: '#CBD5E1',
    },

    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },



    // RIDER MARKER

    riderMarkerImage: {
        width: 62,
        height: 62,
    },
});