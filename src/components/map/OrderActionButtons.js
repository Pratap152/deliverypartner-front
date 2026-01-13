import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function OrderActionButtons({ actions, onPress }) {
  return (
    <View style={styles.container}>
      {actions.map(action => (
        <TouchableOpacity
          key={action}
          style={styles.button}
          onPress={() => onPress(action)}
        >
          <Text style={styles.text}>
            {action.replaceAll("_", " ")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  button: {
    backgroundColor: "#1E90FF",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  text: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
