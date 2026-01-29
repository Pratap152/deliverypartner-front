import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import OrderCard from "../../screens/order/OrderCard";
import { useRider } from "../../context/RiderContext";

const GlobalOrderPopup = () => {
  const { order, acceptOrder, rejectOrder } = useRider();
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (!order) return;

    setTimeLeft(20);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          rejectOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  return (
    <Modal transparent animationType="slide" visible>
      <View style={styles.overlay}>
        <OrderCard
          distance={`${order.distance} km`}
          price={order.earning}
          items={order.items || 1}
          pickup={order.vendorShopName}
          drop={order.dropAddress || "Customer Location"}
          timeLeft={timeLeft}
          onAccept={acceptOrder}
          onReject={rejectOrder}
        />
      </View>
    </Modal>
  );
};

export default GlobalOrderPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
});
