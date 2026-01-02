import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";

const filters = ["all", "available", "booked", "cancelled"];

export default function SlotFilters({ value, onChange }) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((f) => {
          const isActive = value === f;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterPill,
                isActive ? styles.activePill : styles.inactivePill
              ]}
              onPress={() => onChange(f)}
            >
              <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
                {capitalize(f)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, // Pill shape
    marginRight: 10,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: "#4C4CFF",
    borderColor: "#4C4CFF",
  },
  inactivePill: {
    backgroundColor: "#FFF",
    borderColor: "#E5E5EA", // Light border
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFF",
  },
  inactiveText: {
    color: "#4B5563", // Dark gray
  },
});
