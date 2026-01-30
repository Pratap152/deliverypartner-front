import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ShiftStartedBanner = () => (
  <View style={styles.container}>
    <Text style={styles.icon}>🕒</Text>
    <View>
      <Text style={styles.title}>Shift Started</Text>
      <Text style={styles.sub}>You're now online</Text>
    </View>
  </View>
);

export default ShiftStartedBanner;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  icon: { fontSize: 22, marginRight: 12 },
  title: { fontWeight: "700", color: "#15803D" },
  sub: { color: "#15803D", fontSize: 13 },
});
