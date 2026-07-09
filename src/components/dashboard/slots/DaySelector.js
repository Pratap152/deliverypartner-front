import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import { TABS } from "../../../utils/constants/slotConstants";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function DaySelector({
  weeks,
  selectedWeek,
  onSelect,
  loading = false,
  activeTab,
}) {
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="small"
          color="#4C4CFF"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Day</Text>

      <View style={styles.row}>
        {weeks.map((item) => {
          const isSelected = selectedWeek === item.date;
          const isToday = item.date === today;

          // Green only for today in Current Week
          const todaySelected =
            activeTab === TABS.CURRENT &&
            isToday &&
            isSelected;

          return (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.day,

                todaySelected && styles.todayActive,

                !todaySelected &&
                  isSelected &&
                  styles.active,
              ]}
              onPress={() => onSelect(item.date)}
            >
              <Text
                style={[
                  styles.dayText,

                  todaySelected &&
                    styles.todayText,

                  !todaySelected &&
                    isSelected &&
                    styles.activeText,
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  styles.dateText,

                  todaySelected &&
                    styles.todayText,

                  !todaySelected &&
                    isSelected &&
                    styles.activeText,
                ]}
              >
                {item.day}
              </Text>

              <View style={styles.dotContainer}>
                {isToday && (
                  <View
                    style={[
                      styles.dot,
                      todaySelected
                        ? styles.todayDot
                        : styles.normalDot,
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  loader: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#F0F0FF",
    borderColor: "#4C4CFF",
    borderWidth: 2,
  },

  todayActive: {
    backgroundColor: "#ECFDF3",
    borderColor: "#22C55E",
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

  todayText: {
    color: "#16A34A",
    fontWeight: "700",
  },

  dotContainer: {
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: isTablet ? 10 : 6,
    height: isTablet ? 10 : 6,
    borderRadius: isTablet ? 5 : 3,
  },

  todayDot: {
    backgroundColor: "#22C55E",
  },

  normalDot: {
    backgroundColor: "#34C759",
  },
});