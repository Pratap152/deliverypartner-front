// import React, { useEffect, useRef, useState } from "react";
// import MapView from "react-native-maps";
// import Geolocation from "@react-native-community/geolocation";

// import RiderMarker from '../map/RiderMarker';
// import SourceMarker from '../map/SourceMarker';
// import DestinationMarker from '../map/DestinationMarker';
// import RoutePolyline from '../map/RoutePolyline';

// const SOURCE = {
//   latitude: 19.0896,
//   longitude: 72.8656,
// };

// const DESTINATION = {
//   latitude: 19.1015,
//   longitude: 72.8743,
// };

// const LiveMap = () => {
//   const mapRef = useRef(null);
//   const riderRef = useRef(null);

//   const [riderLocation, setRiderLocation] = useState(null);

//   useEffect(() => {
//     const watchId = Geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         const coords = { latitude, longitude };

//         setRiderLocation(coords);
//         riderRef.current?.updateLocation(coords);

//         mapRef.current?.animateToRegion(
//           {
//             latitude,
//             longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           },
//           1000
//         );
//       },
//       (err) => console.log("GPS error", err),
//       {
//         enableHighAccuracy: true,
//         distanceFilter: 5,
//         interval: 3000,
//       }
//     );

//     return () => Geolocation.clearWatch(watchId);
//   }, []);

//   return (
//     <MapView
//       ref={mapRef}
//       style={{ flex: 1 }}
//       initialRegion={{
//         latitude: SOURCE.latitude,
//         longitude: SOURCE.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       }}
//     >
//       {/* ✅ RESTAURANT */}
//       <SourceMarker coordinate={SOURCE} />

//       {/* ✅ CUSTOMER */}
//       <DestinationMarker coordinate={DESTINATION} />

//       {/* ✅ RIDER */}
//       <RiderMarker ref={riderRef} />

//       {/* ✅ ROUTE */}
//       <RoutePolyline
//         source={riderLocation || SOURCE}
//         destination={DESTINATION}
//       />
//     </MapView>
//   );
// };

// export default LiveMap;
// components/map/LiveMap.js
import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  Dimensions
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get('window');
const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const LiveMap = ({ 
  pickupLocation,  // { latitude, longitude, name, address }
  dropLocation,    // { latitude, longitude, name, address }
  isTracking = false,
  onTrackingStart,
  onTrackingStop,
  showControls = true,
  height: customHeight
}) => {
  const mapRef = useRef(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [mapRegion, setMapRegion] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Start pulse animation for rider marker
  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isTracking]);

  // Get initial rider location
  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        setRiderLocation({ latitude, longitude });
        setHasLocationPermission(true);
        setIsLoading(false);
        
        // Fit map to show all points
        setTimeout(() => fitToAllMarkers(), 500);
        
      } catch (error) {
        console.log("Initial location error:", error);
        setIsLoading(false);
        
        // Use pickup location as fallback for rider position
        if (pickupLocation) {
          setRiderLocation(pickupLocation);
          setTimeout(() => fitToAllMarkers(), 500);
        }
      }
    };

    getInitialLocation();
  }, []);

  // Start/stop tracking based on isTracking prop
  useEffect(() => {
    if (isTracking && riderLocation && isMapReady) {
      startRealTimeTracking();
    } else {
      stopRealTimeTracking();
    }

    return () => {
      stopRealTimeTracking();
    };
  }, [isTracking, riderLocation, isMapReady]);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
        }
      );
    });
  };

  const startRealTimeTracking = () => {
    console.log("🚀 Starting real-time tracking");
    
    if (watchId) {
      Geolocation.clearWatch(watchId);
    }

    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        
        console.log("📍 Location update:", latitude, longitude);
        setRiderLocation(newLocation);

        // Smoothly move map to follow rider
        if (mapRef.current && isTracking) {
          mapRef.current.animateToRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }
      },
      (error) => {
        console.log("Tracking error:", error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Update every 5 meters
        interval: 3000,
        fastestInterval: 2000,
      }
    );

    setWatchId(id);
    if (onTrackingStart) onTrackingStart();
  };

  const stopRealTimeTracking = () => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log("🛑 Stopped real-time tracking");
      if (onTrackingStop) onTrackingStop();
    }
  };

  const fitToAllMarkers = () => {
    if (!mapRef.current || !isMapReady) return;

    const coordinates = [];
    
    if (riderLocation) coordinates.push(riderLocation);
    if (pickupLocation) coordinates.push(pickupLocation);
    if (dropLocation) coordinates.push(dropLocation);

    if (coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
        animated: true,
      });
    }
  };

  const handleRouteReady = (result) => {
    setRouteCoordinates(result.coordinates || []);
    setDistance((result.distance / 1000).toFixed(1));
    setEta(Math.round(result.duration));
  };

  const zoomToLocation = (location) => {
    if (!mapRef.current || !location) return;
    
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);
  };

  const handleStartTracking = () => {
    Alert.alert(
      "Start Live Tracking",
      "Start real-time location tracking for navigation?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start", 
          onPress: () => {
            if (onTrackingStart) onTrackingStart();
          }
        }
      ]
    );
  };

  const handleStopTracking = () => {
    Alert.alert(
      "Stop Tracking",
      "Stop live location tracking?",
      [
        { text: "Continue", style: "cancel" },
        { 
          text: "Stop", 
          onPress: () => {
            if (onTrackingStop) onTrackingStop();
          }
        }
      ]
    );
  };

  // Custom Marker Components
  const PickupMarker = () => {
    if (!pickupLocation) return null;

    return (
      <Marker
        coordinate={pickupLocation}
        title="Pickup"
        description={pickupLocation.name || "Restaurant"}
        anchor={{ x: 0.5, y: 1 }}
      >
        <View style={styles.pickupMarkerContainer}>
          <View style={styles.markerIconContainer}>
            <Icon name="store" size={20} color="white" />
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText}>PICKUP</Text>
          </View>
        </View>
      </Marker>
    );
  };

  const DropMarker = () => {
    if (!dropLocation) return null;

    return (
      <Marker
        coordinate={dropLocation}
        title="Drop"
        description={dropLocation.name || "Customer"}
        anchor={{ x: 0.5, y: 1 }}
      >
        <View style={styles.dropMarkerContainer}>
          <View style={styles.markerIconContainer}>
            <Icon name="location-on" size={20} color="white" />
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText}>DROP</Text>
          </View>
        </View>
      </Marker>
    );
  };

  const RiderMarker = () => {
    if (!riderLocation) return null;

    return (
      <Marker
        coordinate={riderLocation}
        title="You"
        description={isTracking ? "Moving..." : "Rider"}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <Animated.View style={[
          styles.riderMarkerContainer,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <View style={styles.riderInnerCircle}>
            <Icon name="delivery-dining" size={18} color="white" />
          </View>
          <View style={styles.riderPulseCircle} />
        </Animated.View>
      </Marker>
    );
  };

  const containerStyle = customHeight ? { height: customHeight } : styles.container;

  if (isLoading) {
    return (
      <View style={[containerStyle, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00C4B4" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: riderLocation?.latitude || 19.0760,
          longitude: riderLocation?.longitude || 72.8777,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        onMapReady={() => setIsMapReady(true)}
        customMapStyle={mapStyle}
      >
        {/* Pickup Marker */}
        <PickupMarker />

        {/* Drop Marker */}
        <DropMarker />

        {/* Rider Marker */}
        <RiderMarker />

        {/* Route between rider and destination when tracking */}
        {isTracking && riderLocation && dropLocation && (
          <MapViewDirections
            origin={riderLocation}
            destination={dropLocation}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="#00C4B4"
            mode="DRIVING"
            precision="high"
            onReady={handleRouteReady}
            onError={(errorMessage) => {
              console.log("Route error:", errorMessage);
              // Draw straight line as fallback
              setRouteCoordinates([riderLocation, dropLocation]);
            }}
          />
        )}

        {/* Route between pickup and drop (when not tracking) */}
        {!isTracking && pickupLocation && dropLocation && (
          <Polyline
            coordinates={[pickupLocation, dropLocation]}
            strokeWidth={3}
            strokeColor="#CCCCCC"
            strokeDashArray={[5, 5]}
          />
        )}
      </MapView>

      {/* Distance & ETA Card */}
      {(distance || eta) && isTracking && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="access-time" size={18} color="#666" />
              <Text style={styles.infoValue}>{eta || '--'}</Text>
              <Text style={styles.infoLabel}>min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Icon name="directions" size={18} color="#666" />
              <Text style={styles.infoValue}>{distance || '--'}</Text>
              <Text style={styles.infoLabel}>km</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Icon name="speed" size={18} color="#4CAF50" />
              <Text style={[styles.infoValue, styles.liveText]}>LIVE</Text>
              <Text style={styles.infoLabel}>Status</Text>
            </View>
          </View>
        </View>
      )}

      {/* Map Controls */}
      {showControls && isMapReady && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={fitToAllMarkers}
          >
            <Icon name="zoom-out-map" size={22} color="#333" />
          </TouchableOpacity>
          
          {riderLocation && (
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => zoomToLocation(riderLocation)}
            >
              <Icon name="my-location" size={22} color="#333" />
            </TouchableOpacity>
          )}
          
          {pickupLocation && (
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => zoomToLocation(pickupLocation)}
            >
              <Icon name="store" size={22} color="#333" />
            </TouchableOpacity>
          )}
          
          {dropLocation && (
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => zoomToLocation(dropLocation)}
            >
              <Icon name="location-on" size={22} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tracking Control Button */}
      {showControls && (
        <View style={styles.trackingControlContainer}>
          <TouchableOpacity 
            style={[
              styles.trackingButton,
              isTracking ? styles.stopButton : styles.startButton
            ]}
            onPress={isTracking ? handleStopTracking : handleStartTracking}
          >
            <Icon 
              name={isTracking ? "stop" : "play-arrow"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.trackingButtonText}>
              {isTracking ? 'STOP TRACKING' : 'START TRACKING'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Google Maps Custom Style (like Swiggy/Zomato)
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  // Marker Styles
  pickupMarkerContainer: {
    alignItems: 'center',
  },
  dropMarkerContainer: {
    alignItems: 'center',
  },
  markerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropMarkerContainer: {
    alignItems: 'center',
  },
  dropMarkerContainer: {
    alignItems: 'center',
  },
  markerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  // Rider Marker
  riderMarkerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderInnerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    zIndex: 2,
  },
  riderPulseCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    zIndex: 1,
  },
  // Info Card
  infoCard: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  liveText: {
    color: '#4CAF50',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  // Controls
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    right: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Tracking Control
  trackingControlContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#00C4B4',
  },
  stopButton: {
    backgroundColor: '#FF5252',
  },
  trackingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default LiveMap;