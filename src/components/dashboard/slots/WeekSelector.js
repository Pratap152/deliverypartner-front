import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;
export default function WeekSelector({ weeks, selectedWeek, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Day</Text>
      <View style={styles.row}>
        {weeks.map((day) => {
          const isSelected = selectedWeek === day.date;
          return (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.day,
                isSelected && styles.active,
              ]}
              onPress={() => onSelect(day.date)}
            >
              <Text style={[styles.dayText, isSelected && styles.activeText]}>{day.label}</Text>
              <Text style={[styles.dateText, isSelected && styles.activeText]}>{day.day}</Text>

              {/* Green Dot indicator if needed (placeholder based on image) */}
              <View style={[styles.dot, isSelected ? styles.activeDot : styles.inactiveDot]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
 label: {
    fontSize: isTablet ? 30 : 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: isTablet ? 20 : 12,
},
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  day: {
    width: isTablet ? 85 : 44,
    height: isTablet ? 140 : 90,
    borderRadius: isTablet ? 24 : 16,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: isTablet ? 18 : 12,
},
  active: {
    borderColor: "#4C4CFF",
    backgroundColor: "#F0F0FF", // Light blue tint
    borderWidth: 2,
  },
  dayText: {
    fontSize: isTablet ? 20 : 13,
    color: "#6B7280",
},
  dateText: {
    fontSize: isTablet ? 34 : 20,
    fontWeight: "700",
    color: "#333",
},
  activeText: {
    color: "#4C4CFF",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  activeDot: {
    backgroundColor: "#34C759", // Green dot for active/available?
  },
  inactiveDot: {
    backgroundColor: "#34C759", // Keep it green for now as per image often showing status
    opacity: 1,
  },
});
