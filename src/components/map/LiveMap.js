import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

// Static destination location (Hyderabad)
const DESTINATION = {
  latitude: 17.385044,
  longitude: 78.486671,
};

const LiveMap = () => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: DESTINATION.latitude,
        longitude: DESTINATION.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Destination Marker */}
      <Marker
        coordinate={DESTINATION}
        title="Drop Location"
      />
    </MapView>
  );
};

export default LiveMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
