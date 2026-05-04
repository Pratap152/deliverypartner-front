import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LiveMap from '../../components/map/LiveMap';
import OrderStatusCard from '../../components/map/OrderStatusCard';
// import { getMockRiderLocation } from '../../services/mockLocation';

export default function LiveTracking() {
  const riderPosition = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const location = getMockRiderLocation();
      riderPosition.current?.move(location);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LiveMap riderRef={riderPosition} />
      <OrderStatusCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
