import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrderStatusCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider on the way 🚴</Text>
      <Text>ETA: 15 mins</Text>
      <Text>Order ID: #12345</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
