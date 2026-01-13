import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TodayProgress() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today Progress</Text>

      <View style={styles.card}>
        <Text style={styles.item}>• Worked on static UI screens</Text>
        <Text style={styles.item}>• Implemented banner navigation</Text>
        <Text style={styles.item}>• Verified screen flow</Text>
        <Text style={styles.item}>• Tested basic navigation</Text>
      </View>
    </View>
  );
}
