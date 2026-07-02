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
    Linking,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


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
            ? orderDetails.pickupAddress?.name
            : (
                orderDetails?.deliveryAddress?.name
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

                await orderService.markArrivedAtPickup(orderId);

                navigation.replace(
                    'OrderDetailsScreen',
                    { orderId }
                );

            } else {

                await orderService.markArrivedAtDrop(orderId);

                navigation.replace(
                    'OrderDetailsScreen',
                    { orderId }
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
    // OPEN MAPS REDIRECT
    // ─────────────────────────────────────────────────────────

    const handleOpenMaps = () => {

        if (!targetLocation) {
            Alert.alert("Error", "Destination coordinates not available");
            return;
        }

        const { latitude, longitude } = targetLocation;
        const label = encodeURIComponent(targetName || (isPickup ? 'Pickup' : 'Drop'));

        const url = Platform.select({
            ios: `maps:0,0?q=${latitude},${longitude}(${label})`,
            android: `geo:0,0?q=${latitude},${longitude}(${label})`,
        });

        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

        Linking.openURL(url).catch(() => {
            Linking.openURL(webUrl).catch((err) => {
                console.error('[MapScreen] Failed to open maps URL:', err);
                Alert.alert("Error", "Could not open Google Maps navigation.");
            });
        });
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

                <View style={styles.topSection}>
                    <View style={styles.textDetails}>
                        <View style={styles.orderTypeRow}>
                            <Ionicons
                                name={isPickup ? "basket-outline" : "home-outline"}
                                size={18}
                                color="#64748B"
                                style={styles.orderTypeIcon}
                            />
                            <Text style={styles.orderTypeText}>
                                {isPickup ? 'Pickup order' : 'Delivery order'}
                            </Text>
                            {routeInfo.duration && (
                                <View style={styles.etaBadge}>
                                    <Text style={styles.etaBadgeText}>
                                        {routeInfo.duration} min
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.locationTitle} numberOfLines={1}>
                            {targetName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.mapsRedirectButton}
                        onPress={handleOpenMaps}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-redo" size={24} color="#FFFFFF" />
                        <Text style={styles.mapsRedirectButtonText}>MAPS</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.addressSection}>
                    <Text style={styles.locationAddress}>
                        {targetAddress}
                    </Text>
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

    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    textDetails: {
        flex: 1,
        marginRight: 12,
    },

    orderTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },

    orderTypeIcon: {
        marginRight: 6,
    },

    orderTypeText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },

    locationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 24,
    },

    mapsRedirectButton: {
        width: 58,
        height: 58,
        backgroundColor: '#1F3365',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    mapsRedirectButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
        letterSpacing: 0.5,
    },

    divider: {
        borderWidth: 0.8,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginVertical: 14,
        height: 0,
    },

    addressSection: {
        marginBottom: 20,
    },

    locationAddress: {
        fontSize: 14,
        color: '#475569',
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
        backgroundColor: '#1F3365',
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