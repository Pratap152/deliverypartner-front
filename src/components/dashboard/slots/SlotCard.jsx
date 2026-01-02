import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Checkbox from "./Checkbox";

export default function SlotCard({
  slot,
  selectable,
  selected,
  onSelect,
  onCancel,
}) {
  const isBooked = slot.isBooked;
  const isCancelled = slot.isCancelled;

  // Helper to convert 24h string "14:00" -> "02:00 PM"
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    let hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 -> 12
    return `${hours.toString().padStart(2, '0')}:${m} ${suffix}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9} // Slight feedback on press if selectable
      onPress={selectable ? onSelect : null} // Make whole card selectable if available
      style={[
        styles.card,
        selected && styles.selectedCard, // Optional style for selected state
        isBooked && styles.bookedCard,
        isCancelled && styles.cancelledCard,
      ]}
    >
      {/* ---------- TOP HEADER ROW ---------- */}
      <View style={styles.headerRow}>
        {/* Left: Icon + Time info */}
        <View style={styles.leftContent}>

          {/* TRASH ICON (Top-Left) for Booked Slots */}
          {isBooked && (
            <TouchableOpacity onPress={onCancel} style={styles.trashIconWrapper}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          )}

          <View style={styles.iconWrapper}>
            <Ionicons name="flash" size={18} color="#FF6A00" />
          </View>
          <View>
            <Text style={styles.time}>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </Text>
            <Text style={styles.earn}>
              Duration {slot.durationInHours} hrs • Break {slot.breakInMinutes} mins
            </Text>
          </View>
        </View>

        {/* Right: Checkbox (Top-Right as requested) */}
        {!isBooked && !isCancelled && selectable && (
          <View style={styles.checkboxWrapper}>
            <View style={[styles.box, selected && styles.checked]}>
              {selected && (
                <Ionicons name="checkmark" size={12} color="#FFF" />
              )}
            </View>
          </View>
        )}
      </View>

      {/* ---------- STATUS ROW (If Booked/Cancelled) ---------- */}
      {(isBooked || isCancelled) && (
        <View style={styles.statusRow}>
          {isBooked && (
            <View style={styles.statusContainer}>
              <View style={styles.bookedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                <Text style={styles.statusText}>Booked</Text>
              </View>
              {/* Cancel button removed from here, moved to top-left trash icon */}
            </View>
          )}

          {isCancelled && (
            <View style={styles.cancelledBadge}>
              <Ionicons name="close-circle" size={16} color="#FFF" />
              <Text style={styles.statusText}>Cancelled</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 16,
    marginVertical: 8,
  },
  selectedCard: {
    borderColor: "#4C4CFF",
    backgroundColor: "#F0F0FF",
  },
  bookedCard: {
    borderColor: "#34C759",
    backgroundColor: "#F1FFF6",
  },
  cancelledCard: {
    borderColor: "#FF6A00",
    backgroundColor: "#FFF4EC",
  },

  /* Header Row */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Align top
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trashIconWrapper: {
    marginRight: 10,
    padding: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE5D6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  earn: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  /* Checkbox */
  checkboxWrapper: {
    marginLeft: 10,
    marginTop: 4, // Align slightly with icon
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#4C4CFF",
    borderColor: "#4C4CFF",
  },

  /* Status Row */
  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center', // Centered now that icon is gone
  },
  bookedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 24, // Wider badge
    borderRadius: 20,
    justifyContent: 'center',
  },
  cancelledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6A00",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    justifyContent: 'center',
  },
  statusText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
});
