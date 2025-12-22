// ReferFriendScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReferFrd() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer a Friend</Text>
      <Text>Share your referral code with friends 🎁</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
