import React, { useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import SourceMarker from '../map/SourceMarker';
import DestinationMarker from '../map/DestinationMarker';
import RiderMarker from '../map/RiderMarker'
import RoutePolyline from '../map/RoutePolyline';

const SOURCE = {
  latitude: 17.5169,
  longitude: 78.3428,
};

const DESTINATION = {
  latitude: 17.4875,
  longitude: 78.3953,
};

const LiveMap = () => {
  const mapRef = useRef(null);
  const riderRef = useRef(null);

  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newLocation = {
          latitude,
          longitude,
        };

        // update marker
        setRiderLocation(newLocation);
        riderRef.current?.updateLocation(newLocation);

        // move camera
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      },
      (error) => {
        console.log("GPS Error:", error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 3000,
        fastestInterval: 2000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      showsUserLocation={false}
      followsUserLocation={false}
      initialRegion={{
        latitude: SOURCE.latitude,
        longitude: SOURCE.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <RiderMarker ref={riderRef} />
      <DestinationMarker ref={riderRef}/>
      <SourceMarker ref={riderRef}/>
      <RoutePolyline
        source={riderLocation || SOURCE}
        destination={DESTINATION}
      />
    </MapView>
  );
};

export default LiveMap;
