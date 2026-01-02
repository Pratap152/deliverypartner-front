import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SlotCard({
  slot,
  selectable,
  selected,
  onSelect,
  onCancel,
}) {
  const isBooked = slot.isBooked;
  const isCancelled = slot.isCancelled;
  const isAvailable = !isBooked && !isCancelled;

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
      activeOpacity={0.9}
      onPress={selectable ? onSelect : null}
      style={[
        styles.card,
        selected && styles.selectedCard,
        isBooked && styles.bookedCard,
        isCancelled && styles.cancelledCard,
      ]}
    >
      {/* ---------- TOP HEADER ROW ---------- */}
      <View style={styles.headerRow}>
        {/* Left: Icon + Time info */}
        <View style={styles.leftContent}>
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

        {/* Right Content */}
        <View style={styles.rightContent}>
          {/* TRASH ICON (Top-Right) for Booked Slots */}
          {isBooked && (
            <TouchableOpacity onPress={onCancel} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          )}

          {/* Checkbox for Available slots */}
          {isAvailable && selectable && (
            <View style={styles.checkboxWrapper}>
              <View style={[styles.box, selected && styles.checked]}>
                {selected && (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ---------- STATUS ROW ---------- */}
      <View style={styles.statusRow}>
        {isBooked && (
          <View style={styles.bookedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFF" />
            <Text style={styles.statusText}>Booked</Text>
          </View>
        )}

        {isCancelled && (
          <View style={styles.cancelledBadge}>
            <Ionicons name="close-circle" size={16} color="#FFF" />
            <Text style={styles.statusText}>Cancelled</Text>
          </View>
        )}

        {isAvailable && (
          <View style={styles.availableBadge}>
            <Ionicons name="radio-button-on" size={16} color="#FFF" />
            <Text style={styles.statusText}>Available</Text>
          </View>
        )}
      </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContent: {
    paddingLeft: 10,
  },
  trashBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
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

  checkboxWrapper: {
    marginTop: 4,
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

  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  bookedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 160,
    justifyContent: 'center',
  },
  cancelledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6A00",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 160,
    justifyContent: 'center',
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C4CFF", // Blue
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 160,
    justifyContent: 'center',
  },
  statusText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
});
