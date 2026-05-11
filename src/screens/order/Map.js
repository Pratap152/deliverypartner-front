import React, { useEffect, useState, useRef } from 'react';
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
    Easing,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import { VehicleMarker, StoreMarker } from '../../components/map/markers/MapMarkers';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const STOP_LOCATION = {
    latitude: 17.44901,
    longitude: 78.38314,
};

const FALLBACK_START_LOCATION = {
    latitude: 17.3850,
    longitude: 78.4866,
};

const GOOGLE_MAPS_API_KEY = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";

// ─────────────────────────────────────────────────────────────
// CUSTOM GOOGLE MAPS STYLE (Clean / No clutter)
// ─────────────────────────────────────────────────────────────
const MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5f5e0' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];

// ─────────────────────────────────────────────────────────────
// PULSING DESTINATION MARKER COMPONENT
// ─────────────────────────────────────────────────────────────
const PulsingMarker = () => {
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const pulse1Scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
    const pulse1Opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
    const pulse2Scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
    const pulse2Opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

    return (
        <View style={styles.pulseWrapper}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse1Scale }], opacity: pulse1Opacity }]} />
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse2Scale }], opacity: pulse2Opacity }]} />
            <View style={styles.pulseCenter}>
                <StoreMarker size={55} />
            </View>
        </View>
    );
};

// ─────────────────────────────────────────────────────────────
// MAIN MAP COMPONENT
// ─────────────────────────────────────────────────────────────
export const Map = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentHeading, setCurrentHeading] = useState(0);
    const [isLocating, setIsLocating] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [isTracking, setIsTracking] = useState(true);
    const isTrackingRef = useRef(true); // ref to avoid stale closure inside watchPosition
    const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
    const [locationError, setLocationError] = useState(null);

    const mapRef = useRef(null);
    const watchId = useRef(null);
    const hasRouteFitted = useRef(false);
    const offlineBannerAnim = useRef(new Animated.Value(-60)).current;

    // ── Offline detection ──────────────────────────────────────
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const offline = !state.isConnected;
            setIsOffline(offline);
            Animated.timing(offlineBannerAnim, {
                toValue: offline ? 0 : -60,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
        return () => unsubscribe();
    }, []);

    // ── Location Permission ────────────────────────────────────
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location for navigation.',
                        buttonPositive: 'Allow',
                        buttonNegative: 'Deny',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch {
                return false;
            }
        }
        return true;
    };

    // ── Smart GPS: Low accuracy first, then upgrade ────────────
    const initializeLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            setLocationError('Location permission denied');
            setCurrentLocation(FALLBACK_START_LOCATION);
            setIsLocating(false);
            return;
        }

        // STEP 1: Grab a fast, rough location immediately (works indoors)
        Geolocation.getCurrentPosition(
            position => {
                const roughLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setCurrentLocation(roughLocation);
                setIsLocating(false);
                setLocationError(null);

                // STEP 2: After rough fix, start watching with HIGH accuracy for precision
                startHighAccuracyWatch();
            },
            () => {
                // Rough location also failed — use fallback
                setLocationError('GPS timeout — using test location');
                setCurrentLocation(FALLBACK_START_LOCATION);
                setIsLocating(false);
                startHighAccuracyWatch(); // still watch in case GPS wakes up
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
        );
    };

    // ── High-accuracy watch for real-time tracking ─────────────
    const startHighAccuracyWatch = () => {
        watchId.current = Geolocation.watchPosition(
            position => {
                const newLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                const heading = position.coords.heading ?? 0;

                setCurrentLocation(newLocation);
                setCurrentHeading(heading);
                setLocationError(null);

                // Move camera only if auto-tracking is on (read from ref — not stale state)
                if (isTrackingRef.current && mapRef.current) {
                    mapRef.current.animateCamera({
                        center: newLocation,
                        zoom: 17,
                        pitch: 45,
                        heading: heading,
                    }, { duration: 1000 });
                }
            },
            error => {
                console.log('Watch error:', error.message);
                setLocationError('GPS signal lost');
            },
            { enableHighAccuracy: true, distanceFilter: 5, interval: 2000, fastestInterval: 1000 }
        );
    };

    // ── Lifecycle ──────────────────────────────────────────────
    useEffect(() => {
        initializeLocation();
        return () => {
            if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
        };
    }, []);

    // ── Recenter camera ────────────────────────────────────────
    const handleRecenter = () => {
        if (!currentLocation || !mapRef.current) return;
        isTrackingRef.current = true;
        setIsTracking(true);
        mapRef.current.animateCamera({
            center: currentLocation,
            zoom: 17,
            pitch: 45,
            heading: currentHeading,
        }, { duration: 800 });
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>

            {/* ── OFFLINE BANNER ── */}
            <Animated.View style={[styles.offlineBanner, { transform: [{ translateY: offlineBannerAnim }] }]}>
                <Text style={styles.offlineBannerText}>⚠️  No Internet Connection</Text>
            </Animated.View>

            {/* ── MAP ── */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={MAP_STYLE}
                initialRegion={{
                    latitude: 17.3850,
                    longitude: 78.4866,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={false}
                showsCompass={false}
                onPanDrag={() => { isTrackingRef.current = false; setIsTracking(false); }}
                showsScale={false}
            >
                {/* DESTINATION: pulsing marker */}
                <Marker coordinate={STOP_LOCATION} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
                    <PulsingMarker />
                </Marker>

                {/* RIDER: bike marker — coordinate is plain {latitude, longitude} from state */}
                {currentLocation && (
                    <Marker
                        anchor={{ x: 0.5, y: 0.5 }}
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        rotation={currentHeading}
                        flat={true}
                        tracksViewChanges={false}
                    >
                        <VehicleMarker size={65} />
                    </Marker>
                )}

                {/* ROUTE POLYLINE */}
                {currentLocation && !isOffline && (
                    <MapViewDirections
                        origin={currentLocation}
                        destination={STOP_LOCATION}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={4}
                        strokeColor="#000000"
                        optimizeWaypoints={false}
                        onError={(errorMessage) => {
                            console.log('Directions API Error:', errorMessage);
                            setLocationError(`Route error: ${errorMessage}`);
                        }}
                        onReady={result => {
                            setRouteInfo({ distance: result.distance.toFixed(1), duration: Math.ceil(result.duration) });
                            if (mapRef.current && !hasRouteFitted.current) {
                                hasRouteFitted.current = true;
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 100, right: 60, bottom: 220, left: 60 },
                                    animated: true,
                                });
                            }
                        }}
                    />
                )}
            </MapView>

            {/* ── TOP: ACQUIRING GPS ── */}
            {isLocating && (
                <View style={styles.topBadge}>
                    <ActivityIndicator size="small" color="#000080" />
                    <Text style={[styles.topBadgeText, { marginLeft: 8 }]}>Acquiring GPS…</Text>
                </View>
            )}

            {/* ── TOP: ERROR STATE ── */}
            {!isLocating && locationError && (
                <View style={[styles.topBadge, styles.topBadgeError]}>
                    <Text style={styles.topBadgeErrorText}>⚠ {locationError}</Text>
                </View>
            )}

            {/* ── TOP: ROUTE INFO (ETA + Distance) ── */}
            {!isLocating && routeInfo.distance && !locationError && (
                <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>🕐 {routeInfo.duration} min  ·  📍 {routeInfo.distance} km</Text>
                </View>
            )}

            {/* ── RECENTER BUTTON ── */}
            {!isTracking && (
                <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter}>
                    <Text style={styles.recenterIcon}>🎯</Text>
                </TouchableOpacity>
            )}

            {/* ── BOTTOM INFO CARD ── */}
            <View style={styles.bottomCard}>
                <View style={styles.dragHandle} />
                <View style={styles.destinationRow}>
                    <View style={styles.destinationDot} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.destinationLabel}>Drop Location</Text>
                        <Text style={styles.destinationCoords}>
                            {STOP_LOCATION.latitude.toFixed(4)}, {STOP_LOCATION.longitude.toFixed(4)}
                        </Text>
                    </View>
                    {routeInfo.duration && (
                        <View style={styles.etaBadge}>
                            <Text style={styles.etaBadgeText}>{routeInfo.duration} min</Text>
                        </View>
                    )}
                </View>
            </View>

        </View>
    );
};

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    map: { flex: 1 },

    // Offline Banner
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

    // Top Badge
    topBadge: {
        position: 'absolute',
        top: 52,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.96)',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
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

    // Recenter button
    recenterBtn: {
        position: 'absolute',
        bottom: 200,
        right: 18,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.97)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    recenterIcon: { fontSize: 22 },

    // Bottom Card
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    dragHandle: {
        width: 36,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    destinationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    destinationDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FF0000',
        borderWidth: 2,
        borderColor: '#FFAAAA',
        marginRight: 12,
    },
    destinationLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    destinationCoords: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    etaBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    etaBadgeText: {
        color: '#000080',
        fontWeight: '700',
        fontSize: 13,
    },

    // Pulsing Marker
    pulseWrapper: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF0000',
    },
    pulseCenter: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#fff',
        borderWidth: 2.5,
        borderColor: '#FF0000',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});