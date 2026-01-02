import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WeekSelector({weeks, selectedWeek, onSelect }) {

  return (
    <View style={styles.row}>
      {weeks.map((day) => (
        <TouchableOpacity
          key={day.date}
          style={[
            styles.day,
            selectedWeek === day.date && styles.active,
          ]}
          onPress={() => onSelect(day.date)}
        >
          <Text style={styles.dayText}>{day.label}</Text>
          <Text style={styles.dateText}>{day.day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-around" },
  day: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  active: { backgroundColor: "#4C4CFF" },
  dayText: { fontSize: 12 },
  dateText: { fontSize: 14, fontWeight: "600" },
});
