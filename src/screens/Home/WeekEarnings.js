import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WeekEarnings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week Earnings</Text>

      <View style={styles.card}>
        <Text style={styles.amount}>₹ 3,450</Text>
        <Text style={styles.subText}>Total Earnings</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Orders</Text>
          <Text style={styles.value}>24</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Hours</Text>
          <Text style={styles.value}>18h</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Incentives</Text>
          <Text style={styles.value}>₹ 750</Text>
        </View>

        <View style={styles.box}> 
          <Text style={styles.label}>Tips</Text>
          <Text style={styles.value}>₹ 300</Text>
        </View>
      </View>
    </View>
  );
}
